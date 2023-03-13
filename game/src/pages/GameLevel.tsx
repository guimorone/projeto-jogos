import { useParams } from 'react-router-dom';
import { useGameContext } from './Game';

export default function GameLevel() {
  const { level } = useParams();
  const { words, gameStatus, playerHealth, setPlayerHealth, bossHealth, setBossHealth } = useGameContext();
  const levelParsed: number = Number(level);

  if (!words || !words.length || !level || !levelParsed || Number.isNaN(levelParsed)) return null;

  return (
    <>
      <h1 className="text-9xl font-black">{words.length}</h1>
      {words.slice(0, 10).map((w, index) => (
        <p key={`ingame_word_${index}`}>{w}</p>
      ))}
      <button
        className="w-fit p-1 md:px-3 md:py-1.5 flex flex-wrap gap-x-2 sm:gap-x-3.5 bg-rose-900 bg-opacity-70 hover:bg-opacity-100 rounded-full shadow-sm"
        onClick={() => setBossHealth(0)}
      >
        Próximo level
      </button>
    </>
  );
}
