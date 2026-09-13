import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { ROUTES } from './routes';
import { Spinner } from '@/components';

const ProtectedRoute = () => {

    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">
            <Spinner size='lg' />
        </div>;
    };

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.login} replace />;
    };

    return <Outlet />;
};

export default ProtectedRoute;