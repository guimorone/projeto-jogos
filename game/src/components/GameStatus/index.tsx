import { ComponentProps, FC, ReactElement, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { GameStatusOptions } from '../../pages/Game';
import Timer from '../Timer';

// meti uns 'any' pra parar de dar erro

type NewLevelType = { initialSeconds: ComponentProps<typeof Timer>['initialSeconds'] };

type CommomEndLevel = { wordsHits: number; wordsHitsNames: string[]; wordsSent: string[]; points: number };
type VictoryType = CommomEndLevel & {};
type DefeatType = CommomEndLevel & {
  totalWordsHits: number;
  totalWordsHitsNames: string[];
  totalWordsSent: string[];
  totalPoints: number;
};
type GameOverType = CommomEndLevel & {
  totalWordsHits: number;
  totalWordsHitsNames: string[];
  totalWordsSent: string[];
  totalPoints: number;
};

type TitleType = { status: GameStatusOptions };
type StatusType = NewLevelType | VictoryType | DefeatType | GameOverType;

interface IFuncProps {
  props: TitleType & StatusType & any;
}

const GameStatusComponent: FC<IFuncProps> = ({ props }: IFuncProps) => {
  const components: { [key in GameStatusOptions]?: ReactElement } | any = {
    newLevel: (
      <div className="space-y-20">
        <h1 className="text-7xl tracking-wider font-medium italic">Prepare-se</h1>
        <div className="text-7xl tracking-wider font-medium text-rose-500 motion-safe:animate-ping">
          <Timer initialSeconds={props.initialSeconds} />
        </div>
      </div>
    ),
    victory: (
      <div className="space-y-5">
        <h1 className="text-7xl tracking-wider font-medium italic text-teal-600 motion-safe:animate-bounce">
          Parabéns!
        </h1>
        <h2 className="text-3xl tracking-wide font-medium text-teal-300">Você avançou de nível!</h2>
        <h2 className="text-xl text-sky-300 pb-5">Objetivos alcançados neste level:</h2>
        <ul className="grid grid-cols-3 place-items-center text-left list-disc marker:text-sky-300 min-w-full w-screen">
          <li>
            <h3 className="text-lg font-semibold">
              {props.points} {props.points === 1 ? 'ponto' : 'pontos'}
            </h3>
          </li>
          <li>
            <div className="flex flex-col gap-y-2">
              <h3 className="text-lg font-semibold">
                {props.wordsSent?.length} {props.wordsSent?.length === 1 ? 'palavra enviada' : 'palavras enviadas'}
              </h3>
              <div className="grid grid-cols-3 place-items-start gap-1">
                {props.wordsSent?.map((word: string, index: number) => (
                  <p key={`wordsSentStatus_${word}_${index}`} className="capitalize">
                    {word}
                  </p>
                ))}
              </div>
            </div>
          </li>
          <li>
            <div className="flex flex-col gap-y-2">
              <h3 className="text-lg font-semibold">
                {props.wordsHits} {props.wordsHits === 1 ? 'palavra acertada' : 'palavras acertadas'}
              </h3>
              <ol className="grid grid-cols-2 place-items-start gap-y-1 gap-x-3 list-decimal">
                {props.wordsHitsNames?.map((word: string, index: number) => (
                  <li key={`wordsHitsNamesStatus_${word}_${index}`} className="capitalize pl-0.5">
                    {word}
                  </li>
                ))}
              </ol>
            </div>
          </li>
        </ul>
      </div>
    ),
    defeat: (
      <div className="space-y-5">
        <h1 className="text-7xl tracking-wider font-medium italic text-rose-600 motion-safe:animate-bounce">
          Ah, que pena!
        </h1>
        <h2 className="text-3xl tracking-wide font-medium text-rose-300">Mas não desanime, tente novamente!</h2>
        <>
          <h2 className="text-xl text-yellow-300 pb-5">Objetivos alcançados neste level:</h2>
          <ul className="grid grid-cols-3 place-items-center text-left list-disc marker:text-yellow-300 min-w-full w-screen">
            <li>
              <h3 className="text-lg font-semibold">
                {props.points} {props.points === 1 ? 'ponto' : 'pontos'}
              </h3>
            </li>
            <li>
              <div className="flex flex-col gap-y-2">
                <h3 className="text-lg font-semibold">
                  {props.wordsSent?.length} {props.wordsSent?.length === 1 ? 'palavra enviada' : 'palavras enviadas'}
                </h3>
                <div className="grid grid-cols-3 place-items-start gap-1">
                  {props.wordsSent?.map((word: string, index: number) => (
                    <p key={`wordsSentStatus_${word}_${index}`} className="capitalize">
                      {word}
                    </p>
                  ))}
                </div>
              </div>
            </li>
            <li>
              <div className="flex flex-col gap-y-2">
                <h3 className="text-lg font-semibold">
                  {props.wordsHits} {props.wordsHits === 1 ? 'palavra acertada' : 'palavras acertadas'}
                </h3>
                <ol className="grid grid-cols-2 place-items-start gap-y-1 gap-x-3 list-decimal">
                  {props.wordsHitsNames?.map((word: string, index: number) => (
                    <li key={`wordsHitsNamesStatus_${word}_${index}`} className="capitalize pl-0.5">
                      {word}
                    </li>
                  ))}
                </ol>
              </div>
            </li>
          </ul>
        </>
        <>
          <h2 className="text-xl text-sky-300 pb-5">Objetivos alcançados em todo jogo:</h2>
          <ul className="grid grid-cols-3 place-items-center text-left list-disc marker:text-sky-300 min-w-full w-screen">
            <li>
              <h3 className="text-lg font-semibold">
                {props.totalPoints} {props.totalPoints === 1 ? 'ponto' : 'pontos'}
              </h3>
            </li>
            <li>
              <div className="flex flex-col gap-y-2">
                <h3 className="text-lg font-semibold">
                  {props.totalWordsSent?.length}
                  {props.totalWordsSent?.length === 1 ? ' palavra enviada' : ' palavras enviadas'}
                </h3>
                <div className="grid grid-cols-3 place-items-start gap-1">
                  {props.totalWordsSent?.map((word: string, index: number) => (
                    <p key={`totalWordsSentStatus_${word}_${index}`} className="capitalize">
                      {word}
                    </p>
                  ))}
                </div>
              </div>
            </li>
            <li>
              <div className="flex flex-col gap-y-2">
                <h3 className="text-lg font-semibold">
                  {props.totalWordsHits} {props.totalWordsHits === 1 ? 'palavra acertada' : 'palavras acertadas'}
                </h3>
                <ol className="grid grid-cols-2 place-items-start gap-y-1 gap-x-3 list-decimal">
                  {props.totalWordsHitsNames?.map((word: string, index: number) => (
                    <li key={`totalWordsHitsNamesStatus_${word}_${index}`} className="capitalize pl-0.5">
                      {word}
                    </li>
                  ))}
                </ol>
              </div>
            </li>
          </ul>
        </>
      </div>
    ),
    gameOver: (
      <div className="space-y-5">
        <h1 className="text-7xl tracking-wider font-medium italic text-teal-600 motion-safe:animate-bounce">
          Parabéns!
        </h1>
        <h2 className="text-3xl tracking-wide font-medium text-teal-300">Você terminou o jogo!</h2>
        <>
          <h2 className="text-xl text-sky-300 pb-5">Objetivos alcançados neste level:</h2>
          <ul className="grid grid-cols-3 place-items-center text-left list-disc marker:text-sky-300 min-w-full w-screen">
            <li>
              <h3 className="text-lg font-semibold">
                {props.points} {props.points === 1 ? 'ponto' : 'pontos'}
              </h3>
            </li>
            <li>
              <div className="flex flex-col gap-y-2">
                <h3 className="text-lg font-semibold">
                  {props.wordsSent?.length} {props.wordsSent?.length === 1 ? 'palavra enviada' : 'palavras enviadas'}
                </h3>
                <div className="grid grid-cols-3 place-items-start gap-1">
                  {props.wordsSent?.map((word: string, index: number) => (
                    <p key={`wordsSentStatus_${word}_${index}`} className="capitalize">
                      {word}
                    </p>
                  ))}
                </div>
              </div>
            </li>
            <li>
              <div className="flex flex-col gap-y-2">
                <h3 className="text-lg font-semibold">
                  {props.wordsHits} {props.wordsHits === 1 ? 'palavra acertada' : 'palavras acertadas'}
                </h3>
                <ol className="grid grid-cols-2 place-items-start gap-y-1 gap-x-3 list-decimal">
                  {props.wordsHitsNames?.map((word: string, index: number) => (
                    <li key={`wordsHitsNamesStatus_${word}_${index}`} className="capitalize pl-0.5">
                      {word}
                    </li>
                  ))}
                </ol>
              </div>
            </li>
          </ul>
        </>
        <>
          <h2 className="text-xl text-yellow-300 pb-5">Objetivos alcançados em todo jogo:</h2>
          <ul className="grid grid-cols-3 place-items-center text-left list-disc marker:text-yellow-300 min-w-full w-screen">
            <li>
              <h3 className="text-lg font-semibold">
                {props.totalPoints} {props.totalPoints === 1 ? 'ponto' : 'pontos'}
              </h3>
            </li>
            <li>
              <div className="flex flex-col gap-y-2">
                <h3 className="text-lg font-semibold">
                  {props.totalWordsSent?.length}
                  {props.totalWordsSent?.length === 1 ? ' palavra enviada' : ' palavras enviadas'}
                </h3>
                <div className="grid grid-cols-3 place-items-start gap-1">
                  {props.totalWordsSent?.map((word: string, index: number) => (
                    <p key={`totalWordsSentStatus_${word}_${index}`} className="capitalize">
                      {word}
                    </p>
                  ))}
                </div>
              </div>
            </li>
            <li>
              <div className="flex flex-col gap-y-2">
                <h3 className="text-lg font-semibold">
                  {props.totalWordsHits}
                  {props.totalWordsHits === 1 ? ' palavra acertada' : ' palavras acertadas'}
                </h3>
                <ol className="grid grid-cols-2 place-items-start gap-y-1 gap-x-3 list-decimal">
                  {props.totalWordsHitsNames?.map((word: string, index: number) => (
                    <li key={`totalWordsHitsNamesStatus_${word}_${index}`} className="capitalize pl-0.5">
                      {word}
                    </li>
                  ))}
                </ol>
              </div>
            </li>
          </ul>
        </>
      </div>
    ),
  };

  if (!(props.status in components) || !components[props.status]) return null;

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
      <div className="fixed p-0 -my-2.5 -mx-1.5 top-0 left-0 flex flex-col items-center justify-center w-full h-full min-w-[100vw] min-h-screen z-50 bg-zinc-700 bg-opacity-60 text-center">
        {components[props.status]}
      </div>
    </Transition>
  );
};

export default GameStatusComponent;
