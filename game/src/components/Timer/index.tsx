import { useState, useEffect, FC } from 'react';
import { useAudio } from '../../utils/hooks';
import { getLocalStorageItem } from '../../utils';
import type { ConfigType } from '../../@types/settings';
import countdownSound from '../../assets/sounds/countdown-3sec.mp3';

interface IFuncProps {
  initialSeconds?: number;
  initialMinute?: number;
  intervalTimerMS?: number;
  withSound?: boolean;
}

// Era pra ser intervalTimerMS = 1000, mas ta tendo algum delay na animação
const Timer: FC<IFuncProps> = ({
  initialSeconds = 0,
  initialMinute = 0,
  intervalTimerMS = 950,
  withSound = true,
}: IFuncProps) => {
  const volume: ConfigType['volume'] = getLocalStorageItem('volume');

  const [minutes, setMinutes] = useState<number>(initialMinute);
  const [seconds, setSeconds] = useState<number>(initialSeconds);
  const [soundIsPlaying, setSoundState] = useAudio(countdownSound, volume.soundEffects, false);

  const timerDone = (intervalId?: number): void => {
    clearInterval(intervalId);
  };

  useEffect(() => {
    if (withSound && !soundIsPlaying) setSoundState('play');
    else setSoundState('remove');
  }, [withSound]);

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) setSeconds(seconds - 1);
      else {
        if (!minutes) timerDone(myInterval);
        else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, intervalTimerMS);
    return () => timerDone(myInterval);
  });

  return <p>{seconds}</p>;
};

export default Timer;
