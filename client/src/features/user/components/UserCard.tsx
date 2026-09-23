import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, ConfirmDialog } from '@/components'
import type { SearchedUser } from '../types';
import { useFollowToggle } from '@/hooks';


interface UserCardProps {
    user: SearchedUser;
    currentUserName: string | null;
};


const UserCard = ({ user, currentUserName }: UserCardProps) => {

    const [isMouseLeave, setisMouseLeave] = useState(user.isFollowing);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    const navigate = useNavigate();

    const { isFollowing, setIsFollowing, handleFollowUser, handleUnFollowUser } = useFollowToggle(currentUserName as string, user.username);

    useEffect(() => {
        setIsFollowing(user.isFollowing);
    }, [user.isFollowing]);

    const handleCardClick = (e: React.MouseEvent<HTMLButtonElement>) => {

        e.stopPropagation();

        if (!isFollowing) {
            setisMouseLeave(false);
        };

        if (isFollowing) {
            setIsConfirmDialogOpen(true);
            return;
        };

        handleFollowUser();
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

            <>
                <Button
                    onClick={handleCardClick}
                    onMouseLeave={() => setisMouseLeave(true)}
                    size="sm"
                    variant={isFollowing ? 'outline' : 'primary'}
                    className={`${(isFollowing && isMouseLeave) && 'group'} h-9 min-[400px]:h-10 px-5 min-[400px]:px-7 rounded-full! cursor-pointer transition-colors duration-200 ${(isFollowing && isMouseLeave) && 'hover:bg-red-100 hover:border-red-300!'}`}>

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
                <ConfirmDialog
                    isOpen={isConfirmDialogOpen}
                    title={`Unfollow @${user.username}?`}
                    description="You'll stop seeing their posts in your feed. You can still visit their profile and follow them again anytime."
                    confirmLabel='Unfollow'
                    onConfirm={() => {
                        handleUnFollowUser();
                        setIsConfirmDialogOpen(false);
                    }}
                    onCancel={() => setIsConfirmDialogOpen(false)}
                />
            </>
        </div>
    )
};

export default UserCard;