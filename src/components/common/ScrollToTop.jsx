import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');

      const scroll = () => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      };

      // Initial scroll attempt
      scroll();

      // Track the element's absolute position and re-scroll if it shifts due to lazy loading
      let count = 0;
      let lastTop = 0;
      const interval = setInterval(() => {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const currentTop = rect.top + window.scrollY;

          if (currentTop !== lastTop) {
            scroll();
            lastTop = currentTop;
          }
        }
        count++;
        if (count > 20) {
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
