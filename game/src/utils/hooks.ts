import { useState, useEffect, RefObject } from 'react';
import { useLocation } from 'react-router-dom';
import { getWindowDimensions } from '.';
import { AXLE_GAP } from '../constants';
import type { PercentageType } from './../@types/index';

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

export const useLocationChange = (action: VoidFunction): void => {
  const location = useLocation();

  useEffect(() => {
    action();
  }, [location]);
};

export function useAudio(
  url: string,
  volume: PercentageType = 100,
  loop: boolean = false,
  id: HTMLElement['id'] = '',
  removeSoundInLocationChange: boolean = true
): [boolean, (state: 'play' | 'pause' | 'stop' | 'remove') => void] {
  const [audio] = useState<HTMLAudioElement>(new Audio(url));
  const [playing, setPlaying] = useState<boolean>(false);
  audio.volume = volume / 100;
  audio.loop = loop && playing;
  if (id) audio.id = id;

  useLocationChange(() => {
    if (removeSoundInLocationChange) audio.srcObject = null;
  });

  const setAudioState = (state: 'play' | 'pause' | 'stop' | 'remove') => {
    setPlaying(state === 'play');
    if (state === 'stop') audio.currentTime = 0;
    if (state === 'remove') audio.srcObject = null;
  };

  useEffect(() => {
    playing
      ? audio.play().catch(e => {
          alert(
            'Você deve interagir com a página para poder reproduzir sons (medida de privacidade do navagedor)\nErro explicado em termos técnicos:\n' +
              e
          );
        })
      : audio.pause();
  }, [playing]);

  useEffect(() => {
    function endedCallback() {
      if (!audio.loop) setPlaying(false);
    }

    audio.addEventListener('ended', endedCallback);
    return () => audio.removeEventListener('ended', endedCallback);
  }, []);

  return [playing, setAudioState];
}
