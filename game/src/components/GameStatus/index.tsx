import { ComponentProps, FC, ReactElement } from 'react';
import { GameStatusOptions } from '../../pages/Game';
import Timer from '../Timer';

// meti uns 'any' pra parar de dar erro

type NewLevelType = { initialSeconds: ComponentProps<typeof Timer>['initialSeconds'] };

type CommomEndLevel = { wordsHits: number; wordsHitsNames: string[]; wordsSent: string[]; points: number };
type VictoryType = CommomEndLevel & {};
type DefeatType = CommomEndLevel & {};
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
        <h1 className="text-7xl tracking-wider font-medium">Prepare-se</h1>
        <div className="text-7xl tracking-wider font-medium text-rose-500 motion-safe:animate-ping">
          <Timer initialSeconds={props.initialSeconds} />
        </div>
      </div>
    ),
    victory: (
      <div className="space-y-5">
        <h1 className="text-7xl tracking-wider font-medium text-teal-600 motion-safe:animate-pulse">Parabéns!</h1>
        <h2 className="text-xl text-yellow-300 pb-5">Objetivos alcançados neste level:</h2>
        <ul className="grid grid-cols-4 place-items-center text-left list-disc marker:text-yellow-300 min-w-full w-screen">
          <li>
            <h3 className="text-lg font-semibold">
              {props.wordsHits} {props.wordsHits === 1 ? 'palavra acertada' : 'palavras acertadas'}
            </h3>
          </li>
          <li>
            <h3 className="text-lg font-semibold">
              {props.points} {props.points === 1 ? 'ponto' : 'pontos'}
            </h3>
          </li>
          <li>
            <div className="flex flex-col gap-y-2">
              <h3 className="text-lg font-semibold">Palavras enviadas</h3>
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
              <h3 className="text-lg font-semibold">Palavras acertadas</h3>
              <ol className="list-decimal marker:text-sky-200">
                <div className="grid grid-cols-2 place-items-start gap-y-1 gap-x-3">
                  {props.wordsHitsNames?.map((word: string, index: number) => (
                    <li key={`wordsHitsNamesStatus_${word}_${index}`} className="capitalize pl-0.5">
                      {word}
                    </li>
                  ))}
                </div>
              </ol>
            </div>
          </li>
        </ul>
      </div>
    ),
    defeat: (
      <div className="space-y-5">
        <h1 className="text-7xl tracking-wider font-medium text-rose-600 motion-safe:animate-pulse">Ah, que pena!</h1>
        <h2 className="text-3xl tracking-wide font-medium text-rose-300">Mas não desanime, tente novamente!</h2>
        <h2 className="text-xl text-yellow-300 pb-5">Objetivos alcançados neste level:</h2>
        <ul className="grid grid-cols-4 place-items-center text-left list-disc marker:text-yellow-300 min-w-full w-screen">
          <li>
            <h3 className="text-lg font-semibold">
              {props.wordsHits} {props.wordsHits === 1 ? 'palavra acertada' : 'palavras acertadas'}
            </h3>
          </li>
          <li>
            <h3 className="text-lg font-semibold">
              {props.points} {props.points === 1 ? 'ponto' : 'pontos'}
            </h3>
          </li>
          <li>
            <div className="flex flex-col gap-y-2">
              <h3 className="text-lg font-semibold">Palavras enviadas</h3>
              <div className="grid grid-cols-3 place-items-start gap-1">
                {props.wordsSent?.map((word: string, index: number) => (
                  <p key={`wordsSentStatus_${word}_${index}`}>{word}</p>
                ))}
              </div>
            </div>
          </li>
          <li>
            <div className="flex flex-col gap-y-2">
              <h3 className="text-lg font-semibold">Palavras acertadas</h3>
              <div className="grid grid-cols-3 place-items-start gap-1">
                {props.wordsHitsNames?.map((word: string, index: number) => (
                  <p key={`wordsHitsNamesStatus_${word}_${index}`}>{word}</p>
                ))}
              </div>
            </div>
          </li>
        </ul>
      </div>
    ),
    gameOver: <h1>Acabou</h1>,
  };

  if (!(props.status in components) || !components[props.status]) return null;

  return (
    <div className="fixed p-0 -my-2.5 -mx-1.5 top-0 left-0 flex flex-col items-center justify-center w-full h-full min-w-[100vw] min-h-screen z-50 bg-zinc-700 bg-opacity-60 text-center">
      {components[props.status]}
    </div>
  );
};

export default GameStatusComponent;
