import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components'
import type { SearchedUser } from '../types';
import { useFollowUser, useUnfollowUser } from '@/features/follow';


interface UserCardProps {
    user: SearchedUser;
};


const UserCard = ({ user }: UserCardProps) => {

    const [isFollowing, setIsFollowing] = useState(user.isFollowing);

    const navigate = useNavigate();

    const { mutate: followUserMutate, isPending: isFollowUserPending } = useFollowUser(user.username);
    const { mutate: unfollowUserMutate, isPending: isUnfollowUserPending } = useUnfollowUser(user.username);

    const handleFollowUser = () => {

        if (isFollowing || isFollowUserPending || isUnfollowUserPending) {
            return;
        };

        followUserMutate(user.username, {
            onError: () => {
                setIsFollowing(false);
                return;
            }
        });
        setIsFollowing(true);
    };

    const handleUnFollowUser = () => {

        if (!isFollowing || isFollowUserPending || isUnfollowUserPending) {
            return;
        };

        unfollowUserMutate(user.username, {
            onError: () => {
                setIsFollowing(true);
                return;
            }
        });
        setIsFollowing(false);
    };

    return (
        <div onClick={() => navigate(`/profile/${user.username}`)} className='min-h-20 flex justify-between items-center p-2 min-[400px]:p-3 border-b border-neutral-100 cursor-pointer hover:bg-secondary-50'>
            <div className="flex items-center gap-3">
                <img className="w-12 min-[400px]:w-14 rounded-full" src={user.avatar} alt={user.displayName} />
                <div>
                    <p className="font-bold text-sm min-[400px]:text-[16px]">{user.displayName}</p>
                    <p className="font-medium text-[15px] min-[400px]:text-sm text-secondary-400">{`@${user.username}`}</p>
                </div>
            </div>

            <Button onClick={(e) => { e.stopPropagation(), handleFollowUser(), handleUnFollowUser() }} size="sm" variant={isFollowing ? 'outline' : 'primary'} className={`${isFollowing && 'group'} h-9 min-[400px]:h-10 px-5 min-[400px]:px-7 rounded-full! cursor-pointer transition-colors duration-200 ${isFollowing && 'hover:bg-red-200 hover:border-red-300!'}`}>

                <span className='group-hover:hidden'>
                    {
                        isFollowing ?
                            'Following'
                            :
                            'Follow'
                    }
                </span>

                <span className='hidden group-hover:inline text-danger'>Unfollow</span>
            </Button>
        </div>
    )
};

export default UserCard;