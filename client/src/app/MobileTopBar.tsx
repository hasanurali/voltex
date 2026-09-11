import { Link } from 'react-router-dom';
import { Search, Settings } from 'lucide-react';
import Logo from '@/components/common/Logo';

const MobileTopBar = () => {
    return (
        <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white border-b border-neutral-200 md:hidden font-label">

            <div className="flex items-center gap-2">
                <Logo size={28} />
                <span className="font-bold text-lg">Voltex</span>
            </div>

            <div className="flex items-center gap-5">
                <Link to="/n" aria-label="Search">
                    <Search className="h-6 w-6" />
                </Link>
                <Link to="/n" aria-label="Settings">
                    <Settings className="h-6 w-6" />
                </Link>
            </div>

        </header>
    );
};

export default MobileTopBar;