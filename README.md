# colletticristian.it

Il mio sito: siti web, gestionali su misura e assistenza informatica a Parma.

https://colletticristian.it

## Tecnologie

- Next.js 16 con export statico: niente server Node per le pagine, solo file serviti da nginx
- React 19, TypeScript, Tailwind CSS 4
- Motion e Lenis per animazioni e scorrimento
- Italiano sulla radice, inglese sotto `/en`

## Struttura

- `app/`: le pagine, una cartella per lingua
- `components/`: sezioni della home, pagine dei servizi e casi studio
- `content/`: tutti i testi (`it.ts`, `en.ts`) e gli indirizzi delle pagine
- `server/contact.mjs`: riceve il form dei contatti e lo inoltra su Telegram
- `deploy/`: configurazione di nginx, servizio systemd e statistiche con GoAccess

## Avvio

```
npm install
npm run dev
```

Per la versione da pubblicare:

```
npm run build -- --webpack
```

I file finiscono in `out/`.

## Privacy

Nessun cookie e nessun servizio di analisi esterno. Le statistiche si ricavano dai log del server con GoAccess, dopo aver accorciato gli IP.

---

Codice pubblicato solo per mostrarlo: tutti i diritti riservati.
