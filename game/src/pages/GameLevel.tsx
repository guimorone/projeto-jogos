import { FC, useState, useEffect, KeyboardEvent, ChangeEvent, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { Progress } from 'flowbite-react';
import { useSprings, animated, config } from '@react-spring/web';
import { Transition } from '@headlessui/react';
import { classNames, randomNumber } from '../utils';
import { handleChangeWord } from '../utils/algorithm';
import { useWindowSize, useGameContext } from '../utils/hooks';

interface IFuncProps {}

const GameLevel: FC<IFuncProps> = ({}: IFuncProps) => {
  const cancelKeys: KeyboardEvent<HTMLInputElement>['key'][] = ['Enter', 'Escape'];

  const { level } = useParams();
  const {
    words,
    gameStatus,
    playerHealth,
    setPlayerHealth,
    playerMaxHealth,
    bossHealth,
    setBossHealth,
    bossMaxHealth,
    totalWaves,
    waveDelay,
    countWordsInWave,
  } = useGameContext();

  const { width, height } = useWindowSize();

  const [wordsHitsNames, setWordsHitsNames] = useState<string[]>([]);
  const [wordsHits, setWordsHits] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [wordWritten, setWordWritten] = useState<string>('');
  const [wordsPrefixList, setWordsPrefixList] = useState<string[]>([]);
  const [wordsSuffixList, setWordsSuffixList] = useState<string[]>([]);
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [countWaves, setCountWaves] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();

  const [springs, springsApi] = useSprings(countWordsInWave * totalWaves, () => {
    const gap = 100;
    const fromX = randomNumber(gap, width - gap);
    const fromY = randomNumber(-gap, 0);

    return {
      from: { x: fromX, y: fromY },
      to: { x: fromX, y: height + gap / 2 },
      config: config.molasses,
    };
  });

  useEffect(() => {
    switch (gameStatus) {
      case 'running':
        springsApi.resume();
        break;
      case 'newLevel':
        springsApi.start();
        break;
      case 'paused':
        springsApi.pause();
        break;
      default:
        springsApi.stop();
        break;
    }
  }, [gameStatus]);

  const getNewDisplayedWords = (): string[] => {
    const newDisplayedWords = [...displayedWords];

    if (displayedWords.length < countWordsInWave * totalWaves)
      for (let i = 1; i <= countWordsInWave; i++) {
        let newWord = words[randomNumber(0, words.length)];
        while (wordsHitsNames?.includes(newWord)) newWord = words[randomNumber(0, words.length)];

        newDisplayedWords.push(newWord);
      }

    return newDisplayedWords;
  };

  const resetIntervalId = (): void => {
    clearInterval(intervalId);
    setIntervalId(undefined);
  };

  const updateWordsArrays = (): void => {
    if (gameStatus === 'running') {
      if (countWaves >= totalWaves && intervalId) {
        resetIntervalId();
        return;
      }

      const newDisplayedWords = getNewDisplayedWords();
      const { prefixList, suffixList } = handleChangeWord(wordWritten, newDisplayedWords);

      setDisplayedWords(newDisplayedWords);
      setWordsPrefixList(prefixList);
      setWordsSuffixList(suffixList);
      setCountWaves(prev => prev + 1);
    }
  };

  const resetStates = (): void => {
    resetIntervalId();
    setWordWritten('');
    setCountWaves(0);
    setDisplayedWords([]);
    setWordsPrefixList([]);
    setWordsSuffixList([]);
  };

  const gotIt = (hitIndex: number): void => {
    if (hitIndex < 0 || hitIndex > displayedWords.length) return;

    // remove from screen
    const newDisplayedWords = [...displayedWords];
    newDisplayedWords.splice(hitIndex, 1);

    setDisplayedWords(newDisplayedWords);
    setWordsHitsNames(prev => [...prev, displayedWords[hitIndex]]);
    setWordWritten('');
    setWordsHits(prev => prev + 1);
    setPoints(prev => prev + Math.ceil(Math.random() * 3) * levelParsed);
    setBossHealth(prev => prev - 10 / levelParsed);
  };

  useEffect(() => {
    resetStates();

    if (countWaves < totalWaves && !intervalId) {
      updateWordsArrays(); // first call without delay
      setIntervalId(setInterval(updateWordsArrays, waveDelay * 1000));
    }

    // return () => {
    //   resetIntervalId();
    // };
  }, [level, words]);

  useEffect(() => {
    const hitIndex = displayedWords.indexOf(wordWritten);
    if (hitIndex > -1) gotIt(hitIndex);

    const { prefixList, suffixList } = handleChangeWord(wordWritten, displayedWords);

    setWordsPrefixList(prefixList);
    setWordsSuffixList(suffixList);
  }, [wordWritten, displayedWords]);

  const levelParsed: number = Number(level);

  if (!words || !words.length || !level || !levelParsed || Number.isNaN(levelParsed) || !playerHealth || !bossHealth)
    return null;

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>): void => setWordWritten(e.target.value);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (wordWritten && cancelKeys.includes(e.key)) setWordWritten('');
  };

  const getPlayerProgressBarHealth = (): number => (100 * playerHealth) / playerMaxHealth;
  const getBossProgressBarHealth = (): number => (100 * bossHealth) / bossMaxHealth;

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
        <header className="flex flex-col w-full text-center items-center tracking-wider gap-y-1 md:gap-y-2.5">
          <div className="inline-flex gap-x-16 items-baseline">
            <h1 className="text-4xl font-black">Level {levelParsed}</h1>
            <div className="inline-flex gap-x-3">
              <h4 className="text-teal-200 text-xl font-medium">{`${wordsHits} ${
                wordsHits !== 1 ? 'palavras' : 'palavra'
              } ${wordsHits !== 1 ? 'acertadas' : 'acertada'}`}</h4>
              <h4 className="text-yellow-200 text-xl font-medium">{`${points} ${
                points !== 1 ? 'pontos' : 'ponto'
              }`}</h4>
            </div>
          </div>
          <div className="inline-flex gap-x-4">
            <Progress
              className="!w-52"
              progress={getPlayerProgressBarHealth()}
              textLabel="Você"
              color="green"
              labelText
              textLabelPosition="outside"
              size="lg"
            />
            <Progress
              className="!w-52"
              progress={getBossProgressBarHealth()}
              textLabel="Boss"
              color="red"
              labelText
              textLabelPosition="outside"
              size="lg"
            />
          </div>
        </header>
        <main className="absolute w-full h-full -z-10">
          {springs?.map((props, index) => (
            <animated.p
              style={props}
              key={`ingame_word_${index}_${displayedWords[index]}`}
              className={classNames(
                wordsPrefixList[index] && 'bg-yellow-500 bg-opacity-70 rounded-sm shadow-sm w-fit',
                'p-1 tracking-widest text-lg'
              )}
            >
              <span className="text-teal-500">{wordsPrefixList[index]}</span>
              <span>{wordsSuffixList[index]}</span>
            </animated.p>
          ))}
        </main>
        <input
          type="text"
          className="self-center block min-w-fit w-2/5 h-16 rounded-md border-0 py-1.5 mb-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
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
