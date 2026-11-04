import { useNavigate } from 'react-router-dom';
import type { Author } from '@/features/post';

interface BlockedUserCardProps {
    user: Author;
    onClose?: () => void;
    onUnblock: (username: string) => void;
}

const BlockedUserCard = ({ user, onClose, onUnblock }: BlockedUserCardProps) => {
    
    const navigate = useNavigate();

    return (
        <div className='flex items-center gap-2 rounded-xl p-3 transition-colors hover:bg-secondary-50'>
            <button
                type='button'
                onClick={() => {
                    onClose?.();
                    navigate(`/profile/${user.username}`);
                }}
                className='group flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left'
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
            </button>

            <button
                type='button'
                onClick={() => onUnblock(user.username)}
                aria-label={`Unblock @${user.username}`}
                className='shrink-0 cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold text-danger transition-colors hover:bg-danger/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger'
            >
                Unblock
            </button>
        </div>
    );
};

export default BlockedUserCard;
