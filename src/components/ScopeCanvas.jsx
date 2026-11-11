import { useEffect, useRef } from 'react';
import { RATIOS } from '../data/content';

// ASCII "phosphor" oscilloscope in XY mode. A Lissajous figure is sampled each frame,
// pushed around by the cursor (magnet), rippled by click shockwaves, and kept off the
// open card (obstacle). Samples are splatted into a character grid that decays like phosphor.

const CW = 8; // cell width (px)
const CH = 13; // cell height (px)
const RAMP = ' .,:;=+*#%@';
const SAMPLES = 2600;
const MAGNET_RADIUS = 150;
const PULSE_LIFE = 1.3; // s
const PULSE_SPEED = 560; // px/s
const CARD_MARGIN = 28; // px kept clear around the card
const MONO = '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

const lerp = (a, b, k) => a + (b - a) * k;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const readVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export default function ScopeCanvas({ ratioKey, channel, theme, obstacleRef, hasObstacle, readoutRef }) {
  const canvasRef = useRef(null);
  const live = useRef({ ratioKey: 'home', hasObstacle: false, color: '#f5d33b', grid: '#3b404a' });

  // Animation loop + input. Mounted once; reads the latest props from `live`.
  useEffect(() => {
    const cv = canvasRef.current;
    const s = live.current;
    Object.assign(s, { a: 1, b: 1, zoom: 1, obs: 0, mx: 0, my: 0, mIn: false, down: false, pulses: [], t: 0, readout: '' });
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ctx, w, h, dpr, cols, rows, buf, grid, raf;

    const drawGrid = () => {
      if (!ctx) return;
      grid = document.createElement('canvas');
      grid.width = cv.width;
      grid.height = cv.height;
      const g = grid.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.font = `11px ${MONO}`;
      g.textBaseline = 'top';
      g.fillStyle = s.grid;
      const dx = new Set();
      const dy = new Set();
      for (let i = 0; i <= 10; i++) dx.add(Math.round((i * (cols - 1)) / 10));
      for (let j = 0; j <= 8; j++) dy.add(Math.round((j * (rows - 1)) / 8));
      const cx = Math.round((cols - 1) / 2);
      const cy = Math.round((rows - 1) / 2);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const vx = dx.has(x);
          const hy = dy.has(y);
          let ch = null;
          let a = 0;
          if (vx && hy) [ch, a] = ['+', 0.5];
          else if (y === cy && x % 2 === 0) [ch, a] = ['-', 0.4];
          else if (x === cx) [ch, a] = [':', 0.35];
          else if ((vx && y % 2 === 0) || (hy && x % 3 === 0)) [ch, a] = ['·', 0.2];
          if (ch) {
            g.globalAlpha = a;
            g.fillText(ch, x * CW, y * CH);
          }
        }
      }
    };
    s.redrawGrid = drawGrid;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx = cv.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CW);
      rows = Math.ceil(h / CH);
      buf = new Float32Array(cols * rows);
      drawGrid();
    };

    const splat = (px, py, weight) => {
      const gx = (px / CW) | 0;
      const gy = (py / CH) | 0;
      if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) buf[gy * cols + gx] += weight;
    };

    // "Background" = the canvas itself, or the HUD layer when it's the scroll container on small screens.
    const isBg = (e) => e.target === cv || (e.target instanceof HTMLElement && e.target.hasAttribute('data-bg'));
    const onMove = (e) => {
      s.mx = e.clientX;
      s.my = e.clientY;
      s.mIn = true;
    };
    const onOut = (e) => {
      if (!e.relatedTarget) s.mIn = false;
    };
    const onDown = (e) => {
      if (!isBg(e)) return;
      s.down = true;
      s.pulses.push({ x: e.clientX, y: e.clientY, t: s.t });
    };
    const onUp = () => {
      s.down = false;
    };
    const onWheel = (e) => {
      if (!isBg(e) || window.innerWidth <= 900) return;
      e.preventDefault();
      s.zoom = clamp(s.zoom - e.deltaY * 0.0008, 0.45, 1.5);
    };

    const frame = (ts) => {
      s.t = ts / 1000;
      const t = reduced ? 0 : s.t;

      const [ta, tb] = RATIOS[s.ratioKey] ?? RATIOS.home;
      s.a = lerp(s.a, ta, 0.05);
      s.b = lerp(s.b, tb, 0.05);
      s.obs = lerp(s.obs, s.hasObstacle ? 1 : 0, 0.08);

      for (let i = 0; i < buf.length; i++) buf[i] *= 0.55;

      // While a card is open the figure grows so it visibly wraps around the card.
      const R = Math.min(w * 0.3, h * 0.36) * s.zoom * (1 + 0.35 * s.obs);
      const cx = w / 2;
      const cy = h / 2;
      const phase = t * 0.5;
      const push = s.down ? -55 : 70;
      const maxStep = s.down ? 0.95 : 9;

      let card = null;
      const el = s.obstacleRef?.current;
      if (el && s.obs > 0.01) {
        const r = el.getBoundingClientRect();
        card = { l: r.left - CARD_MARGIN, r: r.right + CARD_MARGIN, t: r.top - CARD_MARGIN, b: r.bottom + CARD_MARGIN };
      }

      s.pulses = s.pulses.filter((p) => s.t - p.t < PULSE_LIFE);

      for (let i = 0; i < SAMPLES; i++) {
        const u = (i / SAMPLES) * Math.PI * 2;
        let px = cx + Math.sin(s.a * u + phase) * R;
        let py = cy + Math.sin(s.b * u) * R;

        if (s.mIn) {
          const dx = px - s.mx;
          const dy = py - s.my;
          const d = Math.hypot(dx, dy) || 1;
          if (d < MAGNET_RADIUS) {
            const f = Math.min((1 - d / MAGNET_RADIUS) ** 2 * push, d * maxStep);
            px += (dx / d) * f;
            py += (dy / d) * f;
          }
        }

        for (const p of s.pulses) {
          const age = s.t - p.t;
          const dx = px - p.x;
          const dy = py - p.y;
          const d = Math.hypot(dx, dy) || 1;
          const f = Math.exp(-(((d - age * PULSE_SPEED) / 36) ** 2)) * (1 - age / PULSE_LIFE) * 46;
          px += (dx / d) * f;
          py += (dy / d) * f;
        }

        // Keep the beam off the card: snap samples inside it to the nearest edge.
        if (card && px > card.l && px < card.r && py > card.t && py < card.b) {
          const dl = px - card.l;
          const dr = card.r - px;
          const dt = py - card.t;
          const db = card.b - py;
          const m = Math.min(dl, dr, dt, db);
          if (m === dl) px = lerp(px, card.l, s.obs);
          else if (m === dr) px = lerp(px, card.r, s.obs);
          else if (m === dt) py = lerp(py, card.t, s.obs);
          else py = lerp(py, card.b, s.obs);
        }

        splat(px, py, 0.35);
      }

      for (const p of s.pulses) {
        const age = s.t - p.t;
        const r = age * PULSE_SPEED;
        for (let i = 0; i < 180; i++) {
          const u = (i / 180) * Math.PI * 2;
          splat(p.x + Math.cos(u) * r, p.y + Math.sin(u) * r, 0.9 * (1 - age / PULSE_LIFE));
        }
      }

      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, w, h);
      if (grid) ctx.drawImage(grid, 0, 0, w, h);
      ctx.font = `bold 12px ${MONO}`;
      ctx.textBaseline = 'top';
      ctx.fillStyle = s.color;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const v = Math.min(1, buf[y * cols + x] / 6);
          if (v < 0.05) continue;
          ctx.globalAlpha = Math.min(1, 0.2 + v);
          ctx.fillText(RAMP[Math.max(1, Math.round(v * (RAMP.length - 1)))], x * CW, y * CH);
        }
      }
      ctx.globalAlpha = 1;

      const readout = `${s.down ? 'PULL' : 'PUSH'} · ZOOM ${s.zoom.toFixed(2)}× · ${s.a.toFixed(2)} : ${s.b.toFixed(2)}`;
      if (readout !== s.readout && s.readoutRef?.current) {
        s.readout = readout;
        s.readoutRef.current.textContent = readout;
      }

      raf = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerout', onOut);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('wheel', onWheel, { passive: false });
    raf = requestAnimationFrame(frame);
    document.fonts?.ready.then(drawGrid);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerout', onOut);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('wheel', onWheel);
    };
  }, []);

  // Sync props into the loop.
  useEffect(() => {
    Object.assign(live.current, { ratioKey, hasObstacle, obstacleRef, readoutRef });
  }, [ratioKey, hasObstacle, obstacleRef, readoutRef]);

  // Colors come from CSS tokens, so re-read them when the theme or channel changes.
  useEffect(() => {
    live.current.color = readVar(`--c${channel}`);
    live.current.grid = readVar('--grid');
    live.current.redrawGrid?.();
  }, [channel, theme]);

  return <canvas ref={canvasRef} className="scope" aria-hidden="true" />;
}
