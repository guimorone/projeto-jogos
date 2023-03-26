import { useState, useEffect, FC } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, PlayIcon, PauseIcon, ArrowPathIcon, ForwardIcon } from '@heroicons/react/24/outline';
import { Spinner } from 'flowbite-react';
import GameLevel from '../components/GameLevel';
import { asyncReadLocalTxtFile, uniqueArray, shuffleArray, removeStrangeStrings, getLocalStorageItem } from '../utils';
import { gameRules } from '../utils/algorithm';
import {
  MAX_LEVEL,
  DELAY_TO_START_NEW_LEVEL_MS,
  INITIAL_PLAYER_HEALTH,
  INITIAL_PLAYER_LOSS_HEALTH,
  INITIAL_MIN_WORDS_LENGTH,
  INITIAL_MAX_WORDS_LENGTH,
  INITIAL_DIAGONAL_CHANCE,
  INITIAL_TOTAL_WAVES,
  INITIAL_WAVE_DELAY,
  INITIAL_COUNT_WORDS_IN_WAVE,
  INITIAL_WORDS_SPEED,
} from '../constants';
import conjugations from '../assets/words/conjugations.txt';
import dicio from '../assets/words/dicio.txt';
import verbs from '../assets/words/verbs.txt';
import words from '../assets/words/words.txt';
import type { GameStatusOptions, PercentageType, OnLevelDoneEventType } from '../@types';
import type { ConfigType } from '../@types/settings';

interface IFuncProps {}

const Game: FC<IFuncProps> = ({}: IFuncProps) => {
  const diagonalWords: ConfigType['diagonalWords'] = getLocalStorageItem('diagonalWords');

  const [gameStatus, setGameStatus] = useState<GameStatusOptions>('starting');
  const [level, setLevel] = useState<number>(0);
  const [playerHealth, setPlayerHealth] = useState<number>(INITIAL_PLAYER_HEALTH);
  const [playerMaxHealth, setPlayerMaxHealth] = useState<number>(INITIAL_PLAYER_HEALTH);
  const [playerLossHealth, setPlayerLossHealth] = useState<number>(INITIAL_PLAYER_LOSS_HEALTH);
  const [totalWaves, setTotalWaves] = useState<number>(INITIAL_TOTAL_WAVES);
  const [waveDelay, setWaveDelay] = useState<number>(INITIAL_WAVE_DELAY);
  const [countWordsInWave, setCountWordsInWave] = useState<number>(INITIAL_COUNT_WORDS_IN_WAVE);
  const [wordsMinLength, setWordsMinLength] = useState<number>(INITIAL_MIN_WORDS_LENGTH);
  const [wordsMaxLength, setWordsMaxLength] = useState<number>(INITIAL_MAX_WORDS_LENGTH);
  const [diagonalChance, setDiagonalChance] = useState<PercentageType>(INITIAL_DIAGONAL_CHANCE);
  const [wordsSpeed, setWordsSpeed] = useState<number>(INITIAL_WORDS_SPEED);
  const [wordsList, setWordsList] = useState<string[]>([]);
  const [sentWordsList, setSentWordsList] = useState<string[]>([]);

  // Estatísticas finais
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [totalWordsHitsNames, setTotalWordsHitsNames] = useState<string[]>([]);
  const [totalWordsMissedNames, setTotalWordsMissedNames] = useState<string[]>([]);

  const onLevelDone: OnLevelDoneEventType = (
    currentPoints: number,
    currentWordsHitsNames: string[],
    currentWordsMissedNames: string[]
  ): void => {
    setTotalPoints(prev => prev + currentPoints);
    setTotalWordsHitsNames(prev => [...prev, ...currentWordsHitsNames]);
    setTotalWordsMissedNames(prev => [...prev, ...currentWordsMissedNames]);
  };

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
            const newWordsList = removeStrangeStrings(
              uniqueArray([...conjData, ...dicioData, ...verbsData, ...wordsData])
            );

            setWordsList(newWordsList);
            setSentWordsList(
              shuffleArray(
                newWordsList.filter((str: string) => str.length >= wordsMinLength && str.length <= wordsMaxLength)
              )
            );
          })
          .catch(err => console.error(`Error in "load all words" step!\n${err}`))
          .finally(() => setLevel(1));
        break;
      case 'victory':
        if (level >= MAX_LEVEL) setGameStatus('gameOver');
        break;
      case 'levelDone':
        if (playerHealth > 0) setGameStatus('victory');
        else setGameStatus('defeat');
        break;
      default:
        break;
    }
  }, [gameStatus]);

  // listen if application is being viewed
  const onFocusFunction = () => {
    if (gameStatus === 'paused') setGameStatus('running');
  };

  const onBlurFunction = () => {
    if (gameStatus === 'running') setGameStatus('paused');
  };

  // pausa se o jogador não tiver vendo a tela
  useEffect(() => {
    onFocusFunction();

    window.addEventListener('focus', onFocusFunction);
    window.addEventListener('blur', onBlurFunction);

    return () => {
      onBlurFunction();

      window.removeEventListener('focus', onFocusFunction);
      window.removeEventListener('blur', onBlurFunction);
    };
  }, []);

  const newLevelRules = (): void => {
    const {
      newPlayerHealth,
      newPlayerLossHealth,
      minWordsLength,
      maxWordsLength,
      newDiagonalChance,
      newTotalWaves,
      newWaveDelay,
      newCountWordsInWave,
      newWordsSpeed,
    } = gameRules(level);

    setPlayerHealth(newPlayerHealth);
    setPlayerMaxHealth(newPlayerHealth);
    setPlayerLossHealth(newPlayerLossHealth);
    setTotalWaves(newTotalWaves);
    setWaveDelay(newWaveDelay);
    setCountWordsInWave(newCountWordsInWave);
    setWordsMinLength(minWordsLength);
    setWordsMaxLength(maxWordsLength);
    setWordsSpeed(newWordsSpeed);
    setDiagonalChance(diagonalWords ? newDiagonalChance : 0);
  };

  useEffect(() => {
    setSentWordsList(
      shuffleArray(wordsList.filter((str: string) => str.length >= wordsMinLength && str.length <= wordsMaxLength))
    );
  }, [wordsList, wordsMinLength, wordsMaxLength]);

  useEffect(() => {
    if (level > 0) {
      newLevelRules();
      setGameStatus('newLevel');
      setTimeout(setGameStatus, DELAY_TO_START_NEW_LEVEL_MS, 'running');
    } else if (gameStatus !== 'starting') setLevel(1);
  }, [level]);

  return (
    <div className="relative p-1.5 w-full h-full min-h-screen bg-gradient-to-t from-violet-900 to-sky-900">
      <header className="flex justify-between sm:mx-0.5">
        <Link
          to="/"
          className="z-50 min-w-fit sm:w-24 p-1 md:px-3 md:py-1.5 flex flex-wrap justify-between bg-rose-900 bg-opacity-100 hover:bg-opacity-70 rounded-full shadow-sm"
        >
          <ArrowLeftIcon aria-hidden className="w-5 h-5 sm:w-7 sm:h-7" />
          <span className="font-bold text-sm sm:text-lg">Sair</span>
        </Link>
        {gameStatus === 'paused' ? (
          <button
            className="z-50 min-w-fit sm:w-32 p-1 md:px-3 md:py-1.5 flex flex-wrap justify-between bg-teal-500 bg-opacity-100 hover:bg-opacity-70 rounded-full shadow-sm"
            onClick={() => setGameStatus('running')}
          >
            <PlayIcon aria-hidden className="w-5 h-5 sm:w-7 sm:h-7" />
            <span className="font-bold text-sm sm:text-lg">Play</span>
          </button>
        ) : gameStatus === 'running' ? (
          <button
            className="z-50 min-w-fit sm:w-32 p-1 md:px-3 md:py-1.5 flex flex-wrap justify-between bg-rose-900 bg-opacity-100 hover:bg-opacity-70 rounded-full shadow-sm"
            onClick={() => setGameStatus('paused')}
          >
            <PauseIcon aria-hidden className="w-5 h-5 sm:w-7 sm:h-7" />
            <span className="font-bold text-sm sm:text-lg">Pausar</span>
          </button>
        ) : gameStatus === 'victory' ? (
          <button
            className="z-50 min-w-fit sm:w-44 p-1 md:px-3 md:py-1.5 flex flex-wrap justify-between bg-yellow-500 bg-opacity-100 hover:bg-opacity-70 rounded-full shadow-sm motion-safe:animate-pulse hover:animate-none"
            onClick={() => setLevel(prev => prev + 1)}
          >
            <ForwardIcon aria-hidden className="w-5 h-5 sm:w-7 sm:h-7" />
            <span className="font-bold text-sm sm:text-lg">Próximo nível</span>
          </button>
        ) : gameStatus === 'defeat' || gameStatus === 'gameOver' ? (
          <button
            className="z-50 min-w-fit sm:w-36 p-1 md:px-3 md:py-1.5 flex flex-wrap justify-between bg-yellow-500 bg-opacity-100 hover:bg-opacity-70 rounded-full shadow-sm motion-safe:animate-pulse hover:animate-none"
            onClick={() => setLevel(0)}
          >
            <ArrowPathIcon aria-hidden className="w-5 h-5 sm:w-7 sm:h-7" />
            <span className="font-bold text-sm sm:text-lg">Reiniciar</span>
          </button>
        ) : null}
      </header>
      {level <= 0 || gameStatus === 'starting' ? (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="flex flex-col gap-y-1.5 items-center justify-center">
            <h4 className="font-medium text-lg leading-snug uppercase tracking-widest antialiased">
              Carregando palavras...
            </h4>
            <Spinner color="purple" size="xl" aria-label="Loading words" />
          </div>
        </div>
      ) : (
        <GameLevel
          // quando o atributo `key` muda, o componente reseta
          key={`gameLevel_${level}`}
          level={level}
          words={sentWordsList}
          gameStatus={gameStatus}
          setGameStatus={setGameStatus}
          playerHealth={playerHealth}
          setPlayerHealth={setPlayerHealth}
          playerMaxHealth={playerMaxHealth}
          playerLossHealth={playerLossHealth}
          diagonalChance={diagonalChance}
          totalWaves={totalWaves}
          waveDelay={waveDelay}
          countWordsInWave={countWordsInWave}
          wordsSpeed={wordsSpeed}
          totalPoints={totalPoints}
          totalWordsHitsNames={totalWordsHitsNames}
          totalWordsMissedNames={totalWordsMissedNames}
          onLevelDone={onLevelDone}
        />
      )}
    </div>
  );
};

export default Game;
