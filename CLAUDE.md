# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

Deployment is automatic: pushing to `main` triggers the GitHub Actions workflow that builds and deploys to GitHub Pages.

## Architecture

Single-page portfolio site built with React 19 + Vite + Tailwind CSS v3. No router — all sections are stacked vertically in `App.jsx`.

**Section order** (defined in `src/App.jsx`):
1. `Hero` — name/intro with gradient heading
2. `Experience` — work history with PDF resume download (`src/assets/daxhiel_resume.pdf`)
3. `SelectedWorks` — project showcase using `BentoCard` grid

**Key components:**
- `InteractiveBackground` (`.tsx`) — canvas-based particle/constellation animation with mouse repulsion. Wraps the non-footer sections. Only file using TypeScript.
- `MagneticCursor` — custom cursor overlay; native cursor is hidden globally via `index.css` (`cursor: none` on `body` and interactive elements).
- `BentoCard` — reusable card with `glass-panel` styling and Framer Motion scroll animation.
- `SectionHeader` — consistent two-line heading (title + subtitle label) used across sections.

**Styling conventions:**
- Custom Tailwind colors: `background` (#0a0a0a), `surface` (#121212), `surface-highlight` (#1E1E1E), `slate-muted` (#94a3b8) — defined in `tailwind.config.js`.
- `.glass-panel` utility class defined in `index.css`: `bg-white/5 backdrop-blur-md border border-white/10`.
- `cn()` helper in `src/utils/cn.js` merges `clsx` + `tailwind-merge`.
- Animations use Framer Motion (`framer-motion`). Scroll-triggered animations use `whileInView` with `viewport={{ once: true }}`.
- Inter font via `fontFamily.sans` in Tailwind config.
