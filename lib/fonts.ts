import localFont from "next/font/local";

export const display = localFont({
  src: [
    { path: "./fonts/fraunces-latin-normal.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/fraunces-latin-italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-fraunces",
  adjustFontFallback: "Times New Roman",
  display: "swap",
});

export const text = localFont({
  src: "./fonts/instrument-sans-latin.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-instrument",
  display: "swap",
});
