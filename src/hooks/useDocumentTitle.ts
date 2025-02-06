import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_TITLE = 'Kinoko Color';

const getRouteTitle = (pathname: string): string => {
  // Remove leading slash and split by remaining slashes
  const route = pathname.slice(1).split('/')[0];
  
  if (!route) return 'Home';
  
  // Capitalize first letter and add space before capital letters
  return route
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const useDocumentTitle = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const routeTitle = getRouteTitle(pathname);
    document.title = `${BASE_TITLE} · ${routeTitle}`;

    return () => {
      document.title = BASE_TITLE;
    };
  }, [pathname]);
};
