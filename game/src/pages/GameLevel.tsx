import { FC, useState, useEffect, memo, KeyboardEvent, ChangeEvent, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { Progress } from 'flowbite-react';
import { Transition } from '@headlessui/react';
import { useGameContext } from './Game';
import { classNames } from '../utils';
import { handleChangeWord, getMaxWordsInScreen } from '../utils/algorithm';
import { useWindowSize } from '../utils/hooks';

interface IFuncProps {}

const GameLevel: FC<IFuncProps> = ({}: IFuncProps) => {
  const cancelKeys: Array<KeyboardEvent<HTMLInputElement>['key']> = ['Enter', 'Escape'];

  const { level } = useParams();
  const {
    words,
    gameColumns,
    gameStatus,
    playerHealth,
    setPlayerHealth,
    playerMaxHealth,
    bossHealth,
    setBossHealth,
    bossMaxHealth,
  } = useGameContext();

  const { height } = useWindowSize();

  const [maxWordsInScreen, setMaxWordsInScreen] = useState<number>(getMaxWordsInScreen(height));
  const [wordsHitsNames, setWordsHitsNames] = useState<string[]>([]);
  const [wordsHits, setWordsHits] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [wordWritten, setWordWritten] = useState<string>('');
  const [wordsPrefixList, setWordsPrefixList] = useState<string[]>([]);
  const [wordsSuffixList, setWordsSuffixList] = useState<string[]>([]);

  const getNewDisplayedWords = (maxIndex: number = maxWordsInScreen): string[] =>
    words?.filter(w => !wordsHitsNames.includes(w)).slice(0, Math.min(words.length, maxIndex * gameColumns)) || [];

  const [displayedWords, setDisplayedWords] = useState<string[]>(getNewDisplayedWords());

  const resetStates = (): void => {
    const newDisplayedWords: string[] = getNewDisplayedWords();

    // Se não for pra mostrar esses valores acumulados, só tirar os comentários abaixo que ai reseta
    // setWordsHits(0);
    // setPoints(0);
    setWordWritten('');
    setDisplayedWords(newDisplayedWords);
    setWordsPrefixList([]);
    setWordsSuffixList(newDisplayedWords);
  };

  const gotIt = (hitIndex: number): void => {
    if (hitIndex < 0 || hitIndex > displayedWords.length) return;

    const newWordsHitsNames = [...wordsHitsNames];
    newWordsHitsNames.push(displayedWords[hitIndex]);

    const filteredWords = words.filter(w => !newWordsHitsNames.includes(w));
    const newWords = [...displayedWords];
    // Esse 5 é aleatório
    if (maxWordsInScreen + wordsHits + 5 < filteredWords.length)
      newWords.splice(hitIndex, 1, filteredWords[maxWordsInScreen + wordsHits + 5]);
    else newWords.splice(hitIndex, 1);

    setWordsHitsNames(newWordsHitsNames);
    setDisplayedWords(newWords);
    setWordWritten('');
    setWordsHits(prev => prev + 1);
    setPoints(prev => prev + Math.ceil(Math.random() * 3) * levelParsed);
    setBossHealth(prev => prev - 10 / levelParsed);
  };

  useEffect(() => {
    if (height) {
      const newMaxWordsInScreen = getMaxWordsInScreen(height);

      setMaxWordsInScreen(newMaxWordsInScreen);
      setDisplayedWords(getNewDisplayedWords(newMaxWordsInScreen));
    }
  }, [height]);

  useEffect(() => {
    resetStates();
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

  const getPlayerProgressHealth = (): number => (100 * playerHealth) / playerMaxHealth;
  const getBossProgressHealth = (): number => (100 * bossHealth) / bossMaxHealth;

  return (
    <Transition
      show={gameStatus === 'running'}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="md:-mt-9 flex flex-col justify-between h-full">
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
              progress={getPlayerProgressHealth()}
              textLabel="Você"
              color="green"
              labelText
              textLabelPosition="outside"
              size="lg"
            />
            <Progress
              className="!w-52"
              progress={getBossProgressHealth()}
              textLabel="Boss"
              color="red"
              labelText
              textLabelPosition="outside"
              size="lg"
            />
          </div>
        </header>
        <main
          className={classNames(
            // tentei fazer dessa forma mas não foi, n sei pq
            // gameColumns > 0 && `grid-cols-${gameColumns}`
            gameColumns === 1 && 'grid-cols-1',
            gameColumns === 2 && 'grid-cols-2',
            gameColumns === 3 && 'grid-cols-3',
            'grid place-items-center p-10 gap-y-0.5 sm:gap-y-2 md:gap-y-4 lg:gap-y-6'
          )}
        >
          {displayedWords?.map((w, index) => (
            <p
              className={classNames(
                wordsPrefixList[index] && 'bg-yellow-500 bg-opacity-70',
                'p-1 rounded-sm shadow-sm tracking-widest text-lg'
              )}
              key={`${w}_ingame_word_${index}`}
            >
              <span className="text-teal-500">{wordsPrefixList[index]}</span>
              <span>{wordsSuffixList[index]}</span>
            </p>
          ))}
        </main>
        <input
          type="text"
          className="self-center block min-w-fit w-2/5 h-16 rounded-md border-0 py-1.5 mb-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
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

export default memo(GameLevel);
