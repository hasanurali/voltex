import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileTopBar from './MobileTopBar';
import MobileBottomBar from './MobileBottomBar';
import PostRightSideBar from './RightSideBar';

const AppLayout = () => {

    return (
        <div className="flex min-h-screen md:h-screen md:overflow-hidden">
            <Sidebar />

            <div className="flex flex-col flex-1 min-w-0 md:min-h-0">
                <MobileTopBar />

                <div className="flex flex-1 min-h-0 overflow-hidden">
                    <main className="min-w-0 w-full max-w-215 pb-16 md:overflow-y-auto md:pb-0">
                        <Outlet />
                    </main>

                    <PostRightSideBar />
                </div>

                <MobileBottomBar />
            </div>
        </div>
    );
};

export default AppLayout;