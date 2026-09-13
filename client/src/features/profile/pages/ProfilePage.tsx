import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Calendar, Link2, MapPin } from 'lucide-react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components';
import { useAuthStore } from '@/store';
import { useUserProfile } from '../hooks/useUserProfile';
import { ROUTES } from '@/app/routes';
import { getApiErrorMessage } from '@/utils';
import TopBar from '@/app/TopBar';
import ProfileEditForm from '../components/ProfileEditForm';
import ProfileImageSection from '../components/ProfileImageSection';

const ProfilePage = () => {

    const [section, setSection] = useState<0 | 1>(0);
    const [isBioExpanded, setIsBioExpanded] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    const navigate = useNavigate();
    const params = useParams();
    const routeUsername = params.username as string;

    const auth = useAuthStore((state) => state.auth);
    const isOwnProfile = routeUsername === auth?.user.username;

    const { data: viewedProfile, error } = useUserProfile(routeUsername);

    useEffect(() => {

        if (isAxiosError(error) && error.response?.status !== 401) {
            navigate(ROUTES.home);
            toast.error(getApiErrorMessage(error));
        };
    }, [error, navigate]);

    const bio = viewedProfile?.profile.bio;
    const location = viewedProfile?.profile.location;
    const website = viewedProfile?.profile.website;
    const date = new Date(viewedProfile?.user.createdAt ?? new Date().toISOString());
    const monthText = date.toLocaleString('en-US', { month: 'long' });
    const yearNumber = date.getFullYear();

    return (
        <>
            <TopBar />

            {/* Profile Edit form */}
            {(isEditProfileOpen && viewedProfile) && (
                <ProfileEditForm profile={viewedProfile} onClose={() => setIsEditProfileOpen(false)} />
            )}

            <div className='@container'>

                {/* Background image and avatar section */}
                <ProfileImageSection isOwnProfile={isOwnProfile} viewedProfile={viewedProfile} />

                {/* User information section*/}
                <section className='p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col gap-5'>

                    {/* Edit and follow button */}
                    <div className='flex justify-end'>
                        <Button
                            size='md'
                            onClick={() => isOwnProfile && setIsEditProfileOpen(true)}
                            className='w-fit rounded-full! cursor-pointer'
                        >
                            {isOwnProfile ? 'Edit profile' : 'Follow'}
                        </Button>
                    </div>

                    {/* User information */}
                    <div className='relative flex flex-col gap-4 pt-8 sm:pt-10'>
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
                    </div>
                </section>

                {/* Bottom media and posts section */}
                <section>
                    <div className='relative flex w-full border-b border-tertiary-200 pt-5 font-medium'>
                        <span
                            aria-hidden='true'
                            className={`absolute bottom-0 left-0 h-0.75 w-2/4 bg-primary-950 transition-transform duration-300 ease-in-out motion-reduce:transition-none ${section ? 'translate-x-full' : 'translate-x-0'}`}
                        />
                        <button type='button' onClick={() => setSection(0)} className='flex-1 py-3 text-center cursor-pointer'>
                            Posts
                        </button>
                        <button type='button' onClick={() => setSection(1)} className='flex-1 py-3 text-center cursor-pointer'>
                            Media
                        </button>
                    </div>

                    <div>
                        {/* Media and Post */}
                    </div>
                </section>
            </div>
        </>
    );
};

export default ProfilePage;