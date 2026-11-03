import { useEffect, useState } from 'react';
import { routes, type RouteKey } from '../content';

/** Small hash router: #/how, #/kiln … Works on any static host, including AI Studio. */
function current(): RouteKey {
  const hash = window.location.hash || '#/';
  const match = routes.find((r) => r.path === hash);
  return match ? match.key : 'home';
}

export function useRoute(): RouteKey {
  const [route, setRoute] = useState<RouteKey>(current);

  useEffect(() => {
    const onChange = () => {
      setRoute(current());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}

export function pathFor(key: RouteKey): string {
  return routes.find((r) => r.key === key)?.path ?? '#/';
}
