import { useState, useEffect, RefObject } from 'react';
import { getWindowDimensions } from '.';
import { AXLE_GAP } from '../constants';

export function useWindowSize(): { width: number; height: number } {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>(getWindowDimensions());

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize(getWindowDimensions());
    }
    // Add event listener
    window.addEventListener('resize', handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}

export function useIntersection(element: RefObject<HTMLElement>, rootMargin: string = `${AXLE_GAP}px`) {
  const [isVisible, setState] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting);
      },
      { rootMargin }
    );

    element && observer.observe(element.current as HTMLElement);

    return () => observer.unobserve(element.current as HTMLElement);
  }, []);

  return isVisible;
}
