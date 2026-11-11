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

Multi-page portfolio built with React 19 + Vite + Tailwind CSS v3, styled as an oscilloscope in XY mode ("Magnet" design). One full-screen view: an ASCII Lissajous figure in the background, the four pages in the four screen corners, name on the top edge, Color!/theme toggles on the bottom edge. Opening a page shows a content card in the center.

**Routing:** hash routes via `src/hooks/useHashRoute.js` (`#/about`, `#/work`, `#/work/<slug>`, `#/thoughts`, `#/thoughts/<slug>`, `#/contact`; empty = home). Hash routing because GitHub Pages has no server-side routing. Keys `0`–`4` switch pages, `Esc` goes back.

**Content:** all text/data lives in `src/data/content.js` (`WORK` = experience roles + projects in one list with one detail layout, `THOUGHTS` posts, links, per-page frequency ratio `RATIOS`, per-page channel color `CHANNEL`, corner placement). Page bodies are in `src/pages/`. Resume PDF: `src/assets/daxhiel_resume.pdf`.

**Key components:**
- `ScopeCanvas` — the background. Canvas loop samples the Lissajous figure, pushes it away from the cursor (pulls while mouse is held), ripples it with click shockwaves, wheel zooms, and snaps samples off the open card's rect (`obstacleRef`) so the beam wraps around the card. Mounted once; props are synced into a ref read by the loop. Colors are read from CSS variables on theme/channel change.
- `CornerNav` — the four corner links; hovering one retunes the figure to that page's ratio.
- `Card` — the centered content card (Framer Motion fade/scale in). Hovering it sets `.is-focused` on `.app`, which dims and blurs the canvas.
- `Fingerprint` — per-project AudioPrint-style peak/hash graphic, seeded by slug.

**Styling conventions:**
- Theme tokens are CSS variables in `src/index.css` (`--bg`, `--fg`, `--dim`, `--grid`, `--line`, `--panel`, channel colors `--c1`–`--c4`, current accent `--tr`). Dark is default; `useTheme` writes `data-theme` on `<html>` synchronously and persists to `localStorage`; an inline script in `index.html` sets it before first paint.
- Layout/component styles are plain CSS classes in `src/index.css`; below 900px the HUD becomes a scrolling column over the canvas.
- Fonts (Google Fonts, linked in `index.html`): Inter Tight (`font-sans`), IBM Plex Mono (`font-mono`), Instrument Serif (`font-serif`).
- `cn()` helper in `src/utils/cn.js` merges `clsx` + `tailwind-merge`.
