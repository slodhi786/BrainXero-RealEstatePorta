import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import HomePage from '@/pages/HomePage';
import PropertyDetailPage from '@/pages/PropertyDetailPage';
import NotFoundPage from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'property/:id', element: <PropertyDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
