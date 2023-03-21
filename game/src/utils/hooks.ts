import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getWindowDimensions } from '.';
import { OutletContextType } from '../pages/Game';

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

export function useGameContext(): OutletContextType {
  return useOutletContext<OutletContextType>();
}