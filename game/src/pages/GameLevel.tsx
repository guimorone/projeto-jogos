import { useState, useEffect, FC, KeyboardEvent, ChangeEvent, Fragment, ComponentProps } from 'react';
import { useParams } from 'react-router-dom';
import { Progress } from 'flowbite-react';
import { useSprings, animated, config } from '@react-spring/web';
import { Transition } from '@headlessui/react';
import GameStatusComponent from '../components/GameStatus';
import { classNames, randomNumber } from '../utils';
import { handleChangeWord } from '../utils/algorithm';
import { useWindowSize, useGameContext } from '../utils/hooks';
import { DELAY_TO_START_NEW_LEVEL_MS } from '../constants';

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
    wordsSpeed,
  } = useGameContext();

  const { width, height } = useWindowSize();

  const [wordsHitsNames, setWordsHitsNames] = useState<string[]>([]);
  const [wordsHits, setWordsHits] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [totalWordsSent, setTotalWordsSent] = useState<string[]>([]);
  const [totalWordsHitsNames, setTotalWordsHitsNames] = useState<string[]>([]);
  const [totalWordsHits, setTotalWordsHits] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);

  const [wordWritten, setWordWritten] = useState<string>('');
  const [wordsPrefixList, setWordsPrefixList] = useState<string[]>([]);
  const [wordsSuffixList, setWordsSuffixList] = useState<string[]>([]);
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);

  const [springs, springsApi] = useSprings(countWordsInWave * totalWaves, (index: number) => {
    const wave = Math.floor(index / countWordsInWave);
    const gap = 175;
    const fromX = randomNumber(gap, width - gap);
    const fromY = randomNumber(-3 * gap, -gap);
    const duration = wordsSpeed + wave * waveDelay;

    return {
      from: { x: fromX, y: fromY },
      to: { x: fromX, y: height + gap / 10 },
      delay: DELAY_TO_START_NEW_LEVEL_MS + 500,
      config: { ...config.slow, duration },
    };
  });

  useEffect(() => {
    switch (gameStatus) {
      case 'running':
        springsApi.resume();
        break;
      case 'paused':
        springsApi.pause();
        break;
      default:
        setTotalWordsSent(prev => [...prev, ...displayedWords]);
        setTotalWordsHitsNames(prev => [...prev, ...wordsHitsNames]);
        setTotalWordsHits(prev => prev + wordsHits);
        setTotalPoints(prev => prev + points);
        break;
    }
  }, [gameStatus]);

  const getNewDisplayedWords = (): string[] => {
    const newDisplayedWords = [...displayedWords];

    if (displayedWords.length < countWordsInWave * totalWaves)
      for (let i = 1; i <= countWordsInWave * totalWaves; i++) {
        let newWord = words[randomNumber(0, words.length)];
        while (displayedWords?.includes(newWord) || totalWordsSent?.includes(newWord))
          newWord = words[randomNumber(0, words.length)];

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

  const resetStates = (): void => {
    setWordsHitsNames([]);
    setWordsHits(0);
    setPoints(0);
    setWordWritten('');
    setDisplayedWords([]);
    setWordsPrefixList([]);
    setWordsSuffixList([]);
  };

  const gotIt = (hitIndex: number): void => {
    if (hitIndex < 0 || hitIndex >= displayedWords.length) return;

    const wordHit = displayedWords[hitIndex];

    setWordsHitsNames(prev => [...prev, wordHit]);
    setWordWritten('');
    setWordsHits(prev => prev + 1);
    setPoints(prev => prev + Math.ceil(Math.random() * 3) * levelParsed * wordHit.length);
    setBossHealth(prev => prev - 1);
  };

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
    if (wordWritten && cancelKeys.includes(e.key)) setWordWritten('');
  };

  const getPlayerProgressBarHealth = (): number => (100 * playerHealth) / playerMaxHealth;
  const getBossProgressBarHealth = (): number => (100 * bossHealth) / bossMaxHealth;

  const getGameStatusComponentProps = (): ComponentProps<typeof GameStatusComponent>['props'] => {
    const props: ComponentProps<typeof GameStatusComponent>['props'] = { status: gameStatus };

    switch (gameStatus) {
      case 'newLevel':
        props.initialSeconds = Math.floor(DELAY_TO_START_NEW_LEVEL_MS / 1000);
        break;
      case 'victory' || 'defeat':
        props.wordsHits = wordsHits;
        props.wordsHitsNames = wordsHitsNames;
        props.wordsSent = displayedWords;
        props.points = points;
        break;
      default:
        props.wordsHits = wordsHits;
        props.wordsHitsNames = wordsHitsNames;
        props.wordsSent = displayedWords;
        props.points = points;
        props.totalWordsHits = totalWordsHits;
        props.totalWordsHitsNames = totalWordsHitsNames;
        props.totalWordsSent = totalWordsSent;
        props.totalPoints = totalPoints;
        break;
    }

    return props;
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
            'flex flex-col w-full text-center items-center tracking-wider gap-y-1 md:gap-y-2.5'
          )}
        >
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
        {gameStatus !== 'running' && gameStatus !== 'paused' ? (
          <GameStatusComponent props={getGameStatusComponentProps()} />
        ) : (
          <main className="absolute w-full h-full -z-10">
            {springs?.map((props, index) => (
              <animated.p
                style={props}
                key={`ingame_word_${index}_${displayedWords[index]}`}
                className={classNames(
                  wordsHitsNames?.includes(displayedWords[index]) && 'invisible',
                  wordsPrefixList[index] && 'bg-yellow-500 bg-opacity-70 rounded-sm shadow-sm w-fit',
                  'p-1 tracking-widest text-xl'
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
