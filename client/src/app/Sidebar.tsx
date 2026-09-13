import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Bell, Ellipsis, Home, LogOut, Mail, Search, Settings, User } from "lucide-react";
import { ROUTES } from "@/app/routes";
import { Button, Logo } from "@/components";
import { useAuthStore } from "@/store";
import { useLogoutUser } from "@/features/auth";


const Sidebar = () => {

    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    const auth = useAuthStore((state) => state.auth);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const navItems = [
        { label: 'Home', icon: Home, path: ROUTES.home },
        { label: 'Search', icon: Search, path: '/n' },
        { label: 'Messages', icon: Mail, path: '/n' },
        { label: 'Notifications', icon: Bell, path: '/n' },
        { label: 'Profile', icon: User, path: `/profile/${auth?.user.username}` },
        { label: 'Settings', icon: Settings, path: '/n' },
    ];

    useEffect(() => {

        const handlePointerDown = (event: PointerEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
        };
    }, []);


    const { mutate: logoutUserMutate, isPending: isLogoutPending } = useLogoutUser();
    const handleLogout = () => {
        logoutUserMutate();
    };

    return (
        <aside className="w-full md:w-75 min-[851px]:w-[clamp(320px,25vw,360px)] md:max-w-none md:shrink-0 max-h-screen h-screen overflow-y-auto pr-5 pl-[clamp(36px,3vw,72px)] py-5 md:max-[850px]:pr-[clamp(12px,2vw,16px)] md:max-[850px]:pl-[clamp(20px,3vw,24px)] hidden md:flex flex-col justify-between bg-primary-50 border-r border-r-secondary-100 font-label">

            <header className="flex gap-3 items-center">
                <Logo />
                <h1 className="text-3xl font-bold">Voltex</h1>
            </header>

            <nav className="flex flex-col gap-3 py-3">
                {
                    navItems.map(item => {

                        const IconComponent = item.icon;

                        return (
                            <NavLink to={item.path} key={item.label} end>
                                {({ isActive }) => (
                                    <div className={`${isActive ? 'font-bold text-primary-950 bg-primary-100 hover:bg-primary-200' : ''} flex min-w-0 items-center gap-5 px-7 py-3 md:max-[850px]:gap-4 md:max-[850px]:px-4 text-lg rounded-full hover:bg-primary-100`}>
                                        {IconComponent && <IconComponent className={`shrink-0 ${isActive ? 'text-black stroke-[2.5]' : ''}`} />}
                                        <p className="min-w-0 wrap-break-word">{item.label}</p>
                                    </div>
                                )}
                            </NavLink>
                        )
                    })
                }
            </nav>

            <footer className="flex flex-col gap-5">
                <Button size="lg" className="w-full rounded-full! cursor-pointer">
                    Post
                </Button>

                <div ref={profileMenuRef} aria-hidden={!isAuthenticated} className={`${!isAuthenticated && 'hidden'} relative `}>
                    <div className="flex min-w-0 justify-between items-center p-3 md:max-[850px]:p-2 rounded-full hover:bg-tertiary-100">
                        <div className="flex min-w-0 items-center gap-3">
                            <img className="h-12 w-12 shrink-0 rounded-full object-cover" src={auth?.profile.avatar} alt={auth?.user.displayName ?? 'Profile avatar'} />
                            <div className="min-w-0">
                                <p className="wrap-break-word font-medium">{auth?.user.displayName}</p>
                                <p className="wrap-break-word text-sm text-secondary-400">{`@${auth?.user.username}`}</p>
                            </div>
                        </div>

                        <button type="button" aria-label="Open profile menu" aria-expanded={isProfileMenuOpen} onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)} className="shrink-0 rounded-full p-2 hover:bg-tertiary-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-950">
                            <Ellipsis className="h-5 w-5 cursor-pointer" />
                        </button>
                    </div>

                    <div role="menu" aria-hidden={!isProfileMenuOpen} className={`absolute left-1/2 bottom-full z-10 mb-3 w-44 -translate-x-1/2 origin-bottom transform-gpu rounded-xl border border-black/5 bg-white p-1.5 shadow-lg transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none ${isProfileMenuOpen ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-1 scale-95 opacity-0'}`}>
                        <Button onClick={handleLogout} disabled={isLogoutPending} loading={isLogoutPending} type="button" variant="ghost" size="sm" className="w-full justify-start rounded-lg! px-3 py-2 text-left text-sm font-medium text-danger! transition-colors hover:bg-red-50 hover:text-red-700! cursor-pointer **:[[role=status]]:border-red-200! **:[[role=status]]:border-t-red-600!">
                            {!isLogoutPending && <LogOut className="h-4 w-4" />}
                            {isLogoutPending ? 'Signing out...' : 'Sign out'}
                        </Button>

                        <span className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-[7px] border-t-[7px] border-x-transparent border-t-white" aria-hidden="true" />
                    </div>
                </div>
            </footer>

        </aside>
    )
};

export default Sidebar;