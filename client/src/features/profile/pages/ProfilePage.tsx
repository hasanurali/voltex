import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import UserInfo from '../components/UserInfo';

const ProfilePage = () => {

    const [section, setSection] = useState<0 | 1>(0);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    const navigate = useNavigate();
    const params = useParams();
    const routeUsername = params.username as string;

    const auth = useAuthStore((state) => state.auth);
    const isOwnProfile = routeUsername === auth?.user.username;

    const { data: viewedProfile, isPending: isUserProfilePending, error } = useUserProfile(routeUsername);

    useEffect(() => {

        if (isAxiosError(error) && error.response?.status !== 401) {
            navigate(ROUTES.home);
            toast.error(getApiErrorMessage(error));
        };
    }, [error, navigate]);

    return (
        <>
            <TopBar />

            {/* Profile Edit form */}
            {(isEditProfileOpen && viewedProfile) && (
                <ProfileEditForm profile={viewedProfile} onClose={() => setIsEditProfileOpen(false)} />
            )}

            <div className='@container'>

                {/* Background image and avatar section */}
                <ProfileImageSection isOwnProfile={isOwnProfile} viewedProfile={viewedProfile} isLoading={isUserProfilePending} />

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
                    <UserInfo viewedProfile={viewedProfile} isLoading={isUserProfilePending} />

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