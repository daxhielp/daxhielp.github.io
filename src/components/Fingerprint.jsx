import { useEffect, useMemo, useRef } from 'react';

// AudioPrint-style "fingerprint" for a project: spectral peaks plus the
// combinatorial hash pairs between nearby peaks, seeded by the project slug.

function hashStr(str) {
  let h = 2166136261;
  for (const c of str) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PEAKS = 30;

function buildPrint(seed) {
  const rand = mulberry32(hashStr(seed));
  const peaks = Array.from({ length: PEAKS }, (_, i) => ({ x: (i + 0.1 + rand() * 0.8) / PEAKS, y: 0.08 + rand() * 0.84 }));
  const pairs = [];
  for (let i = 0; i < PEAKS; i++) {
    for (let j = i + 1; j < Math.min(PEAKS, i + 5); j++) if (rand() < 0.55) pairs.push([i, j]);
  }
  return { peaks, pairs };
}

export default function Fingerprint({ seed, title, theme }) {
  const ref = useRef(null);
  const print = useMemo(() => buildPrint(seed), [seed]);

  useEffect(() => {
    const cv = ref.current;
    const draw = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(r.width * dpr);
      cv.height = Math.round(r.height * dpr);
      const ctx = cv.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const { width: w, height: h } = r;
      const css = getComputedStyle(cv);
      const color = css.getPropertyValue('--tr').trim();

      ctx.strokeStyle = css.getPropertyValue('--line').trim();
      ctx.lineWidth = 1;
      for (let i = 1; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo((i * w) / 10, 0);
        ctx.lineTo((i * w) / 10, h);
        ctx.stroke();
      }
      for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (i * h) / 4);
        ctx.lineTo(w, (i * h) / 4);
        ctx.stroke();
      }

      const pts = print.peaks.map((p) => ({ x: p.x * w, y: p.y * h }));
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.32;
      for (const [i, j] of print.pairs) {
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = color;
      for (const p of pts) ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
    };
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [print, theme]);

  return (
    <figure className="fp">
      <canvas ref={ref} role="img" aria-label={`Generated fingerprint graphic for ${title}`} />
      <figcaption>
        fingerprint · {PEAKS} peaks · {print.pairs.length} hashes · t →
      </figcaption>
    </figure>
  );
}
