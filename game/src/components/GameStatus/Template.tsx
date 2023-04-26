import { FC } from 'react';
import { classNames } from '../../utils';
import type { LevelDoneType, GameStatusOptions } from '../../@types';

interface IFuncProps {
  status: GameStatusOptions;
  props: LevelDoneType;
}

const Template: FC<IFuncProps> = ({ status, props }: IFuncProps) => {
  const headers: {
    [type in GameStatusOptions]?: {
      title: { value: string; color: string };
      subtitle: { value: string; color: string };
    };
  } = {
    victory: {
      title: { value: 'Parabéns!', color: 'text-teal-600' },
      subtitle: { value: 'Você avançou de nível!', color: 'text-teal-300' },
    },
    defeat: {
      title: { value: 'Ah, que pena!', color: 'text-rose-600' },
      subtitle: { value: 'Mas não desanime, tente novamente!', color: 'text-rose-300' },
    },
    gameOver: {
      title: { value: 'Parabéns!', color: 'text-teal-600' },
      subtitle: { value: 'Você terminou o jogo!', color: 'text-teal-300' },
    },
  };

  if (!props || !(status in headers) || !headers[status]) return null;

  const header = headers[status];

  return (
    <div className="space-y-5" style={{ top: "32px", position: "absolute"}}>
      <h1
        className={classNames(
          header?.title.color,
          'text-7xl tracking-wider font-medium italic motion-safe:animate-bounce'
        )}
      >
        {header?.title.value}
      </h1>
      <h2 className={classNames(header?.subtitle.color, 'text-3xl tracking-wide font-medium')}>
        {header?.subtitle.value}
      </h2>
      <>
        <h2 className="text-xl text-sky-300 pb-5">Objetivos alcançados neste level:</h2>
        <ul className="grid grid-cols-3 place-items-center text-left list-disc marker:text-sky-300 min-w-full w-screen">
          <li>
            <h3 className="text-lg font-semibold">
              {props.points} {props.points === 1 ? 'ponto' : 'pontos'}
            </h3>
          </li>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <li>
              <div className="flex flex-col gap-y-2">
                <h3 className="text-lg font-semibold">
                  {props.wordsHitsNames?.length}
                  {props.wordsHitsNames?.length === 1 ? ' palavra acertada' : ' palavras acertadas'}
                </h3>
                <ol className="grid grid-cols-3 lg:grid-cols-4 place-items-start gap-y-1 gap-x-12 md:gap-x-20 list-decimal">
                  {props.wordsHitsNames?.map((word: string, index: number) => (
                    <li key={`wordsHitsNamesStatus_${word}_${index}`} className="capitalize pl-0.5">
                      {word}
                    </li>
                  ))}
                </ol>
              </div>
            </li>

            <li>
              <div className="flex flex-col gap-y-2">
                <h3 className="text-lg font-semibold">
                  {props.wordsMissedNames?.length}
                  {props.wordsMissedNames?.length === 1 ? ' palavra perdida' : ' palavras perdidas'}
                </h3>
                <ol className="grid grid-cols-3 lg:grid-cols-4 place-items-start gap-y-1 gap-x-12 md:gap-x-20 list-decimal">
                  {props.wordsMissedNames?.map((word: string, index: number) => (
                    <li key={`wordsMissedNamesStatus_${word}_${index}`} className="capitalize pl-0.5">
                      {word}
                    </li>
                  ))}
                </ol>
              </div>
            </li>
          </div>
        </ul>
      </>
      {status !== 'victory' && (
        <>
          <h2 className="text-xl text-yellow-300 pb-5">Objetivos alcançados em todo jogo:</h2>
          <ul className="grid grid-cols-3 place-items-center text-left list-disc marker:text-yellow-300 min-w-full w-screen">

            <li>
              <h3 className="text-lg font-semibold">
                {props.totalPoints} {props.totalPoints === 1 ? 'ponto' : 'pontos'}
              </h3>
            </li>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>

              <li>
                <div className="flex flex-col gap-y-2">
                  <h3 className="text-lg font-semibold">
                    {props.totalWordsHitsNames?.length}
                    {props.totalWordsHitsNames?.length === 1 ? ' palavra acertada' : ' palavras acertadas'}
                  </h3>
                  <ol className="grid grid-cols-3 lg:grid-cols-4 place-items-start gap-y-1 gap-x-12 md:gap-x-20 list-decimal">
                    {props.totalWordsHitsNames?.map((word: string, index: number) => (
                      <li key={`totalWordsHitsNamesStatus_${word}_${index}`} className="capitalize pl-0.5">
                        {word}
                      </li>
                    ))}
                  </ol>
                </div>
              </li>

              <li>
                <div className="flex flex-col gap-y-2">
                  <h3 className="text-lg font-semibold">
                    {props.totalWordsMissedNames?.length}
                    {props.totalWordsMissedNames?.length === 1 ? ' palavra perdida' : ' palavras perdidas'}
                  </h3>
                  <ol className="grid grid-cols-3 lg:grid-cols-4 place-items-start gap-y-1 gap-x-12 md:gap-x-20 list-decimal">
                    {props.totalWordsMissedNames?.map((word: string, index: number) => (
                      <li key={`totalWordsMissedNamesStatus_${word}_${index}`} className="capitalize pl-0.5">
                        {word}
                      </li>
                    ))}
                  </ol>
                </div>
              </li>

            </div>
          </ul>
        </>
      )}
    </div>
  );
};

export default Template;
