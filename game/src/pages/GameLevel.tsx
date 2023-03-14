import { useState, useEffect, KeyboardEvent, ChangeEvent, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { Progress } from 'flowbite-react';
import { Transition } from '@headlessui/react';
import { useGameContext } from './Game';
import { handleChangeWord } from '../utils/algorithm';

export default function GameLevel() {
  const countWordsInScreen: number = 3 * 5;
  const cancelKeys: Array<KeyboardEvent<HTMLInputElement>['key']> = ['Enter', 'Escape'];

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
  } = useGameContext();

  const [wordsHits, setWordsHits] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [wordWritten, setWordWritten] = useState<string>('');
  const [wordsPrefixList, setWordsPrefixList] = useState<string[]>([]);
  const [wordsSuffixList, setWordsSuffixList] = useState<string[]>([]);
  const [displayedWords, setDisplayedWords] = useState<string[]>(words?.slice(0, countWordsInScreen) || []);

  const resetStates = (): void => {
    const newDisplayredWords: string[] = words?.slice(0, countWordsInScreen) || [];

    setWordsHits(0);
    setPoints(0);
    setWordWritten('');
    setDisplayedWords(newDisplayredWords);
    setWordsPrefixList([]);
    setWordsSuffixList(newDisplayredWords);
  };

  const gotIt = (hitIndex: number): void => {
    const newWords = [...displayedWords];
    if (countWordsInScreen + wordsHits - 1 < words.length)
      newWords.splice(hitIndex, 1, words[countWordsInScreen + wordsHits - 1]);
    else newWords.splice(hitIndex, 1);

    setDisplayedWords(newWords);
    setWordWritten('');
    setWordsHits(prev => prev + 1);
    setPoints(prev => prev + Math.ceil(Math.random() * 3) * levelParsed);
    setBossHealth(prev => prev - 10 / levelParsed);
  };

  useEffect(() => {
    resetStates();
  }, [level]);

  useEffect(() => {
    const hitIndex = displayedWords.indexOf(wordWritten);
    if (hitIndex > -1) gotIt(hitIndex);

    const { prefixList, suffixList } = handleChangeWord(wordWritten, displayedWords);

    setWordsPrefixList(prefixList);
    setWordsSuffixList(suffixList);
  }, [wordWritten]);

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
        <header className="flex flex-col w-full text-center items-center tracking-wider gap-y-1.5">
          <div className="inline-flex gap-x-12 items-baseline">
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
          <div className="inline-flex gap-x-5">
            <Progress
              className="!w-60"
              progress={getPlayerProgressHealth()}
              textLabel="Você"
              color="green"
              labelText
              textLabelPosition="outside"
              size="lg"
            />
            <Progress
              className="!w-60"
              progress={getBossProgressHealth()}
              textLabel="Boss"
              color="red"
              labelText
              textLabelPosition="outside"
              size="lg"
            />
          </div>
        </header>
        <main className="grid grid-cols-3 place-items-center p-10 gap-y-0.5 sm:gap-y-2 md:gap-y-4 lg:gap-y-6">
          {displayedWords.map((w, index) => (
            <p className="tracking-[0.4em] text-lg" key={`${w}_ingame_word_${index}`}>
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
}
