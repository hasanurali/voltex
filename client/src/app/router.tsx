import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from './routes.ts';
import NotFoundPage from '../pages/NotFoundPage.tsx';

export const router = createBrowserRouter([
    {
        path: ROUTES.notFound,
        element: <NotFoundPage />
    },
]);