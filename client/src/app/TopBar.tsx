import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ children }: { children: ReactNode }) => {

    const navigate = useNavigate();

    return (
        <div className='hidden md:flex items-center gap-3 px-3 py-8 bg-white w-full h-10 border-b border-b-secondary-100'>
            <button onClick={() => navigate(-1)} className='p-2 cursor-pointer hover:bg-secondary-100 rounded-full'>
                <ArrowLeft />
            </button>

            <p className='text-xl'>
                {children}
            </p>
        </div>
    )
};

export default TopBar;