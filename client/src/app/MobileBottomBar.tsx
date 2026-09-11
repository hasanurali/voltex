import { NavLink } from 'react-router-dom';
import { Home, Mail, Bell, Plus, User } from 'lucide-react';

const MobileBottomBar = () => {

    const leftItems = [
        { label: 'Home', icon: Home, path: '/n' },
        { label: 'Messages', icon: Mail, path: '/n' },
    ];

    const rightItems = [
        { label: 'Notifications', icon: Bell, path: '/n' },
        { label: 'Profile', icon: User, path: `/n` },
    ];

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
                <button type="button" aria-label="Create post" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-950 text-white">
                    <Plus className="h-5 w-5" />
                </button>
            </div>

            {rightItems.map((item) => (
                <NavLink key={item.label} to={item.path} end aria-label={item.label} className="flex justify-center">
                    {({ isActive }) => (
                        <item.icon className={`h-6 w-6 ${isActive ? 'text-primary-950' : 'text-neutral-500'}`} strokeWidth={isActive ? 2.5 : 2} />
                    )}
                </NavLink>
            ))}
        </nav>
    );
};

export default MobileBottomBar;