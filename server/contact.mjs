// Form contatti -> bot Telegram. Ascolta solo in locale, Nginx gli passa /api/contact.
import http from "node:http";

const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, PORT = "8790" } = process.env;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error("mancano TELEGRAM_BOT_TOKEN e/o TELEGRAM_CHAT_ID");
  process.exit(1);
}

const LIMITS = { nome: 100, contatto: 200, esigenze: 500, messaggio: 3000, lingua: 2 };
const MAX_BODY = 16 * 1024;

const WINDOW = 60 * 60 * 1000;
const PER_IP = 3;
const TOTAL = 20;

const sent = [];

function limited(ip) {
  const now = Date.now();
  while (sent.length && now - sent[0].at > WINDOW) sent.shift();
  if (sent.length >= TOTAL) return "totale";
  if (sent.filter((s) => s.ip === ip).length >= PER_IP) return "per IP";
  return null;
}

function reply(res, status) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: status === 200 }));
}

async function readJson(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY) throw new Error("richiesta troppo grande");
    chunks.push(chunk);
  }
  const data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  if (typeof data !== "object" || data === null) throw new Error("non e' un oggetto");
  return data;
}

function field(data, key) {
  const value = typeof data[key] === "string" ? data[key].trim() : "";
  return value.slice(0, LIMITS[key]);
}

function compose({ nome, contatto, esigenze, messaggio, lingua }) {
  const lines = ["📬 Nuovo messaggio dal sito", "", `Nome: ${nome}`, `Contatto: ${contatto}`];
  if (lingua === "en") lines.push("Lingua: EN");
  if (esigenze) lines.push(`Mi serve: ${esigenze}`);
  if (messaggio) lines.push("", messaggio);
  return lines.join("\n");
}

async function sendToTelegram(text) {
  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new Error(`Telegram ha risposto ${response.status}: ${await response.text()}`);
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method !== "POST") return reply(res, 405);

  let data;
  try {
    data = await readJson(req);
  } catch {
    return reply(res, 400);
  }

  if (data.sito) return reply(res, 200);

  const fields = {
    nome: field(data, "nome"),
    contatto: field(data, "contatto"),
    esigenze: field(data, "esigenze"),
    messaggio: field(data, "messaggio"),
    lingua: field(data, "lingua"),
  };
  if (!fields.nome || !fields.contatto) return reply(res, 400);

  const ip = req.headers["x-real-ip"] ?? req.socket.remoteAddress;
  const limit = limited(ip);
  if (limit) {
    console.warn(`limite ${limit} raggiunto, messaggio scartato`);
    return reply(res, 429);
  }

  try {
    await sendToTelegram(compose(fields));
  } catch (error) {
    console.error("invio a Telegram non riuscito:", error.message);
    return reply(res, 502);
  }
  sent.push({ ip, at: Date.now() });
  reply(res, 200);
});

server.listen(Number(PORT), "127.0.0.1", () => {
  console.log(`in ascolto su 127.0.0.1:${PORT}`);
});
