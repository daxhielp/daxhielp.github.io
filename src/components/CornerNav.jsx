import { CORNERS, CHANNEL, LABELS, RATIOS } from '../data/content';

export default function CornerNav({ page, onHover, onNavigate }) {
  return (
    <nav aria-label="Pages" className="corners">
      {CORNERS.map(({ key, pos }, i) => (
        <a
          key={key}
          href={`#/${key}`}
          className={`corner ${pos}`}
          style={{ '--ch': `var(--c${CHANNEL[key]})` }}
          aria-current={page === key ? 'page' : undefined}
          onPointerEnter={() => onHover(key)}
          onPointerLeave={() => onHover(null)}
          onFocus={() => onHover(key)}
          onBlur={() => onHover(null)}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(key);
          }}
        >
          <span className="corner-label">{LABELS[key]}</span>
        </a>
      ))}
    </nav>
  );
}
