import {
  useState,
  useEffect,
  FC,
  KeyboardEvent,
  ChangeEvent,
  Fragment,
  ComponentProps,
  Dispatch,
  SetStateAction,
} from 'react';
import { Progress } from 'flowbite-react';
import { useSprings, animated, config, AnimationResult, Controller, SpringValue } from '@react-spring/web';
import { Transition } from '@headlessui/react';
import GameStatusComponent from '../GameStatus';
import { classNames, randomNumber, randomPercentForTrue, normalizeValue, uniqueArray } from '../../utils';
import { handleChangeWord, getPointsGained } from '../../utils/algorithm';
import { useWindowSize } from '../../utils/hooks';
import { DELAY_TO_START_NEW_LEVEL_MS, AXLE_GAP, CANCEL_KEYS } from '../../constants';
import type { GameStatusOptions, PercentageType, OnLevelDoneEventType } from '../../@types';

interface IFuncProps {
  level: number;
  words: string[];
  gameStatus: GameStatusOptions;
  setGameStatus: Dispatch<SetStateAction<GameStatusOptions>>;
  playerHealth: number;
  playerMaxHealth: number;
  setPlayerHealth: Dispatch<SetStateAction<number>>;
  playerLossHealth: number;
  totalWaves: number;
  waveDelay: number;
  countWordsInWave: number;
  wordsSpeed: number;
  diagonalChance: PercentageType;
  totalPoints: number;
  totalWordsHitsNames: string[];
  totalWordsMissedNames: string[];
  onLevelDone: OnLevelDoneEventType;
}

const GameLevel: FC<IFuncProps> = ({
  level,
  words,
  gameStatus,
  setGameStatus,
  playerHealth,
  setPlayerHealth,
  playerMaxHealth,
  playerLossHealth,
  totalWaves,
  waveDelay,
  countWordsInWave,
  wordsSpeed,
  diagonalChance,
  totalPoints,
  totalWordsHitsNames,
  totalWordsMissedNames,
  onLevelDone,
}: IFuncProps) => {
  const totalWordsInLevel: Readonly<number> = countWordsInWave * totalWaves;

  const getNewDisplayedWords = (reset: boolean = true): string[] => {
    const newDisplayedWords: string[] = reset ? [] : [...displayedWords];

    if (newDisplayedWords.length < totalWordsInLevel)
      for (let i = 1, newWord = ''; i <= totalWordsInLevel; i++) {
        do newWord = words[randomNumber(0, words.length)];
        while (newDisplayedWords?.includes(newWord));

        newDisplayedWords.push(newWord);
      }

    return newDisplayedWords;
  };

  const updateWordsArrays = (): void => {
    const newDisplayedWords = getNewDisplayedWords();
    const { prefixList, suffixList } = handleChangeWord(wordWritten, newDisplayedWords);

    setDisplayedWords(newDisplayedWords);
    setWordsPrefixList(prefixList);
    setWordsSuffixList(suffixList);
  };

  const { width, height } = useWindowSize();

  const [wordWritten, setWordWritten] = useState<string>('');
  const [points, setPoints] = useState<number>(0);
  const [wordsHitsNames, setWordsHitsNames] = useState<string[]>([]);
  const [wordsMissedNames, setWordsMissedNames] = useState<string[]>([]);
  const [wordsLeft, setWordsLeft] = useState<number>(totalWordsInLevel);
  const [wordsPrefixList, setWordsPrefixList] = useState<string[]>([]);
  const [wordsSuffixList, setWordsSuffixList] = useState<string[]>([]);
  const [displayedWords, setDisplayedWords] = useState<string[]>(getNewDisplayedWords());
  const [diagonalIndexes, setDiagonalIndexes] = useState<number[]>([]);

  const resetStates = (): void => {
    setWordWritten('');
    setPoints(0);
    setWordsHitsNames([]);
    setWordsMissedNames([]);
    setWordsLeft(totalWordsInLevel);
    setWordsPrefixList([]);
    setWordsSuffixList([]);
    setDisplayedWords([]);
    setDiagonalIndexes([]);
  };

  const gotIt = (hitIndex: number): void => {
    if (wordsLeft <= 0 || hitIndex < 0 || hitIndex >= displayedWords?.length) return;

    const wordHit = displayedWords[hitIndex];
    if (wordHit && !wordsHitsNames?.includes(wordHit) && !wordsMissedNames?.includes(wordHit)) {
      const normalizedWordHit = normalizeValue(wordHit);
      const isNormalized = wordHit === normalizedWordHit;
      const isDiagonal = diagonalIndexes?.includes(hitIndex);

      setWordWritten('');
      setWordsHitsNames(prev => [...prev, wordHit]);
      setWordsLeft(prev => prev - 1);
      setPoints(prev => prev + getPointsGained(level, wordHit.length, isDiagonal, isNormalized));
    }
  };

  const checkIfOutOfBounds = (x: number, y: number): boolean => y > height || ((x < 0 || x > width) && y > AXLE_GAP);

  const missedIt = (missedIndex: number): void => {
    if (wordsLeft <= 0 || missedIndex < 0 || missedIndex >= displayedWords?.length) return;

    const missedWord = displayedWords[missedIndex];
    if (missedWord && !wordsHitsNames?.includes(missedWord) && !wordsMissedNames?.includes(missedWord)) {
      setPlayerHealth(prev => prev - playerLossHealth);
      setWordsMissedNames(prev => [...prev, missedWord]);
      setWordsLeft(prev => prev - 1);
    }
  };

  // ------------------------------------------------- React Springs -------------------------------------------------

  const onRestEvent = (result: AnimationResult, _spring: Controller | SpringValue): void => {
    if (!result || !('value' in result)) return;

    const { x, y, index } = result.value as { x: number; y: number; index: number };

    if (checkIfOutOfBounds(x, y)) missedIt(index);
  };

  const springsProps = (index: number): any => {
    let isDiagonal: boolean = false;
    let updateState: boolean = false;
    if (!diagonalIndexes?.includes(index)) {
      isDiagonal = randomPercentForTrue(diagonalChance);
      updateState = isDiagonal;
    } else isDiagonal = diagonalIndexes?.includes(index);

    const wave = Math.floor(index / countWordsInWave);
    const fromX = randomNumber(AXLE_GAP, width - AXLE_GAP);
    const fromY = randomNumber(-2 * AXLE_GAP, -AXLE_GAP);
    let chooseDiagonalX: number | undefined = undefined;
    if (isDiagonal) {
      if (updateState) setDiagonalIndexes(prev => [...prev, index]);
      do chooseDiagonalX = randomNumber(0, width);
      while (Math.abs(chooseDiagonalX - fromX) < 1.5 * AXLE_GAP);
    }

    const from = { x: fromX, y: fromY, index };
    const to = { x: isDiagonal && chooseDiagonalX !== undefined ? chooseDiagonalX : fromX, y: height + 10 };
    const delay = DELAY_TO_START_NEW_LEVEL_MS + wave * waveDelay;

    return { from, to, delay, onRest: onRestEvent, config: { ...config.gentle, duration: wordsSpeed } };
  };

  const [springs, springsApi] = useSprings(totalWordsInLevel, springsProps, [diagonalIndexes]);

  // ------------------------------------------------- React Springs -------------------------------------------------

  useEffect(() => {
    switch (gameStatus) {
      case 'newLevel':
        resetStates();
        updateWordsArrays();
        break;
      case 'running':
        springsApi.resume();
        break;
      case 'paused':
        springsApi.pause();
        break;
      case 'levelDone':
        onLevelDone(points, wordsHitsNames, wordsMissedNames);
        break;
      default:
        break;
    }
  }, [gameStatus]);

  useEffect(() => {
    if (gameStatus !== 'running' && gameStatus !== 'paused') return;

    if (playerHealth <= 0 || wordsLeft <= 0) setGameStatus('levelDone');
  }, [playerHealth, wordsLeft, gameStatus]);

  useEffect(() => {
    const hitIndex = displayedWords.indexOf(wordWritten);
    if (hitIndex > -1) gotIt(hitIndex);

    const { prefixList, suffixList } = handleChangeWord(wordWritten, displayedWords);

    setWordsPrefixList(prefixList);
    setWordsSuffixList(suffixList);
  }, [wordWritten, displayedWords]);

  if (!words || !words.length || level <= 0) return null;

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>): void => setWordWritten(e.target.value);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (wordWritten && CANCEL_KEYS.includes(e.key)) setWordWritten('');
  };

  const getPlayerProgressBarHealth = (): number => (100 * playerHealth) / playerMaxHealth;

  type GameStatusPropsType = ComponentProps<typeof GameStatusComponent>['props'];
  const getGameStatusComponentProps = (): GameStatusPropsType => {
    const props: Partial<GameStatusPropsType> = { status: gameStatus };

    const victory = () => {
      props.wordsHitsNames = uniqueArray(wordsHitsNames);
      props.wordsMissedNames = uniqueArray(wordsMissedNames);
      props.points = points;
    };
    const defeatOrGameOver = () => {
      props.wordsHitsNames = uniqueArray(wordsHitsNames);
      props.wordsMissedNames = uniqueArray(wordsMissedNames);
      props.points = points;
      props.totalWordsHitsNames = uniqueArray(totalWordsHitsNames);
      props.totalWordsMissedNames = uniqueArray(totalWordsMissedNames);
      props.totalPoints = totalPoints;
    };

    switch (gameStatus) {
      case 'newLevel':
        props.initialSeconds = Math.floor(DELAY_TO_START_NEW_LEVEL_MS / 1000);
        break;
      case 'victory':
        victory();
        break;
      case 'defeat':
        defeatOrGameOver();
        break;
      case 'gameOver':
        defeatOrGameOver();
        break;
      default:
        break;
    }

    return props as GameStatusPropsType;
  };

  return (
    <Transition
      appear
      show
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="md:-mt-9 flex flex-col justify-between w-full h-full min-h-screen">
        <header
          className={classNames(
            gameStatus !== 'running' ? 'opacity-20' : 'opacity-100',
            'flex flex-col w-full text-center items-center tracking-wider gap-y-1 md:gap-y-2.5 -z-20'
          )}
        >
          <div className="inline-flex gap-x-16 items-baseline">
            <h1 className="text-4xl font-black">Level {level}</h1>
            <div className="inline-flex gap-x-3">
              <h4 className="text-rose-500 text-xl font-medium">{`${wordsLeft} ${
                wordsLeft !== 1 ? 'palavras restantes' : 'palavra restante'
              }`}</h4>
              <h4 className="text-yellow-200 text-xl font-medium">{`${points} ${
                points !== 1 ? 'pontos' : 'ponto'
              }`}</h4>
            </div>
          </div>
          <div className="inline-flex items-center justify-center">
            <Progress
              className="!w-60"
              progress={getPlayerProgressBarHealth()}
              textLabel="Vida"
              color="green"
              labelText
              textLabelPosition="outside"
              size="lg"
            />
          </div>
        </header>
        {gameStatus !== 'running' && gameStatus !== 'paused' ? (
          <GameStatusComponent props={getGameStatusComponentProps()} />
        ) : (
          <main className="absolute w-full h-full min-h-screen -z-10">
            {springs?.map((props, index) => (
              <animated.p
                style={props}
                key={`ingame_word_${index}_${displayedWords[index]}`}
                className={classNames(
                  wordsHitsNames?.includes(displayedWords[index]) &&
                    'motion-safe:animate-spin transition duration-300 ease-in-out opacity-0 bg-gradient-to-r from-teal-400 to-teal-700',
                  wordsPrefixList[index] && 'bg-yellow-500 z-50',
                  'absolute p-2 tracking-widest text-xl w-fit rounded-xl shadow-sm border-none'
                )}
              >
                <span className="text-teal-600">{wordsPrefixList[index]}</span>
                <span className="text-rose-200">{wordsSuffixList[index]}</span>
              </animated.p>
            ))}
          </main>
        )}
        <input
          type="text"
          disabled={gameStatus !== 'running'}
          className={classNames(
            gameStatus !== 'running' ? 'opacity-40' : 'opacity-100',
            'self-center block min-w-fit w-2/5 h-16 rounded-md border-0 py-1.5 mb-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6'
          )}
          placeholder="Tente acertar todas as palavras!"
          value={wordWritten}
          onChange={handleChangeValue}
          onKeyDown={handleKeyPress}
          spellCheck={false}
          autoFocus
        />
      </div>
    </Transition>
  );
};

export default GameLevel;
