import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from './routes.ts';
import NotFoundPage from '../pages/NotFoundPage.tsx';
import RouteErrorPage from "../pages/RouteErrorPage.tsx"
import GuestRoute from './GuestRoute.tsx';
import { LoginPage, RegisterPage, VerifyEmailPage, ForgotPasswordPage, ResetPasswordPage } from '@/features/auth';
import { ProfilePage } from '@/features/profile';
import AppLayout from './AppLayout.tsx';
import ProtectedRoute from './ProtectedRoute.tsx';
import { SearchUserPage } from '@/features/user';


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
                    },
                    {
                        path: ROUTES.verifyEmail,
                        element: <VerifyEmailPage />
                    },
                    {
                        path: ROUTES.forgotPassword,
                        element: <ForgotPasswordPage />
                    },
                    {
                        path: ROUTES.resetPassword,
                        element: <ResetPasswordPage />
                    }
                ],
            },

            {
                element: <AppLayout />,
                children: [
                    {
                        index: true
                    },
                    {
                        path: ROUTES.searchUser,
                        element: <SearchUserPage />
                    },
                    {
                        element: <ProtectedRoute />,
                        children: [
                            {
                                path: ROUTES.profile,
                                element: <ProfilePage />
                            }
                        ]
                    }
                ]
            },

            {
                path: ROUTES.notFound,
                element: <NotFoundPage />,
            }
        ],
    },
]);
