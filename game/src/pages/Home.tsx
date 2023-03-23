import { useState, memo, FC } from 'react';
import { Link } from 'react-router-dom';
import { CodeBracketSquareIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import About from '../components/About';
import { GAME_NAME, REPO_URL } from '../constants';
import kirby from '../assets/kirby.png';

interface IFuncProps {}

const Home: FC<IFuncProps> = () => {
  const [showAbout, setShowAbout] = useState<boolean>(false);

  return (
    <div className="flex flex-col items-center justify-center gap-10 lg:flex-none lg:relative w-screen h-screen min-w-full min-h-full bg-no-repeat bg-keyboard-bg bg-cover bg-clip-border text-center">
      <div className="flex flex-1 flex-col gap-0.5 sm:gap-1 pt-3">
        <h1 className="text-2xl sm:text-4xl text-sky-100 font-light">Bem-vindo</h1>
        <h2 className="text-xl sm:text-3xl text-sky-300 font-thin">{GAME_NAME}</h2>
      </div>
      <div className="lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
        <div className="flex flex-col gap-3 w-60 sm:w-96 text-right text-xl sm:text-3xl font-medium">
          <Link
            to="/game"
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
      <About show={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  );
};

export default memo(Home);
