import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from './routes.ts';
import NotFoundPage from '../pages/NotFoundPage.tsx';
import RouteErrorPage from "../pages/RouteErrorPage.tsx"

export const router = createBrowserRouter([
    {
        path: ROUTES.notFound,
        element: <NotFoundPage />,
        errorElement: <RouteErrorPage />
    },
]);