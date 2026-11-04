import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useFetchBlockedUsers } from '@/features/block/hooks/useFetchBlockedUsers';
import { useUnblockUser } from '@/features/block/hooks/useUnblockUser';
import BlockedUserCard from './BlockedUserCard';

interface BlockedUserSidebarProps {
    isClosing?: boolean;
    onClose?: () => void;
};

const BlockedUserSidebar = ({ isClosing = false, onClose }: BlockedUserSidebarProps) => {

    const [isEntering, setIsEntering] = useState(true);

    const { data: users = [], isPending, isError } = useFetchBlockedUsers();

    const { mutate: unblockUserMutate } = useUnblockUser();

    useEffect(() => {

        const frame = requestAnimationFrame(() => setIsEntering(false));

        return () => {
            cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <aside className={`${(isClosing || isEntering) ? 'translate-x-full' : 'translate-x-0'} flex h-full w-full max-w-md flex-col overflow-hidden border-l border-neutral-200 bg-white shadow-xl transition-transform duration-300 ease-out motion-reduce:translate-x-0 motion-reduce:transition-none`}>
            <header className='flex items-start justify-between border-b border-neutral-100 px-5 py-4'>
                <div>
                    <h2 className='text-lg font-bold text-neutral-950'>Blocked users</h2>
                    {
                        (!isPending && !isError) && (
                            <p className='text-xs font-medium text-secondary-400'>
                                {users.length.toLocaleString()} blocked {users.length === 1 ? 'user' : 'users'}
                            </p>
                        )
                    }
                </div>

                {
                    onClose && (
                        <button onClick={onClose} type='button' aria-label='Close blocked users' className='cursor-pointer rounded-full p-2 text-secondary-400 transition-colors hover:bg-neutral-100 hover:text-neutral-950'>
                            <X size={18} />
                        </button>
                    )
                }
            </header>

            <div className='min-h-0 flex-1 overflow-y-auto p-3'>
                {isPending && (
                    <p className='px-3 py-8 text-center text-sm text-secondary-400'>Loading blocked users...</p>
                )}

                {isError && (
                    <p className='px-3 py-8 text-center text-sm text-danger'>Unable to load blocked users.</p>
                )}

                {!isPending && !isError && users.length === 0 && (
                    <p className='px-3 py-8 text-center text-sm text-secondary-400'>You haven't blocked anyone.</p>
                )}

                {!isPending && !isError && users.map(user => (
                    <BlockedUserCard
                        key={user._id}
                        user={user}
                        onClose={onClose}
                        onUnblock={unblockUserMutate}
                    />
                ))}
            </div>
        </aside>
    );
};

export default BlockedUserSidebar;
