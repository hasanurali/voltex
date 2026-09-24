import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useFetchUserFollowers, useFetchUserFollowings } from '@/features/follow';
import type { FollowUserItem } from '@/features/follow/types';
import FollowUserCard from './FollowUserCard';
import { SentinelLoadingItem } from '@/components';

interface FollowUserSideBarProps {
    username: string;
    relationship: 'followers' | 'following';
    count?: number;
    isClosing?: boolean;
    onClose?: () => void;
    onRelationshipChange: (relationship: 'followers' | 'following') => void;
    onFollowSection: (state: 'followers' | 'following' | null) => void;
};

const FollowUserSideBar = ({ username, relationship, count, isClosing = false, onClose, onRelationshipChange, onFollowSection }: FollowUserSideBarProps) => {

    const [isEntering, setIsEntering] = useState(true);

    const followersQuery = useFetchUserFollowers(username);
    const followingQuery = useFetchUserFollowings(username);

    const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading, isError } = relationship === 'followers' ? followersQuery : followingQuery;
    const users: FollowUserItem[] = data ?? [];
    const relationshipLabel = relationship === 'followers' ? 'Followers' : 'Following';

    const observerTarget = useRef<HTMLDivElement | null>(null);

    useEffect(() => {

        const observer = new IntersectionObserver((entries) => {

            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            };

        }, { threshold: 0.1 });

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        };

        return () => {

            if (currentTarget) {

                observer.unobserve(currentTarget);
            };
        };
    }, [hasNextPage, isFetchingNextPage]);

    useEffect(() => {

        const frame = requestAnimationFrame(() => setIsEntering(false));

        return () => {
            cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <aside className={`${isClosing || isEntering ? 'translate-x-full' : 'translate-x-0'} flex h-full w-full max-w-md flex-col overflow-hidden border-l border-neutral-200 bg-white shadow-xl transition-transform duration-300 ease-out motion-reduce:translate-x-0 motion-reduce:transition-none`}>
            <header className='border-b border-neutral-100 px-5 py-4'>

                {/* Top follow heading */}
                <div className='flex items-start justify-between'>
                    <div>
                        <h2 className='text-lg font-bold text-neutral-950'>{relationshipLabel}</h2>
                        {count !== undefined && (
                            <p className='text-xs font-medium text-secondary-400'>
                                {count.toLocaleString()} {relationshipLabel.toLowerCase()}
                            </p>
                        )}
                    </div>

                    {onClose && (
                        <button onClick={onClose} type='button' aria-label='Close followers' className='rounded-full p-2 text-secondary-400 transition-colors hover:bg-neutral-100 hover:text-neutral-950 cursor-pointer'>
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Button toggle group */}
                <div className='mt-3 grid grid-cols-2 rounded-lg bg-neutral-100 p-0.5'>
                    {(['followers', 'following'] as const).map(option => (
                        <button onClick={() => onRelationshipChange(option)} key={option} className={`${relationship === option ? 'bg-white text-neutral-950 shadow-sm' : 'text-secondary-400 hover:text-neutral-950'} rounded-md px-3 py-2 text-xs font-medium transition-colors cursor-pointer`}>
                            {option === 'followers' ? 'Followers' : 'Following'}
                        </button>
                    ))}
                </div>
            </header>

            {/* User card container */}
            <div className='min-h-0 flex-1 overflow-y-auto p-3'>
                {isLoading && (
                    <p className='px-3 py-8 text-center text-sm text-secondary-400'>Loading {relationshipLabel.toLowerCase()}...</p>
                )}

                {isError && (
                    <p className='px-3 py-8 text-center text-sm text-danger'>Unable to load {relationshipLabel.toLowerCase()}.</p>
                )}

                {!isLoading && !isError && users.length === 0 && (
                    <p className='px-3 py-8 text-center text-sm text-secondary-400'>No {relationshipLabel.toLowerCase()} yet.</p>
                )}

                {!isLoading && !isError && users.map(user => (
                    <FollowUserCard key={user._id} user={user} onFollowSection={onFollowSection} />
                ))}

                {/* Bottom sentinelLoadingItem for intersection observer and loading more user */}
                <SentinelLoadingItem
                    ref={observerTarget}
                    isFetchingNextPage={isFetchingNextPage}
                    hasNextPage={hasNextPage}
                    hasItems={users.length > 0}
                />
            </div>
        </aside>
    );
};

export default FollowUserSideBar;