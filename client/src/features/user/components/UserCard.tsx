import { Button } from '@/components'
import type { SearchedUser } from '../types';


interface UserCardProps {
    user: SearchedUser;
};


const UserCard = ({ user }: UserCardProps) => {

    return (
        <div className='min-h-20 flex justify-between items-center p-2 min-[400px]:p-3 border-b border-neutral-100 cursor-pointer hover:bg-secondary-50 transition-all duration-200'>
            <div className="flex items-center gap-3">
                <img className="w-12 min-[400px]:w-14 rounded-full" src={user.avatar} alt={user.displayName} />
                <div>
                    <p className="font-bold text-sm min-[400px]:text-[16px]">{user.displayName}</p>
                    <p className="font-medium text-[15px] min-[400px]:text-sm text-secondary-400">{`@${user.username}`}</p>
                </div>
            </div>

            <Button size="sm" variant={user.isFollowing ? 'outline' : 'primary'} className={`h-9 min-[400px]:h-10 px-5 min-[400px]:px-7 rounded-full! cursor-pointer ${user.isFollowing && 'hover:bg-secondary-200'}`}>
                {
                    user.isFollowing ?
                        'Following'
                        :
                        'Follow'
                }
            </Button>
        </div>
    )
};

export default UserCard;