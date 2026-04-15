import { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

// ── Waveform canvas ───────────────────────────────────────────────────────────
// Mimics VoiceSense's real-time WaveformVisualizer: a violet gradient sine wave
// with a glow effect, animated at ~60fps.

function WaveformCanvas() {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const tRef = useRef(0);
  const observerRef = useRef(null);
  const runningRef = useRef(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;

    tRef.current += 0.03;
    const t = tRef.current;

    ctx.clearRect(0, 0, W, H);

    // Gradient stroke — left violet → centre lavender → right violet
    const gradient = ctx.createLinearGradient(0, 0, W, 0);
    gradient.addColorStop(0,   '#6d28d9');
    gradient.addColorStop(0.5, '#c4b5fd');
    gradient.addColorStop(1,   '#6d28d9');

    ctx.lineWidth   = 2.5;
    ctx.strokeStyle = gradient;
    ctx.shadowColor = '#8b5cf6';
    ctx.shadowBlur  = 14;
    ctx.lineJoin    = 'round';
    ctx.lineCap     = 'round';

    ctx.beginPath();
    const points = 200;
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * W;
      // Compound sine for organic feel
      const y = H / 2
        + Math.sin(i * 0.08 + t * 2.1) * H * 0.18
        + Math.sin(i * 0.16 + t * 1.3) * H * 0.10
        + Math.sin(i * 0.04 + t * 0.9) * H * 0.08;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Label
    ctx.shadowBlur  = 0;
    ctx.fillStyle   = 'rgba(196,181,253,0.5)';
    ctx.font        = '10px monospace';
    ctx.fillText('Live waveform', 8, H - 6);
    ctx.fillStyle   = 'rgba(100,116,139,0.7)';
    ctx.fillText('MediaRecorder API', W - 118, H - 6);

    if (runningRef.current) rafRef.current = requestAnimationFrame(draw);
  }, []);

  const play = useCallback(() => {
    runningRef.current = true;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(draw);
  }, [draw]);

  const stop = useCallback(() => {
    runningRef.current = false;
    cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    // Draw a static flat line initially
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth   = 1.5;
        ctx.strokeStyle = 'rgba(139,92,246,0.2)';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) play(); else stop(); },
      { threshold: 0.3 }
    );
    if (canvasRef.current) observerRef.current.observe(canvasRef.current);

    return () => {
      stop();
      observerRef.current?.disconnect();
    };
  }, [play, stop]);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={160}
      className="w-full rounded-lg"
      style={{ height: '160px', display: 'block', background: 'rgba(0,0,0,0.25)' }}
    />
  );
}

// ── Emotion bars canvas ───────────────────────────────────────────────────────
// Animates 8 emotion probability bars like VoiceSense's ResultView, cycling
// through emotions to show the model's output.

const EMOTIONS = [
  { label: 'happy',     color: '#facc15', prob: 0.74 },
  { label: 'calm',      color: '#34d399', prob: 0.52 },
  { label: 'neutral',   color: '#94a3b8', prob: 0.41 },
  { label: 'sad',       color: '#60a5fa', prob: 0.28 },
  { label: 'surprised', color: '#f472b6', prob: 0.22 },
  { label: 'fearful',   color: '#a78bfa', prob: 0.15 },
  { label: 'angry',     color: '#f87171', prob: 0.10 },
  { label: 'disgust',   color: '#fb923c', prob: 0.06 },
];

function EmotionBarsCanvas() {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const observerRef = useRef(null);

  const draw = useCallback((progress) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;

    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.clearRect(0, 0, W, H);

    const rowH   = H / (EMOTIONS.length + 1);
    const labelW = 68;
    const probW  = 40;
    const barX   = labelW + 8;
    const barW   = W - labelW - probW - 16;
    const maxProb = EMOTIONS[0].prob;

    EMOTIONS.forEach(({ label, color, prob }, i) => {
      const stagger = Math.min(Math.max((progress - i * 0.07) / 0.6, 0), 1);
      const y = rowH * (i + 0.5) + rowH / 2;

      // Label
      ctx.fillStyle = i === 0
        ? color
        : `rgba(100,116,139,${0.4 + stagger * 0.5})`;
      ctx.font = `${i === 0 ? 600 : 400} 10px monospace`;
      ctx.textAlign = 'right';
      ctx.fillText(label, labelW, y + 4);

      // Bar track
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.beginPath();
      ctx.roundRect(barX, y - 3, barW, 6, 3);
      ctx.fill();

      // Bar fill
      const fillW = barW * (prob / maxProb) * stagger;
      if (fillW > 0) {
        ctx.save();
        ctx.shadowColor = i === 0 ? color : 'transparent';
        ctx.shadowBlur  = i === 0 ? 8 : 0;
        ctx.fillStyle   = i === 0 ? color : '#334155';
        ctx.beginPath();
        ctx.roundRect(barX, y - 3, fillW, 6, 3);
        ctx.fill();
        ctx.restore();
      }

      // Percentage
      ctx.fillStyle = `rgba(100,116,139,${stagger * 0.8})`;
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`${Math.round(prob * 100 * stagger)}%`, barX + barW + 6, y + 4);
    });

    // Confidence badge on top right
    if (progress > 0.7) {
      const alpha = (progress - 0.7) / 0.3;
      ctx.fillStyle = `rgba(250,204,21,${0.08 * alpha})`;
      const badgeW = 114, badgeH = 22;
      const bx = W - badgeW - 4, by = 4;
      ctx.beginPath();
      ctx.roundRect(bx, by, badgeW, badgeH, 11);
      ctx.fill();
      ctx.strokeStyle = `rgba(250,204,21,${0.3 * alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = `rgba(250,204,21,${alpha})`;
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('74.2% confidence', bx + badgeW / 2, by + 14);
    }

    ctx.textAlign = 'left';
  }, []);

  const play = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const duration = 2400;
    const animate = (now) => {
      const p = Math.min((now - start) / duration, 1);
      draw(p);
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
  }, [draw]);

  useEffect(() => {
    draw(0);
    observerRef.current = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) play(); },
      { threshold: 0.3 }
    );
    if (canvasRef.current) observerRef.current.observe(canvasRef.current);
    return () => {
      cancelAnimationFrame(rafRef.current);
      observerRef.current?.disconnect();
    };
  }, [draw, play]);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={192}
      className="w-full rounded-lg"
      style={{ height: '192px', display: 'block', background: 'rgba(0,0,0,0.25)' }}
    />
  );
}

// ── Featured Project ──────────────────────────────────────────────────────────

export default function FeaturedProject({ project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.03] backdrop-blur-sm"
    >
      {/* Top label */}
      <div className="px-6 pt-5 pb-4 border-b border-white/5 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Featured Project</span>
        <span className="font-mono text-xs text-zinc-600">{project.year}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left: info */}
        <div className="p-6 md:p-10 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h3 className="text-3xl md:text-4xl font-bold text-white">{project.title}</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 text-[10px] uppercase tracking-wider font-medium border border-violet-500/20">
                {project.type}
              </span>
            </div>

            <p className="text-zinc-400 text-base leading-relaxed mb-8">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[11px] text-zinc-400 border border-zinc-800 bg-zinc-900/60 px-3 py-1 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors"
              >
                <Github size={16} />
                View Code
              </a>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 text-white border border-zinc-700 rounded-full text-sm font-medium hover:bg-zinc-700 transition-colors"
              >
                <ExternalLink size={16} />
                Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Right: animated visuals */}
        <div className="border-t lg:border-t-0 lg:border-l border-white/5 p-6 md:p-8 flex flex-col gap-4 bg-black/20">
          <div className="rounded-xl overflow-hidden border border-white/5">
            <div className="px-3 py-2 bg-black/30 border-b border-white/5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zinc-700" />
              <span className="font-mono text-[10px] text-zinc-500">WaveformVisualizer.tsx</span>
            </div>
            <WaveformCanvas />
          </div>

          <div className="rounded-xl overflow-hidden border border-white/5">
            <div className="px-3 py-2 bg-black/30 border-b border-white/5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zinc-700" />
              <span className="font-mono text-[10px] text-zinc-500">ResultView.tsx</span>
            </div>
            <EmotionBarsCanvas />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
