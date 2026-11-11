import { useCallback, useState } from 'react';

function initialTheme() {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // storage blocked; fall through to the OS preference
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

// The attribute is written synchronously (not in an effect) so components that read
// CSS variables in their own effects see the new theme's values on the same commit.
function apply(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // ignore
  }
}

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const t = initialTheme();
    document.documentElement.dataset.theme = t;
    return t;
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      apply(next);
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
