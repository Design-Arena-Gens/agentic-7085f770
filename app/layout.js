"use client";

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <title>Gerador de Vídeo Engraçado</title>
        <meta
          name="description"
          content="Gere um vídeo engraçado com batatas dançantes e caos animado direto no navegador."
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
