"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const VIDEO_WIDTH = 960;
const VIDEO_HEIGHT = 540;
const DURATION_MS = 8000;
const FPS = 60;

export default function VideoGenerator() {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("Pronto para começar");
  const [videoUrl, setVideoUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!canvasRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = VIDEO_WIDTH;
      canvas.height = VIDEO_HEIGHT;
      canvas.style.display = "none";
      canvasRef.current = canvas;
      document.body.appendChild(canvas);
    }

    return () => {
      if (canvasRef.current?.isConnected) {
        canvasRef.current.remove();
      }
    };
  }, []);

  const drawCharacters = useCallback((ctx, progress, timestamp) => {
    ctx.clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);

    const gradient = ctx.createLinearGradient(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
    gradient.addColorStop(0, "#0f172a");
    gradient.addColorStop(1, "#1d4ed8");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);

    ctx.fillStyle = "rgba(255,255,255,0.07)";
    for (let i = 0; i < 120; i++) {
      const angle = (timestamp / 400 + i) * 0.2;
      const x = (Math.sin(angle) * 0.4 + 0.5) * VIDEO_WIDTH;
      const y = ((i % 20) / 20) * VIDEO_HEIGHT;
      const w = 260;
      const h = 26;
      ctx.fillRect(x - w / 2, y - h / 2, w, h);
    }

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, VIDEO_HEIGHT - 120, VIDEO_WIDTH, 140);
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(0, VIDEO_HEIGHT - 120, VIDEO_WIDTH, 6);

    const potatoes = [
      {
        baseX: VIDEO_WIDTH * 0.25,
        wobble: Math.sin(timestamp / 220) * 12,
        color: "#f97316",
        eyeOffset: 20,
        eyebrow: 18
      },
      {
        baseX: VIDEO_WIDTH * 0.5,
        wobble: Math.sin(timestamp / 160 + 1.2) * 18,
        color: "#a855f7",
        eyeOffset: 28,
        eyebrow: 22
      },
      {
        baseX: VIDEO_WIDTH * 0.75,
        wobble: Math.sin(timestamp / 260 + 2.1) * 24,
        color: "#22d3ee",
        eyeOffset: 26,
        eyebrow: 14
      }
    ];

    potatoes.forEach((potato, index) => {
      const x = potato.baseX + Math.sin(timestamp / 300 + index) * 60;
      const y =
        VIDEO_HEIGHT -
        120 -
        120 +
        Math.sin(timestamp / (200 + index * 30)) * 30;
      const width = 170 + Math.sin(timestamp / 180 + index) * 10;
      const height = 230 + Math.cos(timestamp / 200 + index) * 12;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.sin(timestamp / 500 + index) * 0.2);

      const gradientPotato = ctx.createLinearGradient(-width / 2, -height / 2, width / 2, height / 2);
      gradientPotato.addColorStop(0, potato.color);
      gradientPotato.addColorStop(1, "#facc15");
      ctx.fillStyle = gradientPotato;
      ctx.beginPath();
      ctx.ellipse(0, 0, width / 2, height / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#1f2937";
      ctx.beginPath();
      ctx.ellipse(-potato.eyeOffset, -potato.eyebrow, 18, 24, 0, 0, Math.PI * 2);
      ctx.ellipse(potato.eyeOffset, -potato.eyebrow, 18, 24, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(-potato.eyeOffset - 2, -potato.eyebrow - 4, 8, 12, 0, 0, Math.PI * 2);
      ctx.ellipse(potato.eyeOffset + 2, -potato.eyebrow - 6, 8, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(0, potato.wobble, 40, 0.3, Math.PI - 0.3);
      ctx.stroke();

      if (progress > 0.35 && progress < 0.75 && index === 1) {
        ctx.save();
        ctx.rotate(Math.sin(timestamp / 140) * 0.8);
        ctx.fillStyle = "rgba(37, 99, 235, 0.22)";
        ctx.beginPath();
        ctx.ellipse(0, height / 2, width * 0.2, height * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    });

    const confettiCount = 130;
    for (let i = 0; i < confettiCount; i++) {
      const seed = i * 47.21;
      const localProgress = (progress * 2 + (i % 10) * 0.1) % 1;
      const x = (Math.sin(timestamp / 90 + seed) * 0.45 + 0.5) * VIDEO_WIDTH;
      const y =
        ((localProgress + (seed % 0.3)) % 1) * (VIDEO_HEIGHT + 200) - 120;
      const rotation = timestamp / 200 + seed;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = `hsl(${(seed * 47 + timestamp / 5) % 360}, 80%, 60%)`;
      ctx.fillRect(-6, -16, 12, 32);
      ctx.restore();
    }

    if (progress > 0.15 && progress < 0.85) {
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      const bubbleWidth = 420;
      const bubbleHeight = 140;
      const bubbleX = VIDEO_WIDTH * 0.15;
      const bubbleY = VIDEO_HEIGHT * 0.12;
      const radius = 30;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, radius);
      } else {
        const r = radius;
        ctx.moveTo(bubbleX + r, bubbleY);
        ctx.lineTo(bubbleX + bubbleWidth - r, bubbleY);
        ctx.quadraticCurveTo(
          bubbleX + bubbleWidth,
          bubbleY,
          bubbleX + bubbleWidth,
          bubbleY + r
        );
        ctx.lineTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight - r);
        ctx.quadraticCurveTo(
          bubbleX + bubbleWidth,
          bubbleY + bubbleHeight,
          bubbleX + bubbleWidth - r,
          bubbleY + bubbleHeight
        );
        ctx.lineTo(bubbleX + r, bubbleY + bubbleHeight);
        ctx.quadraticCurveTo(
          bubbleX,
          bubbleY + bubbleHeight,
          bubbleX,
          bubbleY + bubbleHeight - r
        );
        ctx.lineTo(bubbleX, bubbleY + r);
        ctx.quadraticCurveTo(bubbleX, bubbleY, bubbleX + r, bubbleY);
      }
      ctx.fill();

      ctx.fillStyle = "#1f2937";
      ctx.font = "bold 42px 'Comic Sans MS', 'Comic Neue', system-ui";
      ctx.fillText("NARRADOR DRAMÁTICO:", VIDEO_WIDTH * 0.18, VIDEO_HEIGHT * 0.18);
      ctx.font = "34px 'Comic Sans MS', 'Comic Neue', system-ui";
      const phrases = [
        "🍟 A dança da batata nunca falha!",
        "🥔 Quem chamou o purê frenético?",
        "🎉 Batatas com autoestima astral!"
      ];
      const index = Math.floor(((timestamp / 1200) % 3 + 3) % 3);
      ctx.fillText(phrases[index], VIDEO_WIDTH * 0.18, VIDEO_HEIGHT * 0.26);
      ctx.fillText("Deslize para rir sem moderação.", VIDEO_WIDTH * 0.18, VIDEO_HEIGHT * 0.34);
    }

    if (progress > 0.72) {
      const flashStrength = Math.sin(timestamp / 40) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.25 * flashStrength})`;
      ctx.fillRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
      ctx.fillStyle = `rgba(249, 115, 22, ${0.5 * flashStrength})`;
      ctx.font = "bold 120px 'Bangers', 'Arial Black', sans-serif";
      ctx.fillText("BOOM!", VIDEO_WIDTH * 0.23, VIDEO_HEIGHT * 0.57);
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    ctx.font = "bold 56px 'Fredoka One', system-ui";
    ctx.textAlign = "center";
    ctx.fillText("DANÇA DAS BATATAS IMPROVÁVEIS", VIDEO_WIDTH / 2, 90);
    ctx.textAlign = "left";
  }, []);

  const generateVideo = useCallback(async () => {
    if (isRecording) {
      return;
    }
    setError(null);
    setVideoUrl(null);

    if (typeof window === "undefined") {
      setError("Execução somente no navegador.");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      setError("Canvas não encontrado.");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setError("Contexto 2D indisponível.");
      return;
    }

    if (!canvas.captureStream) {
      setError("Seu navegador não suporta captura desta animação.");
      return;
    }

    let mimeType =
      MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : MediaRecorder.isTypeSupported("video/webm;codecs=vp8")
        ? "video/webm;codecs=vp8"
        : "";

    if (!mimeType) {
      setError("Não consegui encontrar um formato de vídeo suportado.");
      return;
    }

    try {
      const stream = canvas.captureStream(FPS);
      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 8_000_000
      });

      const chunks = [];
      recorder.ondataavailable = (event) => {
        if (event.data?.size) {
          chunks.push(event.data);
        }
      };

      recorder.onstart = () => {
        setIsRecording(true);
        setStatus("Gerando caos… capturando a dança das batatas 🥔");
      };

      recorder.onerror = (event) => {
        setError(
          event.error?.message || "Erro inesperado durante a captura do vídeo."
        );
        setIsRecording(false);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setIsRecording(false);
        setStatus("Vídeo pronto! Aperte o play e ria.");
      };

      recorder.start();

      const start = performance.now();
      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / DURATION_MS, 1);
        drawCharacters(ctx, progress, elapsed);

        if (elapsed < DURATION_MS) {
          requestAnimationFrame(step);
        } else {
          recorder.stop();
        }
      };

      requestAnimationFrame(step);
    } catch (err) {
      setError(err.message || "Algo saiu do script durante a gravação.");
      setIsRecording(false);
    }
  }, [drawCharacters, isRecording]);

  return (
    <section className="generator">
      <button onClick={generateVideo} disabled={isRecording}>
        {isRecording ? "Gerando vídeo..." : "Gerar vídeo engraçado agora"}
      </button>

      <div className="status">
        <span>{status}</span>
      </div>

      {error && (
        <div className="status" style={{ color: "#ef4444" }}>
          {error}
        </div>
      )}

      {videoUrl && (
        <div className="preview">
          <video
            controls
            src={videoUrl}
            width={VIDEO_WIDTH}
            height={VIDEO_HEIGHT}
            preload="metadata"
          />
          <a href={videoUrl} download="video-engracado.webm">
            Baixar vídeo engraçado
          </a>
        </div>
      )}

      <div className="tips">
        <strong>Como funciona?</strong>
        <span>
          Geramos os quadros via Canvas 2D, capturamos com MediaRecorder e
          transformamos tudo em um arquivo webm pronto para risadas.
        </span>
        <span>
          A renderização leva cerca de {Math.round(DURATION_MS / 1000)} segundos.
        </span>
        <span>
          Caso seu navegador não suporte a captura, experimente o Chrome ou Edge.
        </span>
      </div>
    </section>
  );
}
