import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileTopBar from './MobileTopBar';
import MobileBottomBar from './MobileBottomBar';

const AppLayout = () => {
    return (
        <div className="flex min-h-screen md:h-screen md:overflow-hidden">
            <Sidebar />

            <div className="flex min-w-0 flex-1 flex-col md:min-h-0">
                <MobileTopBar />

                <main className="min-h-0 flex-1 pb-16 md:overflow-y-auto md:pb-0">
                    <Outlet />
                </main>

                <MobileBottomBar />
            </div>
        </div>
    );
};

export default AppLayout;