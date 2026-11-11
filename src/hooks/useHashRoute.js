import { useCallback, useEffect, useState } from 'react';
import { PAGES, THOUGHTS, WORK } from '../data/content';

// Pages that have a detail view at #/<page>/<slug>, and the items each one can open.
export const DETAIL_ITEMS = { work: WORK, thoughts: THOUGHTS };

// Hash routes (#/about, #/work/voicesense) so deep links work on GitHub Pages,
// which has no server-side routing.
function parse() {
  const [page = '', slug] = window.location.hash.replace(/^#\/?/, '').split('/');
  if (!PAGES.includes(page)) return { page: 'home', slug: null };
  const items = DETAIL_ITEMS[page];
  if (slug && items?.some((it) => it.slug === slug)) return { page, slug };
  return { page, slug: null };
}

export function useHashRoute() {
  const [route, setRoute] = useState(parse);

  useEffect(() => {
    const onChange = () => setRoute(parse());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((page, slug) => {
    window.location.hash = page === 'home' ? '/' : `/${page}${slug ? `/${slug}` : ''}`;
  }, []);

  return { ...route, navigate };
}
