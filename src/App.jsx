import { useCallback, useEffect, useRef, useState } from 'react';
import ScopeCanvas from './components/ScopeCanvas';
import CornerNav from './components/CornerNav';
import Card from './components/Card';
import About from './pages/About';
import Work from './pages/Work';
import WorkItem from './pages/WorkItem';
import { ThoughtsList, Thought } from './pages/Thoughts';
import Contact from './pages/Contact';
import { DETAIL_ITEMS, useHashRoute } from './hooks/useHashRoute';
import { useTheme } from './hooks/useTheme';
import { CHANNEL, LABELS, PAGES, RATIOS } from './data/content';
import { cn } from './utils/cn';

const ACCENTS = [1, 2, 3, 4];

function App() {
  const { page, slug, navigate } = useHashRoute();
  const { theme, toggleTheme } = useTheme();
  const [hoverKey, setHoverKey] = useState(null);
  const [accentIx, setAccentIx] = useState(0);
  const [focusKey, setFocusKey] = useState(null);
  const cardRef = useRef(null);
  const readoutRef = useRef(null);

  const isHome = page === 'home';
  const routeKey = `${page}/${slug ?? ''}`;
  const focused = !isHome && focusKey === routeKey;
  const item = slug ? DETAIL_ITEMS[page]?.find((it) => it.slug === slug) : null;
  const channel = isHome ? ACCENTS[accentIx] : CHANNEL[page];
  const figureChannel = hoverKey ? CHANNEL[hoverKey] : channel;

  const onCardFocus = useCallback((on) => setFocusKey(on ? routeKey : null), [routeKey]);

  const back = useCallback(() => {
    navigate(slug ? page : 'home');
  }, [page, slug, navigate]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key >= '0' && e.key <= '4') navigate(PAGES[Number(e.key)]);
      else if (e.key === 'Escape') back();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate, back]);

  useEffect(() => {
    const parts = ['daxhiel p.'];
    if (!isHome) parts.unshift(item ? item.title : LABELS[page]);
    document.title = parts.join(' · ');
  }, [isHome, page, item]);

  const heading = isHome
    ? ''
    : `XY ${RATIOS[page].join(':')} · ${LABELS[page].toUpperCase()}${item ? ` / ${(item.short ?? item.title).toUpperCase()}` : ''}`;

  return (
    <div
      className={cn('app', focused && 'is-focused')}
      style={{ '--tr': `var(--c${channel})` }}
    >
      <ScopeCanvas
        ratioKey={hoverKey || page}
        channel={figureChannel}
        theme={theme}
        obstacleRef={cardRef}
        hasObstacle={!isHome}
        readoutRef={readoutRef}
      />

      <div className="hud" data-bg>
        <header className="hud-top">
          <h1 className="hud-name">
            <a
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                navigate('home');
              }}
            >
              DAXHIEL PERUGORRIA
            </a>
          </h1>
        </header>

        <CornerNav page={page} onHover={setHoverKey} onNavigate={navigate} />

        {isHome && (
          <div className="hud-mid">
            <p className="hello">
              hi! i'm <em>daxhiel</em>.
            </p>
          </div>
        )}

        {!isHome && (
          <Card key={routeKey} ref={cardRef} heading={heading} onClose={back} onFocusChange={onCardFocus}>
            {page === 'about' && <About />}
            {page === 'work' && !item && <Work onOpen={(s) => navigate('work', s)} />}
            {page === 'work' && item && <WorkItem item={item} onBack={() => navigate('work')} />}
            {page === 'thoughts' && !item && <ThoughtsList onOpen={(s) => navigate('thoughts', s)} />}
            {page === 'thoughts' && item && <Thought post={item} onBack={() => navigate('thoughts')} />}
            {page === 'contact' && <Contact />}
          </Card>
        )}

        <footer className="hud-bot">
          {isHome && (
            <button
              type="button"
              className="toggle"
              onClick={() => setAccentIx((i) => (i + 1) % ACCENTS.length)}
              aria-label="Change accent color"
            >
              <span className="toggle-box">{accentIx ? '■' : '□'}</span>
              <span className="toggle-accent">color</span>
            </button>
          )}
          <button
            type="button"
            className="toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span className="toggle-box">{theme === 'dark' ? '●' : '○'}</span>
            {theme === 'dark' ? 'dark' : 'light'}
          </button>
        </footer>
      </div>
    </div>
  );
}

export default App;
