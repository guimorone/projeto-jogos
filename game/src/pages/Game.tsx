import { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Spinner } from 'flowbite-react';
import { asyncReadLocalTxtFile, formatNumber } from '../utils';
import conjugations from '../assets/words/conjugations.txt';
import dicio from '../assets/words/dicio.txt';
import verbs from '../assets/words/verbs.txt';
import words from '../assets/words/words.txt';

export default function Game() {
  const [loading, setLoading] = useState<boolean>(true);
  const [conjugationsList, setConjugationsList] = useState<string[]>([]);
  const [dicioList, setDicioList] = useState<string[]>([]);
  const [verbsList, setVerbsList] = useState<string[]>([]);
  const [wordsList, setWordsList] = useState<string[]>([]);

  // Depends on level
  const wordsMinLength = 3;
  const wordsMaxLength = 6;

  // load all words
  useEffect(() => {
    const conjPromise = asyncReadLocalTxtFile(conjugations);
    const dicioPromise = asyncReadLocalTxtFile(dicio);
    const verbsPromise = asyncReadLocalTxtFile(verbs);
    const wordsPromise = asyncReadLocalTxtFile(words);

    Promise.all([conjPromise, dicioPromise, verbsPromise, wordsPromise])
      .then(([conjData, dicioData, verbsData, wordsData]) => {
        setConjugationsList(
          conjData.filter((str: string) => str.length >= wordsMinLength && str.length <= wordsMaxLength)
        );
        setDicioList(dicioData.filter((str: string) => str.length >= wordsMinLength && str.length <= wordsMaxLength));
        setVerbsList(verbsData.filter((str: string) => str.length >= wordsMinLength && str.length <= wordsMaxLength));
        setWordsList(wordsData.filter((str: string) => str.length >= wordsMinLength && str.length <= wordsMaxLength));
      })
      .catch(err => console.error(`Error in "load all words" step!\n${err}`))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative p-1.5 w-screen h-screen min-w-full min-h-full bg-gradient-to-t from-violet-900 to-sky-900">
      <Link
        to="/"
        className="w-fit p-1 md:px-3 md:py-1.5 flex flex-wrap gap-x-2 sm:gap-x-3.5 bg-rose-900 bg-opacity-70 hover:bg-opacity-100 rounded-full shadow-sm"
      >
        <ArrowLeftIcon aria-hidden className="w-5 h-5 sm:w-7 sm:h-7" />
        <span className="font-bold text-sm sm:text-lg">Sair</span>
      </Link>
      {loading ? (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="flex flex-col gap-y-1.5 items-center justify-center">
            <h4 className="font-medium text-lg leading-snug uppercase tracking-widest antialiased">
              Carregando palavras...
            </h4>
            <Spinner color="purple" size="xl" aria-label="Loading words" />
          </div>
        </div>
      ) : (
        <Outlet />
      )}
      <p>Nº Conjugações: {formatNumber(conjugationsList.length)}</p>
      <p>Nº Dicio (??): {formatNumber(dicioList.length)}</p>
      <p>Nº Verbos: {formatNumber(verbsList.length)}</p>
      <p>Nº Palavras (geral): {formatNumber(wordsList.length)}</p>
    </div>
  );
}
