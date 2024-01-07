import { createBrowserRouter } from 'react-router-dom';
import Root from './Root';
import Tv from './Routes/Tv';
import Search from './Routes/Search';
import Home from './Routes/Home';
import ErrorPage from './Routes/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'tv',
        element: <Tv />,
      },
      {
        path: 'search',
        element: <Search />,
      },
      {
        path: 'movies/:movieId',
        element: <Home />,
      },
      {
        path: '',
        element: <Home />,
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

export default router;
