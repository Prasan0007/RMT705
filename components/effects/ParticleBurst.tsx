"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  rot: number;
  vrot: number;
}

interface ParticleBurstProps {
  /** Increment this number to fire a new burst. */
  trigger: number;
  colors: string[];
  count?: number;
  originX?: number; // 0..1
  originY?: number; // 0..1
  power?: number;
  className?: string;
}

/** Lightweight canvas confetti/spark system — no external deps. */
export function ParticleBurst({
  trigger,
  colors,
  count = 90,
  originX = 0.5,
  originY = 0.5,
  power = 1,
  className,
}: ParticleBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth * devicePixelRatio;
      canvas.height = parent.clientHeight * devicePixelRatio;
      canvas.style.width = `${parent.clientWidth}px`;
      canvas.style.height = `${parent.clientHeight}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    if (trigger > 0) {
      const w = canvas.width;
      const h = canvas.height;
      const ox = w * originX;
      const oy = h * originY;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (2 + Math.random() * 6) * power * devicePixelRatio;
        particles.current.push({
          x: ox,
          y: oy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - speed * 0.3,
          life: 0,
          maxLife: 60 + Math.random() * 40,
          size: (3 + Math.random() * 5) * devicePixelRatio,
          color: colors[Math.floor(Math.random() * colors.length)],
          rot: Math.random() * Math.PI,
          vrot: (Math.random() - 0.5) * 0.3,
        });
      }
    }

    function tick() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach((p) => {
        p.vy += 0.18 * devicePixelRatio;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.rot += p.vrot;
        p.life++;
        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      });
      particles.current = particles.current.filter((p) => p.life < p.maxLife);
      raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return <canvas ref={canvasRef} className={className} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />;
}
