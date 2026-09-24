import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { FollowUserItem } from '@/features/follow';


interface FollowUserCardProps {
    user: FollowUserItem;
    onFollowSection: (state: 'followers' | 'following' | null) => void;
};


const FollowUserCard = ({ user, onFollowSection }: FollowUserCardProps) => {

    const navigate = useNavigate();

    return (
        <div onClick={() => {
            onFollowSection(null);
            navigate(`/profile/${user.username}`)
        }}
            className='group flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-secondary-50 cursor-pointer'
        >
            <img
                src={user.avatar}
                alt={user.displayName}
                className='h-11 w-11 shrink-0 rounded-full object-cover'
            />

            <span className='min-w-0 flex-1'>
                <span className='block truncate text-sm font-bold text-neutral-950'>
                    {user.displayName}
                </span>
                <span className='block truncate text-xs font-medium text-secondary-400'>
                    @{user.username}
                </span>
            </span>

            <ChevronRight
                aria-hidden='true'
                size={24}
                strokeWidth={2.5}
                className='shrink-0 text-neutral-500 transition-transform group-hover:translate-x-1 group-hover:text-neutral-950'
            />
        </div>
    )
};

export default FollowUserCard;