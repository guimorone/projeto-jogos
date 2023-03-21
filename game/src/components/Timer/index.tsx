import { useState, useEffect, FC } from 'react';

interface IFuncProps {
  initialSeconds?: number;
  initialMinute?: number;
}

const Timer: FC<IFuncProps> = ({ initialSeconds = 0, initialMinute = 0 }: IFuncProps) => {
  const [minutes, setMinutes] = useState<number>(initialMinute);
  const [seconds, setSeconds] = useState<number>(initialSeconds);

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) setSeconds(seconds - 1);
      else if (seconds === 0) {
        if (minutes === 0) clearInterval(myInterval);
        else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  return <h1>{seconds}</h1>;
};

export default Timer;
