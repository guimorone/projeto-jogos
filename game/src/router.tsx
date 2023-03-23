import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/game', element: <Game /> },
  { path: '*', loader: () => redirect('/') },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
