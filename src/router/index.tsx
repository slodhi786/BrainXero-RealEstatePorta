import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import HomePage from '@/pages/home-page';
import PropertyDetailPage from '@/pages/property-detail-page';
import NotFoundPage from '@/pages/not-found-page';

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
