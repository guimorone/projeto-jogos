import { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { asyncReadLocalTxtFile } from '../utils';
import verbs from '../assets/words/verbs.txt';

export default function Game() {
  const [verbsList, setVerbsList] = useState<string[]>([]);

  useEffect(() => {
    asyncReadLocalTxtFile(verbs).then(data => setVerbsList(data));
  }, []);

  console.log(verbsList);

  return (
    <div className="p-1.5 w-screen h-screen min-w-full min-h-full bg-gradient-to-t from-violet-900 to-sky-900">
      <Link
        to="/"
        className="w-fit p-1 md:px-3 md:py-1.5 flex flex-wrap gap-x-2 sm:gap-x-3.5 bg-rose-900 bg-opacity-70 hover:bg-opacity-100 rounded-full shadow-sm"
      >
        <ArrowLeftIcon aria-hidden className="w-5 h-5 sm:w-7 sm:h-7" />
        <span className="font-bold text-sm sm:text-lg">Sair</span>
      </Link>
      <Outlet />
    </div>
  );
}
