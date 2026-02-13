import { useEffect, useRef, useCallback } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}

const CosmicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const starsRef = useRef<Star[]>([]);
  const animFrameRef = useRef<number>(0);

  const initStars = useCallback((w: number, h: number) => {
    const count = Math.floor((w * h) / 4000);
    starsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.3 + 0.05,
      opacity: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
      initStars(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY + window.scrollY };
    };
    window.addEventListener("mousemove", onMouse);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      starsRef.current.forEach((star) => {
        star.pulse += star.pulseSpeed;
        star.y -= star.speed;
        if (star.y < -5) {
          star.y = canvas.height + 5;
          star.x = Math.random() * canvas.width;
        }

        const dx = star.x - mx;
        const dy = star.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mouseInfluence = dist < 200 ? 1 - dist / 200 : 0;

        const glow = Math.sin(star.pulse) * 0.3 + 0.7;
        const finalOpacity = Math.min(1, star.opacity * glow + mouseInfluence * 0.6);
        const finalSize = star.size + mouseInfluence * 3;

        if (mouseInfluence > 0) {
          ctx.beginPath();
          const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, finalSize * 4);
          gradient.addColorStop(0, `hsla(260, 80%, 70%, ${finalOpacity * 0.4})`);
          gradient.addColorStop(1, `hsla(260, 80%, 70%, 0)`);
          ctx.fillStyle = gradient;
          ctx.arc(star.x, star.y, finalSize * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.fillStyle = `hsla(220, 80%, 90%, ${finalOpacity})`;
        ctx.arc(star.x, star.y, finalSize, 0, Math.PI * 2);
        ctx.fill();
      });

      // Shooting star effect (rare)
      if (Math.random() < 0.002) {
        const sx = Math.random() * canvas.width;
        const sy = Math.random() * canvas.height * 0.5;
        const angle = Math.PI / 4 + Math.random() * 0.5;
        const len = 60 + Math.random() * 80;
        const gradient = ctx.createLinearGradient(sx, sy, sx + Math.cos(angle) * len, sy + Math.sin(angle) * len);
        gradient.addColorStop(0, "hsla(260, 80%, 80%, 0.8)");
        gradient.addColorStop(1, "hsla(260, 80%, 80%, 0)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + Math.cos(angle) * len, sy + Math.sin(angle) * len);
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [initStars]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
};

export default CosmicBackground;
