import { NavLink } from 'react-router-dom';
import { Home, Mail, Bell, Plus, User } from 'lucide-react';
import { useAuthStore, usePostStore } from '@/store';
import { ROUTES } from './routes';
import { useFetchNotifications } from '@/features/notification';

const MobileBottomBar = () => {

    const auth = useAuthStore((state) => state.auth);

    const setIsCreatePostModelOpen = usePostStore((state) => state.setIsCreatePostModelOpen);

    const leftItems = [
        { label: 'Home', icon: Home, path: ROUTES.home },
        { label: 'Messages', icon: Mail, path: ROUTES.notification }
    ];

    const rightItems = [
        { label: 'Notifications', icon: Bell, path: ROUTES.notification },
        { label: 'Profile', icon: User, path: `/profile/${auth?.user.username}` }
    ];

    const { data } = useFetchNotifications();
    const unreadCount = data?.[0].unreadCount ?? 0;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-10 grid grid-cols-5 items-center bg-white border-t border-neutral-200 py-2 md:hidden">
            {leftItems.map((item) => (
                <NavLink key={item.label} to={item.path} end aria-label={item.label} className="flex justify-center">
                    {({ isActive }) => (
                        <item.icon className={`h-6 w-6 ${isActive ? 'text-primary-950' : 'text-neutral-500'}`} strokeWidth={isActive ? 2.5 : 2} />
                    )}
                </NavLink>
            ))}

            <div className="flex justify-center">
                <button onClick={() => setIsCreatePostModelOpen(true)} type="button" aria-label="Create post" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-950 text-white">
                    <Plus className="h-5 w-5" />
                </button>
            </div>

            {rightItems.map((item) => (
                <NavLink key={item.label} to={item.path} end aria-label={item.label} className="flex justify-center">
                    {({ isActive }) => (
                        <span className='relative'>
                            <item.icon className={`h-6 w-6 ${isActive ? 'text-primary-950' : 'text-neutral-500'}`} strokeWidth={isActive ? 2.5 : 2} />
                            {(item.label === "Notifications" && !!unreadCount) && <p className="min-w-6 max-w-full text-center bg-[#1d9bf0] text-white text-xs rounded-2xl px-1 absolute -right-2.75 -top-1">{unreadCount <= 9 ? unreadCount : `9+`}</p>}
                        </span>
                    )}
                </NavLink>
            ))}
        </nav>
    );
};

export default MobileBottomBar;