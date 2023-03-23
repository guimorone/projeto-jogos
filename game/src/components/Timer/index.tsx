import { useState, useEffect, FC } from 'react';

interface IFuncProps {
  initialSeconds?: number;
  initialMinute?: number;
  intervalTimerMS?: number;
}

// Era pra ser intervalTimerMS = 1000, mas ta tendo algum delay na animação
const Timer: FC<IFuncProps> = ({ initialSeconds = 0, initialMinute = 0, intervalTimerMS = 930 }: IFuncProps) => {
  const [minutes, setMinutes] = useState<number>(initialMinute);
  const [seconds, setSeconds] = useState<number>(initialSeconds);

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) setSeconds(seconds - 1);
      else {
        if (!minutes) clearInterval(myInterval);
        else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, intervalTimerMS);
    return () => {
      clearInterval(myInterval);
    };
  });

  return <h1>{seconds}</h1>;
};

export default Timer;
