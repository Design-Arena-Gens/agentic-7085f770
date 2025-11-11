"use client";

import VideoGenerator from "../components/VideoGenerator";

export default function Page() {
  return (
    <main className="page">
      <header className="hero">
        <h1>Crie um vídeo engraçado</h1>
        <p>
          Clique no botão para gerar automaticamente um mini vídeo caótico com
          batatas dançantes, narrador dramático e explosões de confete.
        </p>
      </header>
      <VideoGenerator />
      <footer className="footer">
        <p>
          Feito com 💥 por um agente incansável — tudo acontece diretamente no
          seu navegador.
        </p>
      </footer>
    </main>
  );
}
