import { useState, useEffect, FC, KeyboardEvent, ChangeEvent, Fragment, ComponentProps } from 'react';
import { useParams } from 'react-router-dom';
import { Progress } from 'flowbite-react';
import { useSprings, animated, config, AnimationResult, Controller, SpringValue } from '@react-spring/web';
import { Transition } from '@headlessui/react';
import GameStatusComponent from '../components/GameStatus';
import { classNames, randomNumber, randomPercentForTrue, normalizeValue, uniqueArray, isArraysEqual } from '../utils';
import { handleChangeWord } from '../utils/algorithm';
import { useWindowSize, useGameContext } from '../utils/hooks';
import {
  DELAY_TO_START_NEW_LEVEL_MS,
  AXLE_GAP,
  POINTS_FOR_DIAGONAL_VALUES,
  POINTS_FOR_NON_NORMALIZED_VALUES,
  CANCEL_KEYS,
} from '../constants';

interface IFuncProps {}

const GameLevel: FC<IFuncProps> = ({}: IFuncProps) => {
  const { level } = useParams();
  const {
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
    maxDiagonalCountWords,
    wordsSpeed,
  } = useGameContext();
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

  const [wordsHitsNames, setWordsHitsNames] = useState<string[]>([]);
  const [wordsMissedNames, setWordsMissedNames] = useState<string[]>([]);
  const [wordsLeft, setWordsLeft] = useState<number>(countWordsInWave * totalWaves);
  const [points, setPoints] = useState<number>(0);
  const [totalWordsHitsNames, setTotalWordsHitsNames] = useState<string[]>([]);
  const [totalWordsMissedNames, setTotalWordsMissedNames] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [diagonalIndexes, setDiagonalIndexes] = useState<number[]>([]);
  const [wordWritten, setWordWritten] = useState<string>('');
  const [wordsPrefixList, setWordsPrefixList] = useState<string[]>([]);
  const [wordsSuffixList, setWordsSuffixList] = useState<string[]>([]);
  const [displayedWords, setDisplayedWords] = useState<string[]>(getNewDisplayedWords());

  const resetStates = (): void => {
    setWordWritten('');
    setPoints(0);
    setDisplayedWords([]);
    setWordsPrefixList([]);
    setWordsSuffixList([]);
    setWordsHitsNames([]);
    setWordsMissedNames([]);
    setDiagonalIndexes([]);
  };

  const gotIt = (hitIndex: number): void => {
    if (wordsLeft <= 0 || hitIndex < 0 || hitIndex >= displayedWords.length) return;

    const wordHit = displayedWords[hitIndex];
    if (!wordsHitsNames?.includes(wordHit) && !wordsMissedNames?.includes(wordHit)) {
      const normalizedWordHit = normalizeValue(wordHit);
      const isNormalized = wordHit === normalizedWordHit;
      const isDiagonal = diagonalIndexes?.includes(hitIndex);

      setWordWritten('');
      setWordsHitsNames(prev => [...prev, wordHit]);
      setWordsLeft(prev => prev - 1);
      setPoints(
        prev =>
          prev +
          (isDiagonal ? POINTS_FOR_DIAGONAL_VALUES : 1) *
            (isNormalized ? 1 : POINTS_FOR_NON_NORMALIZED_VALUES) *
            levelParsed *
            wordHit.length
      );
    }
  };

  const checkIfOutOfBounds = (x: number, y: number): boolean => y > height || ((x < 0 || x > width) && y > AXLE_GAP);

  const missedIt = (missedIndex: number): void => {
    if (wordsLeft <= 0 || missedIndex < 0 || missedIndex >= displayedWords?.length) return;

    const missedWord = displayedWords[missedIndex];
    if (!wordsHitsNames?.includes(missedWord) && !wordsMissedNames?.includes(missedWord)) {
      setPlayerHealth(prev => prev - playerLossHealth);
      setWordsMissedNames(prev => [...prev, missedWord]);
      setWordsLeft(prev => prev - 1);
    }
  };

  // ------------------------------------------------- React Springs -------------------------------------------------

  const newDiagonalIndexes: number[] = [];

  const onStartEvent = (_result: AnimationResult, _spring: Controller | SpringValue): void => {
    if (newDiagonalIndexes?.length && !isArraysEqual(newDiagonalIndexes, diagonalIndexes))
      setDiagonalIndexes(newDiagonalIndexes);
  };

  const onRestEvent = (_result: AnimationResult, spring: Controller | SpringValue): void => {
    // @ts-ignore
    const index: number = spring.springs.index.get(),
      // @ts-ignore
      x: number = spring.springs.x.get(),
      // @ts-ignore
      y: number = spring.springs.y.get();

    if (checkIfOutOfBounds(x, y)) missedIt(index);
  };

  const springsProps = (index: number): any => {
    let isDiagonal: boolean = false;
    let updateState: boolean = false;
    if (newDiagonalIndexes?.length < maxDiagonalCountWords && !newDiagonalIndexes?.includes(index)) {
      isDiagonal = randomPercentForTrue(40);
      updateState = isDiagonal;
    } else isDiagonal = newDiagonalIndexes?.includes(index);

    const wave = Math.floor(index / countWordsInWave);
    const fromX = randomNumber(AXLE_GAP, width - AXLE_GAP);
    const fromY = randomNumber(-2 * AXLE_GAP, -AXLE_GAP);
    let chooseDiagonalX = undefined;
    if (isDiagonal) {
      if (updateState) newDiagonalIndexes.push(index);
      do chooseDiagonalX = randomNumber(AXLE_GAP, width - AXLE_GAP);
      while (chooseDiagonalX >= fromX - AXLE_GAP && chooseDiagonalX <= fromX + AXLE_GAP);
    }

    const from = { x: fromX, y: fromY, index };
    const to = { x: isDiagonal && chooseDiagonalX !== undefined ? chooseDiagonalX : fromX, y: height + 10 };
    const delay = DELAY_TO_START_NEW_LEVEL_MS + 500 + wave * waveDelay;

    return {
      from,
      to,
      delay,
      onStart: onStartEvent,
      onRest: onRestEvent,
      config: { ...config.gentle, duration: wordsSpeed },
    };
  };

  const [springs, springsApi] = useSprings(totalWordsInLevel, springsProps, [displayedWords]);

  // ------------------------------------------------- React Springs -------------------------------------------------

  useEffect(() => {
    switch (gameStatus) {
      case 'running':
        springsApi.resume();
        break;
      case 'paused':
        springsApi.pause();
        break;
      case 'levelDone':
        setTotalWordsHitsNames(prev => [...prev, ...wordsHitsNames]);
        setTotalWordsMissedNames(prev => [...prev, ...wordsMissedNames]);
        setTotalPoints(prev => prev + points);
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
    resetStates();
    updateWordsArrays();
  }, [level, words]);

  useEffect(() => {
    const hitIndex = displayedWords.indexOf(wordWritten);
    if (hitIndex > -1) gotIt(hitIndex);

    const { prefixList, suffixList } = handleChangeWord(wordWritten, displayedWords);

    setWordsPrefixList(prefixList);
    setWordsSuffixList(suffixList);
  }, [wordWritten, displayedWords]);

  const levelParsed: number = Number(level);

  if (!words || !words.length || !level || !levelParsed || Number.isNaN(levelParsed)) return null;

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
            <h1 className="text-4xl font-black">Level {levelParsed}</h1>
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
                  'absolute p-2 tracking-widest text-xl w-fit rounded-xl shadow-sm'
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
