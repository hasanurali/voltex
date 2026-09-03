import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from './routes.ts';
import NotFoundPage from '../pages/NotFoundPage.tsx';
import RouteErrorPage from "../pages/RouteErrorPage.tsx"
import GuestRoute from './GuestRoute.tsx';
import { LoginPage, RegisterPage } from '@/features/auth';


export const router = createBrowserRouter([
    {
        path: '/',
        errorElement: <RouteErrorPage />,
        children: [

            // Guest routes
            {
                element: <GuestRoute />,
                children: [
                    {
                        path: ROUTES.login,
                        element: <LoginPage />
                    },
                    {
                        path: ROUTES.register,
                        element: <RegisterPage />
                    }
                ],
            },

            // Public routes
            {
                path: ROUTES.notFound,
                element: <NotFoundPage />
            }
        ],
    },
]);
