import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { Button, ConfirmDialog, SentinelLoadingItem } from '@/components';
import { Ban, Ellipsis, Link, MessageCircle, Shield, UsersRound } from 'lucide-react';
import { useAuthStore } from '@/store';
import { useUserProfile } from '../hooks/useUserProfile';
import { ROUTES } from '@/app/routes';
import { getApiErrorMessage } from '@/utils';
import TopBar from '@/app/TopBar';
import ProfileEditForm from '../components/ProfileEditForm';
import ProfileImageSection from '../components/ProfileImageSection';
import UserInfo from '../components/UserInfo';
import FollowUserSideBar from '../components/FollowUserSideBar';
import BlockedUserSidebar from '../components/BlockedUserSidebar';
import { useFollowToggle } from '@/hooks';
import { useFetchUserPost } from '@/features/post';
import { PostCard } from '@/features/post';
import { useBlockUser } from '@/features/block/hooks/useBlockUser';
import { useUnblockUser } from '@/features/block/hooks/useUnblockUser';
import { useUnfollowUser } from '@/features/follow';
import IconsSkeleton from '../components/IconsSkeleton';

const ProfilePage = () => {

    const [section, setSection] = useState<0 | 1>(0);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isMouseLeave, setisMouseLeave] = useState<boolean | null>(null);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [followSection, setFollowSection] = useState<'followers' | 'following' | null>(null);
    const [isFollowSidebarClosing, setIsFollowSidebarClosing] = useState(false);
    const [isBlockedUsersOpen, setIsBlockedUsersOpen] = useState(false);
    const [isBlockedUsersSidebarClosing, setIsBlockedUsersSidebarClosing] = useState(false);
    const [isMoreOptionsMenuOpen, setIsMoreOptionsMenuOpen] = useState(false);
    const [isBlockUnblockUserModelOpen, setIsBlockUnblockUserModelOpen] = useState(false);

    const navigate = useNavigate();

    const timeoutRef = useRef<number | null>(null);
    const observerTarget = useRef<HTMLDivElement | null>(null);

    const params = useParams();
    const routeUsername = params.username as string;

    const auth = useAuthStore((state) => state.auth);
    const isOwnProfile = routeUsername === auth?.user.username;

    const { data: viewedProfile, isPending: isUserProfilePending, error: userProfileError } = useUserProfile(routeUsername);

    const isBlockedUser = !!viewedProfile?.isBlocked;
    const isBlockedByUser = !!viewedProfile?.isBlockedByUser;

    useEffect(() => {

        if (isAxiosError(userProfileError) && userProfileError.response?.status !== 401) {
            navigate(ROUTES.home);
            toast.error(getApiErrorMessage(userProfileError));
        };
    }, [userProfileError]);

    const { isFollowing, setIsFollowing, handleFollowUser, handleUnFollowUser } = useFollowToggle(auth?.user.username as string, viewedProfile?.user.username as string);

    useEffect(() => {

        if (!viewedProfile) {
            return;
        };

        if (isMouseLeave === null) {
            setisMouseLeave(viewedProfile?.isFollowing);
        };

        setIsFollowing(viewedProfile?.isFollowing);
    }, [viewedProfile?.isFollowing]);

    const handleProfileClick = () => {

        if (isBlockedByUser) {
            toast.error('Unable to follow this user');
            return;
        };

        if (!isFollowing) {
            setisMouseLeave(false);
        };

        if (!isOwnProfile && isFollowing) {
            setIsConfirmDialogOpen(true);
            return;
        };

        isOwnProfile ?
            setIsEditProfileOpen(true)
            :
            handleFollowUser();
    };

    const clearTimeout = () => {
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        };
    };

    const closeFollowSidebar = () => {

        clearTimeout();

        setIsFollowSidebarClosing(true);

        timeoutRef.current = window.setTimeout(() => {

            setFollowSection(null);
            setIsFollowSidebarClosing(false);
        }, 300);
    };

    const closeBlockedUsersSidebar = () => {

        clearTimeout();

        setIsBlockedUsersSidebarClosing(true);

        timeoutRef.current = window.setTimeout(() => {

            setIsBlockedUsersOpen(false);
            setIsBlockedUsersSidebarClosing(false);
        }, 300);
    };

    const openBlockedUsersSidebar = () => {
        setIsMoreOptionsMenuOpen(false);
        setFollowSection(null);
        setIsBlockedUsersSidebarClosing(false);
        setIsBlockedUsersOpen(true);
    };

    useEffect(() => {
        return () => {
            clearTimeout();
        };
    }, []);


    const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useFetchUserPost(viewedProfile?.user.username as string);
    const currentToggleItems = (
        section ?
            data?.filter(post => post.media.length)
            :
            data?.filter(post => !post.media.length)
    ) ?? [];


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

    const handleMessage = () => {
        if (viewedProfile) {
            const { user, profile } = viewedProfile;
            navigate(`/conversations/${user._id}`,
                {
                    state: {
                        displayName: user.displayName,
                        username: user.username,
                        avatar: profile.avatar
                    }
                }
            );
        };
    };

    const viewedUserInfo = viewedProfile && {
        _id: viewedProfile?.user._id,
        displayName: viewedProfile?.user.displayName,
        username: viewedProfile?.user.username,
        avatar: viewedProfile?.profile.avatar
    };

    const { mutate: blockUserMutate } = useBlockUser(viewedUserInfo);
    const { mutate: unblockUserMutate } = useUnblockUser();
    const { mutate: unfollowUserMutate } = useUnfollowUser(auth?.user.username ?? '');

    const handleBlockUser = () => {

        blockUserMutate(viewedProfile?.user.username ?? '');

        if (viewedProfile?.isFollowing) {
            unfollowUserMutate(viewedProfile.user.username ?? '');
        };
    };

    const handleUnblockUser = () => {
        unblockUserMutate(viewedProfile?.user.username ?? '');
    };

    const handleCopyProfileLink = async () => {

        const username = viewedProfile?.user.username;

        if (!username) {
            return;
        };

        try {

            const profileUrl = `${window.location.origin}/profile/${username}`;
            await navigator.clipboard.writeText(profileUrl);

            toast.success("Profile link copied");

        } catch (error) {
            toast.error("Failed to copy link");
        };
    };

    return (
        <>
            <TopBar>
                Profile
            </TopBar>

            {/* Follow user sidebar */}
            {
                (followSection && viewedProfile) && (
                    <div onMouseDown={(e) => (e.target === e.currentTarget) && closeFollowSidebar()} className='fixed inset-0 z-40 flex items-stretch justify-end bg-black/40'>
                        <FollowUserSideBar
                            username={viewedProfile.user.username}
                            relationship={followSection}
                            count={followSection === 'followers' ? viewedProfile.user.followersCount : viewedProfile.user.followingCount}
                            isClosing={isFollowSidebarClosing}
                            onClose={closeFollowSidebar}
                            onRelationshipChange={setFollowSection}
                            onFollowSection={setFollowSection}
                        />
                    </div>
                )
            }

            {/* Blocked user sidebar */}
            {
                isBlockedUsersOpen && (
                    <div onMouseDown={(e) => (e.target === e.currentTarget) && closeBlockedUsersSidebar()} className='fixed inset-0 z-40 flex items-stretch justify-end bg-black/40'>
                        <BlockedUserSidebar
                            isClosing={isBlockedUsersSidebarClosing}
                            onClose={closeBlockedUsersSidebar}
                        />
                    </div>
                )
            }

            {/* Profile Edit form */}
            {
                (isEditProfileOpen && viewedProfile) && (
                    <ProfileEditForm profile={viewedProfile} onClose={() => setIsEditProfileOpen(false)} />
                )
            }

            <div className='@container'>

                {/* Background image and avatar section */}
                <ProfileImageSection isOwnProfile={isOwnProfile} viewedProfile={viewedProfile} isLoading={isUserProfilePending} />

                {/* User information section*/}
                <section className='p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col gap-5'>

                    {/* Edit, follow, message and more options button */}
                    <div className='flex justify-end gap-2 h-9'>

                        {
                            isUserProfilePending ?
                                <IconsSkeleton
                                    isOwnProfile={isOwnProfile}
                                />
                                :
                                <>
                                    <div className='relative'>
                                        <Button
                                            onClick={() => setIsMoreOptionsMenuOpen(true)}
                                            type='button'
                                            size='md'
                                            variant='outline'
                                            className='w-9 h-9 shrink-0 rounded-full! px-0! py-0! cursor-pointer'
                                        >
                                            <Ellipsis className='w-4.5 h-4.5 shrink-0' aria-hidden='true' />
                                        </Button>

                                        {/* More options menu */}
                                        {
                                            isMoreOptionsMenuOpen && (
                                                <div onClick={(e) => e.stopPropagation()} className={`absolute z-20 -top-1 right-0 hidden sm:flex ${isOwnProfile ? 'w-48' : 'w-56'} h-fit overflow-hidden rounded-md border border-secondary-100 bg-white shadow-2xl flex-col`}>
                                                    <button
                                                        onClick={() => {
                                                            handleCopyProfileLink();
                                                            setIsMoreOptionsMenuOpen(false)
                                                        }}
                                                        type="button"
                                                        className="flex items-center gap-3 px-3 py-2 text-left text-sm text-secondary-900 transition-colors hover:bg-secondary-50 focus-visible:bg-secondary-50 focus-visible:outline-none cursor-pointer"
                                                    >
                                                        <Link size={16} aria-hidden="true" />
                                                        <span>Copy profile link</span>
                                                    </button>
                                                    {
                                                        !isOwnProfile && <button
                                                            onClick={() => {
                                                                setIsMoreOptionsMenuOpen(false);
                                                                setIsBlockUnblockUserModelOpen(true);
                                                            }}
                                                            type="button"
                                                            className="flex items-center gap-3 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 hover:text-red-800 focus-visible:bg-red-50 focus-visible:outline-none cursor-pointer"
                                                        >
                                                            <Ban size={16} aria-hidden="true" className='pb-0.5' />
                                                            <span>{`${isBlockedUser ? 'Unblock' : 'Block'} @${viewedProfile?.user.username}`}</span>
                                                        </button>
                                                    }
                                                    {
                                                        isOwnProfile && (
                                                            <button
                                                                onClick={openBlockedUsersSidebar}
                                                                type="button"
                                                                className="flex items-center gap-3 px-3 py-2 text-left text-sm text-secondary-900 transition-colors hover:bg-secondary-50 focus-visible:bg-secondary-50 focus-visible:outline-none cursor-pointer"
                                                            >
                                                                <UsersRound size={16} aria-hidden="true" />
                                                                <span>Blocked users</span>
                                                            </button>
                                                        )
                                                    }
                                                </div>
                                            )
                                        }

                                        {/* Bottom more options Popupmenu */}
                                        {
                                            isMoreOptionsMenuOpen && (
                                                <div onClick={() => setIsMoreOptionsMenuOpen(false)} className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm sm:hidden">
                                                    <div onClick={(e) => e.stopPropagation()} role="dialog" className="w-full rounded-t-xl bg-white px-3 pb-3 pt-2">
                                                        <div aria-hidden="true" className="mx-auto mb-3 h-1 w-8 rounded-full bg-secondary-300" />
                                                        <h2 className="px-0.5 text-sm font-semibold text-secondary-900">
                                                            More options
                                                        </h2>
                                                        <p className="px-0.5 text-xs text-secondary-500">
                                                            @{viewedProfile?.user.username}
                                                        </p>

                                                        <div className="mt-2 flex flex-col">
                                                            <button
                                                                onClick={() => setIsMoreOptionsMenuOpen(false)}
                                                                type="button"
                                                                className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-left text-sm text-secondary-900 transition-colors hover:bg-secondary-50 focus-visible:bg-secondary-50 focus-visible:outline-none"
                                                            >
                                                                <Link size={16} aria-hidden="true" />
                                                                <span>Copy profile link</span>
                                                            </button>
                                                            {
                                                                !isOwnProfile && (
                                                                    <button
                                                                        onClick={() => {
                                                                            setIsMoreOptionsMenuOpen(false);
                                                                            setIsBlockUnblockUserModelOpen(true);
                                                                        }}
                                                                        type="button"
                                                                        className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-left text-sm text-red-600 transition-colors hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none"
                                                                    >
                                                                        <Ban size={16} aria-hidden="true" />
                                                                        <span>Block @{viewedProfile?.user.username}</span>
                                                                    </button>
                                                                )
                                                            }
                                                            {
                                                                isOwnProfile && <button
                                                                    onClick={openBlockedUsersSidebar}
                                                                    type="button"
                                                                    className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-left text-sm text-secondary-900 transition-colors hover:bg-secondary-50 focus-visible:bg-secondary-50 focus-visible:outline-none"
                                                                >
                                                                    <Shield size={16} aria-hidden="true" />
                                                                    <span>Blocked users</span>
                                                                </button>
                                                            }
                                                        </div>

                                                        <button
                                                            onClick={() => setIsMoreOptionsMenuOpen(false)}
                                                            type="button"
                                                            className="mt-2 flex min-h-11 w-full items-center justify-center rounded-xl bg-secondary-200 text-sm font-semibold text-secondary-900 transition-colors hover:bg-secondary-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-950"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>

                                    {
                                        (!isOwnProfile && !isBlockedUser && !isBlockedByUser) && (
                                            <Button
                                                onClick={handleMessage}
                                                type='button'
                                                size='md'
                                                variant='outline'
                                                className='w-9 h-9 shrink-0 rounded-full! px-0! py-0! cursor-pointer'
                                            >
                                                <MessageCircle className='w-4.5 h-4.5 shrink-0' aria-hidden='true' />
                                            </Button>
                                        )
                                    }

                                    <Button
                                        onClick={() => isBlockedUser ? setIsBlockUnblockUserModelOpen(true) : handleProfileClick()}
                                        onMouseLeave={() => !isBlockedUser && setisMouseLeave(true)}
                                        size='md'
                                        variant={isFollowing ? 'outline' : 'primary'}
                                        className={`${isBlockedUser ? 'group' : (isFollowing && isMouseLeave) && 'group'} ${isBlockedUser ? 'text-white bg-danger! hover:bg-danger!' : ''} w-fit h-9 sm:h-full rounded-full! cursor-pointer sm:px-5 ${(isFollowing && isMouseLeave && !isBlockedUser) && 'hover:bg-red-100 hover:border-red-300!'}`}
                                    >
                                        <span className='group-hover:hidden'>
                                            {
                                                isBlockedUser ?
                                                    'Blocked'
                                                    :
                                                    isOwnProfile ?
                                                        'Edit profile'
                                                        :
                                                        isFollowing ?
                                                            'Following'
                                                            :
                                                            'Follow'
                                            }
                                        </span>

                                        <span className={`hidden group-hover:inline ${isBlockedUser ? 'text-white' : 'text-danger'}`}>{isBlockedUser ? 'Unblock' : 'Unfollow'}</span>
                                    </Button>

                                    <ConfirmDialog
                                        isOpen={isConfirmDialogOpen}
                                        title={`Unfollow @${viewedProfile?.user.username}?`}
                                        description="You'll stop seeing their posts in your feed. You can still visit their profile and follow them again anytime."
                                        confirmLabel='Unfollow'
                                        onConfirm={() => {
                                            handleUnFollowUser();
                                            setIsConfirmDialogOpen(false);
                                        }}
                                        onCancel={() => setIsConfirmDialogOpen(false)}
                                    />
                                </>
                        }
                    </div>

                    {/* User information */}
                    <UserInfo
                        viewedProfile={viewedProfile}
                        isLoading={isUserProfilePending}
                        onFollowingClick={() => setFollowSection('following')}
                        onFollowersClick={() => setFollowSection('followers')}
                    />

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

                    <div className='@container max-w-215 min-h-0 min-w-0 w-full bg-secondary-50 flex flex-col overflow-hidden overflow-y-auto'>
                        {
                            currentToggleItems.map(post => <PostCard key={post._id} post={post} />)
                        }

                        <SentinelLoadingItem
                            ref={observerTarget}
                            hasNextPage={hasNextPage}
                            hasItems={currentToggleItems.length > 0}
                            isFetchingNextPage={isFetchingNextPage}
                        />
                    </div>
                </section>
            </div>

            {/* More options menu overlay */}
            {
                isMoreOptionsMenuOpen && <div
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMoreOptionsMenuOpen(false);
                    }}
                    aria-hidden="true"
                    className="absolute z-10 inset-0 hidden bg-transparent sm:block"></div>
            }

            {/* Confirm message delete model */}
            <ConfirmDialog
                isOpen={isBlockUnblockUserModelOpen}
                title={`${isBlockedUser ? 'Unblock' : 'Block'} ${viewedProfile?.user.username}?`}
                description={isBlockedUser ?
                    `You and ${viewedProfile?.user.username} will now be able to follow and message each other again.`
                    :
                    `They will be able to see your public posts, but you and ${viewedProfile?.user.username} will not be able to follow or message each other.`
                }
                confirmLabel={`${isBlockedUser ? 'Unblock' : 'Block'}`}
                cancelLabel="Cancel"
                onConfirm={() => {
                    isBlockedUser ?
                        handleUnblockUser()
                        :
                        handleBlockUser();
                    setIsBlockUnblockUserModelOpen(false);
                }}
                onCancel={() => setIsBlockUnblockUserModelOpen(false)}
            />
        </>
    );
};

export default ProfilePage;