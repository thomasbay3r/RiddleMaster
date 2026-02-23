import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  length: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function createStars(width: number, height: number, count: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: randomBetween(0.3, 2),
      baseAlpha: randomBetween(0.3, 1),
      twinkleSpeed: randomBetween(0.5, 2.5),
      twinklePhase: Math.random() * Math.PI * 2,
    });
  }
  return stars;
}

function spawnShootingStar(width: number, height: number): ShootingStar {
  const angle = randomBetween(Math.PI * 0.1, Math.PI * 0.4);
  const speed = randomBetween(8, 16);
  return {
    x: randomBetween(0, width * 0.8),
    y: randomBetween(0, height * 0.3),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: 0,
    maxLife: randomBetween(30, 60),
    length: randomBetween(60, 120),
  };
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useStarfield(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* ---- sizing -------------------------------------------------- */

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      starsRef.current = createStars(canvas.width, canvas.height, 400);
    }
    resize();
    window.addEventListener("resize", resize);

    /* ---- draw helpers -------------------------------------------- */

    function drawBackground() {
      if (!ctx || !canvas) return;
      const w = canvas.width;
      const h = canvas.height;

      // Linear gradient background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, "#0a0e27");
      bgGrad.addColorStop(1, "#1a0533");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Nebula glow — purple (centre-right)
      const nebula1 = ctx.createRadialGradient(
        w * 0.7,
        h * 0.4,
        0,
        w * 0.7,
        h * 0.4,
        w * 0.45,
      );
      nebula1.addColorStop(0, "rgba(61,31,92,0.18)");
      nebula1.addColorStop(1, "rgba(61,31,92,0)");
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, w, h);

      // Nebula glow — blue (centre-left)
      const nebula2 = ctx.createRadialGradient(
        w * 0.25,
        h * 0.6,
        0,
        w * 0.25,
        h * 0.6,
        w * 0.4,
      );
      nebula2.addColorStop(0, "rgba(26,58,92,0.15)");
      nebula2.addColorStop(1, "rgba(26,58,92,0)");
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, w, h);
    }

    function drawStars(time: number) {
      if (!ctx) return;
      for (const star of starsRef.current) {
        const twinkle =
          Math.sin(time * 0.001 * star.twinkleSpeed + star.twinklePhase) *
            0.5 +
          0.5;
        const alpha = star.baseAlpha * (0.4 + 0.6 * twinkle);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }
    }

    function updateAndDrawShootingStars() {
      if (!ctx || !canvas) return;

      // Chance to spawn a new shooting star (~0.3 % per frame)
      if (Math.random() < 0.003) {
        shootingStarsRef.current.push(
          spawnShootingStar(canvas.width, canvas.height),
        );
      }

      shootingStarsRef.current = shootingStarsRef.current.filter((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.life += 1;

        const progress = s.life / s.maxLife;
        const alpha = progress < 0.5 ? progress * 2 : (1 - progress) * 2;

        // Trail
        const tailX = s.x - (s.vx / Math.hypot(s.vx, s.vy)) * s.length;
        const tailY = s.y - (s.vy / Math.hypot(s.vx, s.vy)) * s.length;

        const gradient = ctx!.createLinearGradient(tailX, tailY, s.x, s.y);
        gradient.addColorStop(0, `rgba(255,255,255,0)`);
        gradient.addColorStop(1, `rgba(255,255,255,${alpha})`);

        ctx!.beginPath();
        ctx!.moveTo(tailX, tailY);
        ctx!.lineTo(s.x, s.y);
        ctx!.strokeStyle = gradient;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();

        return s.life < s.maxLife;
      });
    }

    /* ---- animation loop ------------------------------------------ */

    function frame(time: number) {
      if (!ctx || !canvas) return;
      drawBackground();
      drawStars(time);
      updateAndDrawShootingStars();
      animFrameRef.current = requestAnimationFrame(frame);
    }

    animFrameRef.current = requestAnimationFrame(frame);

    /* ---- cleanup ------------------------------------------------- */

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]);
}
