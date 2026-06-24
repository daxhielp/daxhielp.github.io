import { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

// Mimics VibeDungeon's Rich minimap: a 3x3 grid of discovered/undiscovered rooms
// with the player's current position pulsing.

const ROOM_GLYPHS = [
  ['#', '·', 'S'],
  ['$', '@', '·'],
  ['·', 'B', '#'],
];

function DungeonMapCanvas() {
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

    tRef.current += 0.04;
    const pulse = (Math.sin(tRef.current * 2) + 1) / 2;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0, 0, W, H);

    const cell = Math.min(W, H) / 3.6;
    const gridW = cell * 3;
    const offX = (W - gridW) / 2;
    const offY = (H - gridW) / 2;

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const glyph = ROOM_GLYPHS[row][col];
        const x = offX + col * cell;
        const y = offY + row * cell;
        const isPlayer = glyph === '@';

        ctx.strokeStyle = 'rgba(139,92,246,0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cell, cell);

        if (isPlayer) {
          ctx.fillStyle = `rgba(139,92,246,${0.15 + pulse * 0.2})`;
          ctx.fillRect(x, y, cell, cell);
        }

        ctx.font = `${isPlayer ? 600 : 400} ${cell * 0.4}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isPlayer ? '#c4b5fd' : glyph === '#' ? 'rgba(100,116,139,0.5)' : '#94a3b8';
        ctx.fillText(glyph, x + cell / 2, y + cell / 2);
      }
    }

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '10px monospace';
    ctx.fillStyle = 'rgba(196,181,253,0.5)';
    ctx.fillText('@ you   B battle   S shop   $ fountain', 8, H - 6);

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
    draw();
    observerRef.current = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) play(); else stop(); },
      { threshold: 0.3 }
    );
    if (canvasRef.current) observerRef.current.observe(canvasRef.current);

    return () => {
      stop();
      observerRef.current?.disconnect();
    };
  }, [play, stop, draw]);

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

// Animates an NPC dialogue tree like VibeDungeon's NPC Dialogue Agent: a line
// of narration types out, then numbered choices appear and the cursor steps
// down to the one the player picks before the response line types out.

const NPC_LINE = 'Eldan eyes your blade. "Lost again, are we? Speak your business."';
const CHOICES = [
  'Ask about the shop fountain.',
  'Ask about the Demon King.',
  'Leave without a word.',
];
const PICK_INDEX = 1;
const RESPONSE_LINE = '"The King? Best you turn back now, traveler..."';

function DialogueChoiceCanvas() {
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

    ctx.clearRect(0, 0, W, H);
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';

    // Phase windows: narration (0-0.3), choices fade in (0.3-0.45),
    // cursor steps to pick (0.45-0.75), response types out (0.75-1).
    const narrP = Math.min(progress / 0.3, 1);
    const narrChars = Math.floor(NPC_LINE.length * narrP);

    ctx.fillStyle = 'rgba(196,181,253,0.5)';
    ctx.fillText('Eldan', 8, 20);
    ctx.fillStyle = '#e4e4e7';
    ctx.fillText(NPC_LINE.slice(0, narrChars), 8, 40);
    if (narrP < 1) {
      ctx.fillStyle = 'rgba(196,181,253,0.8)';
      ctx.fillText('_', 8 + ctx.measureText(NPC_LINE.slice(0, narrChars)).width + 1, 40);
    }

    if (progress <= 0.3) return;

    const choiceP = Math.min(Math.max((progress - 0.3) / 0.15, 0), 1);
    const stepP = Math.min(Math.max((progress - 0.45) / 0.3, 0), 1);
    const activeChoice = Math.min(Math.floor(stepP * (CHOICES.length + 0.2)), PICK_INDEX);
    const locked = progress >= 0.75;

    CHOICES.forEach((choice, i) => {
      const y = 72 + i * 22;
      const alpha = choiceP;
      const isActive = i === activeChoice;
      const isPicked = locked && i === PICK_INDEX;

      if (isActive || isPicked) {
        ctx.fillStyle = `rgba(139,92,246,${isPicked ? 0.22 : 0.12})`;
        ctx.beginPath();
        ctx.roundRect(4, y - 14, W - 8, 20, 6);
        ctx.fill();
      }

      ctx.fillStyle = isPicked
        ? `rgba(196,181,253,${alpha})`
        : isActive
          ? `rgba(232,232,255,${alpha})`
          : `rgba(148,163,184,${alpha * 0.7})`;
      ctx.fillText(`${(isActive || isPicked) ? '>' : ' '} ${i + 1}. ${choice}`, 12, y);
    });

    if (!locked) return;

    const respP = Math.min(Math.max((progress - 0.78) / 0.22, 0), 1);
    const respChars = Math.floor(RESPONSE_LINE.length * respP);
    const respY = 72 + CHOICES.length * 22 + 22;

    ctx.fillStyle = 'rgba(196,181,253,0.5)';
    ctx.fillText('Eldan', 8, respY);
    ctx.fillStyle = '#facc15';
    ctx.fillText(RESPONSE_LINE.slice(0, respChars), 8, respY + 20);
    if (respP < 1 && respP > 0) {
      ctx.fillStyle = 'rgba(196,181,253,0.8)';
      ctx.fillText('_', 8 + ctx.measureText(RESPONSE_LINE.slice(0, respChars)).width + 1, respY + 20);
    }
  }, []);

  const play = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const duration = 5200;
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

const VISUALS = [
  { label: 'minimap', Canvas: DungeonMapCanvas },
  { label: 'terminal', Canvas: DialogueChoiceCanvas },
];

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
          {VISUALS.map(({ label, Canvas }) => (
            <div key={label} className="rounded-xl overflow-hidden border border-white/5">
              <div className="px-3 py-2 bg-black/30 border-b border-white/5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-zinc-700" />
                <span className="font-mono text-[10px] text-zinc-500">{label}</span>
              </div>
              <Canvas />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
