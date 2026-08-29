import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { ROUTES } from './routes';

const ProtectedRoute = () => {

    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    };

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.login} replace />;
    };

    return <Outlet />;
};

export default ProtectedRoute;