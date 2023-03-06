import { useParams } from 'react-router-dom';

export default function GameLevel() {
  const { level } = useParams();

  return <h1 className="text-9xl font-black">Level: {level}</h1>;
}
