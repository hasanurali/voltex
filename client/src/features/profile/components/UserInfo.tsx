import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Link2, MapPin } from 'lucide-react'
import type { AuthUser } from '@/features/auth';
import UserInfoSkeleton from './UserInfoSkeleton';


interface UserInfoProps {
    viewedProfile: AuthUser | undefined;
    isLoading: boolean;
};


const UserInfo = ({ viewedProfile, isLoading }: UserInfoProps) => {

    const [isBioExpanded, setIsBioExpanded] = useState(false);

    const bio = viewedProfile?.profile.bio;
    const location = viewedProfile?.profile.location;
    const website = viewedProfile?.profile.website;
    const date = new Date(viewedProfile?.user.createdAt ?? new Date().toISOString());
    const monthText = date.toLocaleString('en-US', { month: 'long' });
    const yearNumber = date.getFullYear();

    return (
        <div className='relative flex flex-col gap-4 pt-8 sm:pt-10'>
            {
                isLoading ? (

                    <UserInfoSkeleton />

                ) : (
                    <>
                        <div>
                            <p className="wrap-break-word font-bold text-xl">
                                {viewedProfile?.user.displayName}
                            </p>
                            <p className="wrap-break-word text-sm text-secondary-400">
                                {`@${viewedProfile?.user.username}`}
                            </p>
                        </div>

                        {bio && (
                            <div className='text-sm font-sans'>
                                <p className='wrap-break-word inline font-light'>
                                    {bio.length <= 70 ? bio : (isBioExpanded ? bio : `${bio.slice(0, 70)}...`)}
                                </p>
                                <button
                                    type='button'
                                    onClick={() => setIsBioExpanded((expanded) => !expanded)}
                                    aria-expanded={isBioExpanded}
                                    className='ml-1 text-xs font-medium text-primary-500 hover:underline cursor-pointer'
                                >
                                    {bio.length > 70 && (isBioExpanded ? 'Close' : 'Read more')}
                                </button>
                            </div>
                        )}

                        <div className='flex flex-wrap items-center gap-4 text-sm'>
                            {website && (
                                <p className='flex items-center gap-2 wrap-break-word font-medium cursor-pointer'>
                                    <Link2 size={20} />
                                    <Link
                                        to={website}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='border-b-2 border-b-transparent hover:border-primary-950'
                                    >
                                        {website.split('/')?.at(-1)}
                                    </Link>
                                </p>
                            )}
                            {location && (
                                <p className='flex items-center gap-2 wrap-break-word text-tertiary-400'>
                                    <MapPin size={20} />
                                    {location}
                                </p>
                            )}
                            <p className='flex gap-2 text-tertiary-400'>
                                <Calendar size={20} color='gray' />
                                {`Joined ${monthText} ${yearNumber}`}
                            </p>
                        </div>

                        <div className='flex gap-4 text-sm font-bold'>
                            <p>{viewedProfile?.user.followingCount} <span className='text-tertiary-400 font-normal'>Following</span></p>
                            <p>{viewedProfile?.user.followersCount} <span className='text-tertiary-400 font-normal'>Followers</span></p>
                        </div>
                    </>
                )
            }
        </div>
    )
};

export default UserInfo;