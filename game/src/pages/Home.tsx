import { useState, useEffect, FC } from 'react';
import { Link } from 'react-router-dom';
import { CodeBracketSquareIcon, QuestionMarkCircleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import About from '../components/About';
import Settings from '../components/Settings';
import { getLocalStorageItem, setLocalStorageItem } from '../utils';
import { useAudio } from '../utils/hooks';
import { GAME_NAME, REPO_URL } from '../constants';
import kirby from '../assets/kirby.png';
import type { ConfigType } from '../@types/settings';

// sounds
import homeMusic from '../assets/sounds/background-home-music.mp3';

interface IFuncProps {}

const Home: FC<IFuncProps> = ({}: IFuncProps) => {
  const volumeInitialState: ConfigType['volume'] = getLocalStorageItem('volume');
  const diagonalWordsInitialState: ConfigType['diagonalWords'] = getLocalStorageItem('diagonalWords');
  const considerNonNormalizedWordsInitialState: ConfigType['considerNonNormalizedWords'] =
    getLocalStorageItem('considerNonNormalizedWords');

  const [volume, setVolume] = useState<ConfigType['volume']>(volumeInitialState);
  const [diagonalWords, setDiagonalWords] = useState<ConfigType['diagonalWords']>(diagonalWordsInitialState);
  const [considerNonNormalizedWords, setConsiderNonNormalizedWords] = useState<
    ConfigType['considerNonNormalizedWords']
  >(considerNonNormalizedWordsInitialState);

  // sounds
  const [homeMusicIsPlaying, setHomeMusicState] = useAudio(homeMusic, volume.music, true);

  useEffect(() => {
    if (!homeMusicIsPlaying) setHomeMusicState('play');
  }, []);

  useEffect(() => {
    setLocalStorageItem('volume', volume);
  }, [volume]);

  useEffect(() => {
    setLocalStorageItem('diagonalWords', diagonalWords);
  }, [diagonalWords]);

  useEffect(() => {
    setLocalStorageItem('considerNonNormalizedWords', considerNonNormalizedWords);
  }, [considerNonNormalizedWords]);

  const [showAbout, setShowAbout] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const onCloseAbout = (): void => setShowAbout(false);
  const onCloseSettings = (): void => setShowSettings(false);

  return (
    <div className="flex flex-col items-center justify-center gap-10 lg:flex-none relative w-screen h-screen min-w-full min-h-full bg-no-repeat bg-keyboard-bg bg-cover bg-clip-border text-center">
      <div className="flex flex-1 flex-col gap-0.5 sm:gap-1 pt-3">
        <h1 className="text-2xl sm:text-4xl text-sky-100 font-light">Bem-vindo</h1>
        <h2 className="text-xl sm:text-3xl text-sky-300 font-thin">{GAME_NAME}</h2>
      </div>
      <div className="absolute top-[63%] lg:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col gap-3 w-60 sm:w-96 text-right text-xl sm:text-3xl font-medium">
          <Link
            to="/game"
            onClick={() => setHomeMusicState('remove')}
            className="motion-safe:animate-bounce hover:animate-none flex flex-wrap justify-between items-center bg-sky-900 bg-opacity-70 hover:bg-opacity-100 hover:cursor-pointer shadow-2xl rounded-lg p-3 md:p-5"
          >
            <img src={kirby} className="w-10 h-10 sm:w-20 sm:h-20" />
            <label>Jogar</label>
          </Link>
          <button
            onClick={() => setShowAbout(true)}
            className="flex flex-wrap justify-between items-center bg-teal-900 bg-opacity-70 hover:bg-opacity-100 hover:cursor-pointer shadow-2xl rounded-lg p-3 md:p-5"
          >
            <QuestionMarkCircleIcon
              aria-hidden={true}
              className="w-10 h-10 sm:w-20 sm:h-20 text-rose-600 bg-transparent"
            />
            <label>Como jogar?</label>
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="flex flex-wrap justify-between items-center bg-fuchsia-900 bg-opacity-70 hover:bg-opacity-100 hover:cursor-pointer shadow-2xl rounded-lg p-3 md:p-5"
          >
            <Cog6ToothIcon aria-hidden={true} className="w-10 h-10 sm:w-20 sm:h-20 text-rose-600 bg-transparent" />
            <label>Configurações</label>
          </button>
          <a
            href={REPO_URL}
            target="_blank"
            className="flex flex-wrap justify-between items-center bg-zinc-900 bg-opacity-70 hover:bg-opacity-100 hover:cursor-pointer shadow-2xl rounded-lg p-3 md:p-5"
          >
            <CodeBracketSquareIcon
              aria-hidden={true}
              className="w-10 h-10 sm:w-20 sm:h-20 text-rose-600 bg-transparent"
            />
            <label>Repositório</label>
          </a>
        </div>
      </div>
      <About show={showAbout} onClose={onCloseAbout} />
      <Settings
        show={showSettings}
        onClose={onCloseSettings}
        volume={{ value: volume, setValue: setVolume }}
        diagonalWords={{ value: diagonalWords, setValue: setDiagonalWords }}
        considerNonNormalizedWords={{ value: considerNonNormalizedWords, setValue: setConsiderNonNormalizedWords }}
      />
    </div>
  );
};

export default Home;
