'use client';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que fuerza el scroll al tope de la página cada vez que cambia la ruta.
 */
const ScrollToTop = (): null => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
