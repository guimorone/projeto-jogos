import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import GameLevel from './pages/GameLevel';
import Algorithm from './pages/Algorithm';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/algorithm', element: <Algorithm /> },
  {
    path: '/game',
    element: <Game />,
    children: [
      {
        path: ':level',
        element: <GameLevel />,
      },
    ],
  },
  
  { path: '*', loader: () => redirect('/') },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
