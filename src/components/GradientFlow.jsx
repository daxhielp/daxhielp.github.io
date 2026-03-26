import { useEffect, useState, useCallback } from 'react';

// Each section: two blobs, alternating sides (right then left, or left then right)
// Even-indexed sections start on the right; odd-indexed start on the left
const SECTIONS = [
  { id: 'hero',       right: 'rgba(30, 58, 138, 0.30)',  left: 'rgba(6, 78, 59, 0.22)'   },
  { id: 'experience', right: 'rgba(29, 78, 216, 0.22)',  left: 'rgba(4, 120, 87, 0.20)'  },
  { id: 'work',       right: 'rgba(37, 99, 235, 0.20)',  left: 'rgba(5, 150, 105, 0.20)' },
  { id: 'contact',    right: 'rgba(30, 64, 175, 0.18)',  left: 'rgba(6, 95, 70, 0.15)'   },
];

export default function GradientFlow() {
  const [blobs, setBlobs] = useState([]);

  const recalculate = useCallback(() => {
    const mainEl = document.querySelector('main');
    if (!mainEl) return;

    const scrollY = window.scrollY;
    const mainTop = mainEl.getBoundingClientRect().top + scrollY;
    const vw = window.innerWidth;
    // Blob diameter scales with viewport — at least 300px, at most 700px
    const size = Math.min(Math.max(vw * 0.48, 300), 700);

    const next = [];

    SECTIONS.forEach(({ id, right: rightColor, left: leftColor }, i) => {
      const el = document.getElementById(id);
      if (!el) return;

      const sectionTop = el.getBoundingClientRect().top + scrollY - mainTop;
      const h = el.offsetHeight;

      // Even sections: upper blob on right, lower blob on left
      // Odd sections:  upper blob on left,  lower blob on right
      const upperIsRight = i % 2 === 0;

      next.push(
        {
          key: `${id}-upper`,
          y: sectionTop + h * 0.28,
          side: upperIsRight ? 'right' : 'left',
          color: upperIsRight ? rightColor : leftColor,
          size,
        },
        {
          key: `${id}-lower`,
          y: sectionTop + h * 0.72,
          side: upperIsRight ? 'left' : 'right',
          color: upperIsRight ? leftColor : rightColor,
          size,
        }
      );
    });

    setBlobs(next);
  }, []);

  useEffect(() => {
    recalculate();
    window.addEventListener('resize', recalculate);
    return () => window.removeEventListener('resize', recalculate);
  }, [recalculate]);

  return (
    // overflow-hidden clips each blob's off-screen half → semicircle at each edge
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {blobs.map(({ key, y, side, color, size }) => (
        <div
          key={key}
          style={{
            position: 'absolute',
            top: y,
            [side]: 0,
            width: size,
            height: size,
            // Center the circle at the edge so exactly half is visible
            transform: `translateY(-50%) ${side === 'right' ? 'translateX(50%)' : 'translateX(-50%)'}`,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
            filter: `blur(${Math.round(size * 0.16)}px)`,
          }}
        />
      ))}
    </div>
  );
}
