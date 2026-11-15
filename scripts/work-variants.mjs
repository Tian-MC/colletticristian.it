// Versioni ridotte degli screenshot in public/work/. Da rilanciare se ne cambia uno.
import { readdir } from "node:fs/promises";
import sharp from "sharp";

const dir = new URL("../public/work/", import.meta.url).pathname;
const widths = { desktop: [640, 960], mobile: [320] };

for (const file of (await readdir(dir)).sort()) {
  const match = file.match(/^([a-z]+)-(desktop|mobile)\.webp$/);
  if (!match) continue;
  const [, id, kind] = match;
  const { width } = await sharp(dir + file).metadata();
  for (const target of widths[kind].filter((w) => w < width)) {
    const out = `${id}-${kind}-${target}.webp`;
    const info = await sharp(dir + file).resize({ width: target }).webp({ quality: 80 }).toFile(dir + out);
    console.log(`${out}  ${Math.round(info.size / 1024)} KB`);
  }
}
