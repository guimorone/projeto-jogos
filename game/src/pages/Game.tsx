import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Spinner } from 'flowbite-react';
import { asyncReadLocalTxtFile, uniqueArray, shuffleArray } from '../utils';
import { gameRules } from '../utils/algorithm';
import {
  MAX_LEVEL,
  INITIAL_PLAYER_HEALTH,
  INITIAL_BOSS_HEALTH,
  INITIAL_MIN_WORDS_LENGTH,
  INITIAL_MAX_WORDS_LENGTH,
} from '../constants';
import conjugations from '../assets/words/conjugations.txt';
import dicio from '../assets/words/dicio.txt';
import verbs from '../assets/words/verbs.txt';
import words from '../assets/words/words.txt';

type GameStatusOptions = 'starting' | 'pause' | 'running' | 'victory' | 'defeat' | 'done';

type OutletContextType = {
  words: string[];
  gameStatus: GameStatusOptions;
  playerHealth: number;
  setPlayerHealth: Dispatch<SetStateAction<number>>;
  bossHealth: number;
  setBossHealth: Dispatch<SetStateAction<number>>;
};

export default function Game() {
  const navigate = useNavigate();

  const [gameStatus, setGameStatus] = useState<GameStatusOptions>('starting');
  const [level, setLevel] = useState<number>(0);
  const [playerHealth, setPlayerHealth] = useState<number>(INITIAL_PLAYER_HEALTH);
  const [bossHealth, setBossHealth] = useState<number>(INITIAL_BOSS_HEALTH);
  const [wordsMinLength, setWordsMinLength] = useState<number>(INITIAL_MIN_WORDS_LENGTH);
  const [wordsMaxLength, setWordsMaxLength] = useState<number>(INITIAL_MAX_WORDS_LENGTH);
  const [wordsList, setWordsList] = useState<string[]>([]);

  // load all words
  useEffect(() => {
    switch (gameStatus) {
      case 'starting':
        const conjPromise = asyncReadLocalTxtFile(conjugations);
        const dicioPromise = asyncReadLocalTxtFile(dicio);
        const verbsPromise = asyncReadLocalTxtFile(verbs);
        const wordsPromise = asyncReadLocalTxtFile(words);

        Promise.all([conjPromise, dicioPromise, verbsPromise, wordsPromise])
          .then(([conjData, dicioData, verbsData, wordsData]) => {
            setWordsList(uniqueArray([...conjData, ...dicioData, ...verbsData, ...wordsData]));
          })
          .catch(err => console.error(`Error in "load all words" step!\n${err}`))
          .finally(() => setLevel(1));
        break;
      case 'victory':
        if (level >= MAX_LEVEL) setGameStatus('done');
        else setLevel(prevLevel => prevLevel + 1);
        break;
      case 'done':
        alert('max level reached');
        navigate('/');
        break;
      default:
        break;
    }
  }, [gameStatus]);

  useEffect(() => {
    if (level > 0) {
      if (level > 1) {
        const { newBossHealth, minWordsLength, maxWordsLength } = gameRules(level);
        setBossHealth(newBossHealth);
        setWordsMinLength(minWordsLength);
        setWordsMaxLength(maxWordsLength);
      }

      setGameStatus('running');
      navigate(level.toString());
    }
  }, [level]);

  useEffect(() => {
    if (bossHealth <= 0) setGameStatus('victory');
    else if (playerHealth <= 0) setGameStatus('defeat');
  }, [playerHealth, bossHealth]);

  return (
    <div className="relative p-1.5 w-screen h-screen min-w-full min-h-full bg-gradient-to-t from-violet-900 to-sky-900">
      <Link
        to="/"
        className="w-fit p-1 md:px-3 md:py-1.5 flex flex-wrap gap-x-2 sm:gap-x-3.5 bg-rose-900 bg-opacity-70 hover:bg-opacity-100 rounded-full shadow-sm"
      >
        <ArrowLeftIcon aria-hidden className="w-5 h-5 sm:w-7 sm:h-7" />
        <span className="font-bold text-sm sm:text-lg">Sair</span>
      </Link>
      {level <= 0 ? (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="flex flex-col gap-y-1.5 items-center justify-center">
            <h4 className="font-medium text-lg leading-snug uppercase tracking-widest antialiased">
              Carregando palavras...
            </h4>
            <Spinner color="purple" size="xl" aria-label="Loading words" />
          </div>
        </div>
      ) : (
        <Outlet
          context={{
            words: shuffleArray(
              wordsList.filter((str: string) => str.length >= wordsMinLength && str.length <= wordsMaxLength)
            ),
            gameStatus,
            playerHealth,
            setPlayerHealth,
            bossHealth,
            setBossHealth,
          }}
        />
      )}
    </div>
  );
}

export function useGameContext(): OutletContextType {
  return useOutletContext<OutletContextType>();
}
