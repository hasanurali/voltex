import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Check, CircleCheckBig, CircleX, Link2, MapPin, X } from 'lucide-react';
import { editProfileSchema, type EditProfileFormValues } from '../schemas/profileSchema'
import type { AuthUser } from '@/features/auth';
import { Button, Input, Spinner } from '@/components';
import { fieldApiError, filterDirtyInputs } from '@/utils';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { useUpdateUsername } from '../hooks/useUpdateUsername';
import { useDebounce } from '@/hooks';
import { useCheckUsername } from '../hooks/useCheckUsername';


interface ProfileEditFormProps {
    profile: AuthUser
    onClose: () => void;
};


const ProfileEditForm = ({ profile, onClose }: ProfileEditFormProps) => {

    const { register, handleSubmit, setError, control, trigger, formState: { errors } } = useForm<EditProfileFormValues>({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            displayName: profile?.user.displayName,
            username: profile?.user.username,
            bio: profile?.profile.bio ?? '',
            website: profile?.profile.website ?? '',
            location: profile?.profile.location ?? '',
        }
    });

    const { mutateAsync: updateUsernameMutateAsync, isPending: isUsernameUpdatePending } = useUpdateUsername();
    const { mutate: updateProfileMutate, isPending: isProfileUpdatePending } = useUpdateProfile(profile?.user.username);
    const isSaving = isUsernameUpdatePending || isProfileUpdatePending;

    const onSubmit = async (formData: EditProfileFormValues) => {

        const { displayName, username, ...restFormData } = formData;

        const filteredUserData = filterDirtyInputs(profile?.user, { displayName, username });
        const filteredProfileData = filterDirtyInputs(profile?.profile, restFormData);

        const hasProfileData = Object.keys(filteredProfileData).length > 0;
        const hasDisplayNameChange = !!filteredUserData.displayName;

        if (filteredUserData.username) {

            try {

                await updateUsernameMutateAsync({ username });

            } catch (error) {

                fieldApiError(error, setError);
                return;
            };
        };

        if (!hasProfileData && !hasDisplayNameChange) {
            onClose();
            return;
        };

        const profileUpdateData = {
            ...filteredProfileData,
            ...(displayName && { displayName: filteredUserData.displayName })
        };

        updateProfileMutate(profileUpdateData, {
            onSuccess: () => {
                onClose();
            },
            onError: (error) => {
                fieldApiError(error, setError);
            }
        });
    };

    const watchedUsername = useWatch({
        control,
        name: 'username'
    });

    const debouncedUsername = useDebounce(watchedUsername, 500);
    const usernameToCheck = debouncedUsername !== profile?.user.username ? debouncedUsername : '';
    const { data: usernameAvailableData, isPending: isCheckUsernamePending } = useCheckUsername(usernameToCheck);
    const isAvailableUsername = usernameAvailableData?.available;

    const date = new Date(profile?.user.createdAt ?? new Date().toISOString());
    const joinedDate = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    return (
        <section className='fixed inset-0 z-50 flex overflow-y-auto bg-black/50 px-2 py-4 sm:items-center sm:justify-center sm:px-6' aria-label='Edit profile' onMouseDown={onClose}>
            <div className='my-auto w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-2xl' onMouseDown={(event) => event.stopPropagation()}>

                {/* Edit profile header */}
                <header className='flex items-center justify-between border-b border-neutral-100 px-4 py-3 sm:px-5'>
                    <div>
                        <p className='text-sm font-semibold'>Edit profile</p>
                        <p className='mt-0.5 text-[10px] text-neutral-500'>Update your profile details</p>
                    </div>
                    <button type='button' onClick={onClose} aria-label='Close edit profile' className='rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950 cursor-pointer'>
                        <X size={16} />
                    </button>
                </header>

                {/* Edit profile form */}
                <form onSubmit={handleSubmit(onSubmit)} className='px-4 pb-4 pt-4 sm:px-5 sm:pb-5'>

                    {/* Button group */}
                    <div className='mb-5 flex flex-wrap items-center justify-end gap-2'>
                        <button
                            onClick={onClose}
                            className='rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50 cursor-pointer'
                            disabled={isSaving}
                        >
                            Cancel
                        </button>

                        <Button
                            size='sm'
                            loading={isSaving}
                            type='submit'
                            className='flex items-center gap-1.5 rounded-full! px-4 py-2 text-xs cursor-pointer'
                            disabled={isSaving}
                        >
                            {
                                isSaving ? (
                                    'Saving...'
                                ) : (
                                    <><Check size={13} /> Save Changes</>
                                )
                            }
                        </Button>
                    </div>

                    {/* Inputs grid */}
                    <div className='flex w-full flex-col gap-3'>

                        {/* Display name */}
                        <div className='flex flex-col gap-1.5 text-sm font-semibold tracking-normal text-neutral-500'>
                            <label htmlFor='displayName'>Full Name</label>
                            <Input {...register('displayName')} error={errors.displayName?.message} id='displayName' type='text' placeholder='e.g. John Doe' className={`w-full py-3 px-4 text-sm bg-neutral-50 focus:bg-white ${!errors.displayName && 'focus:border-primary-800'} placeholder:text-neutral-400 focus:placeholder:text-neutral-500`} />
                        </div>

                        {/* Username */}
                        <div className='flex flex-col gap-1.5 text-sm font-semibold tracking-normal text-neutral-500 relative'>
                            <label htmlFor='username'>Username</label>
                            <Input {...register('username', { onChange: (e) => (e.target.value !== profile?.user.username && trigger('username')) })} error={errors.username?.message} id='username' type='text' placeholder='e.g. johndoe9' className={`w-full py-3 px-4 pr-10 text-sm bg-neutral-50 text-neutral-500 focus:bg-white ${!errors.username && 'focus:border-primary-800'} ${debouncedUsername?.length >= 3 && debouncedUsername !== profile?.user.username && (isAvailableUsername ? 'focus:border-green-600! border-green-600 focus:ring-1 focus:ring-green-400/30' : 'focus:border-red-600! border-red-600  focus:ring-1 focus:ring-red-400/30')} placeholder:text-neutral-400 focus:placeholder:text-neutral-500`} />
                            <div className="absolute right-3.5 top-10">
                                {
                                    debouncedUsername?.length >= 3 && debouncedUsername !== profile?.user.username && (
                                        isCheckUsernamePending ?
                                            <Spinner size="sm" />
                                            :
                                            isAvailableUsername ?
                                                <CircleCheckBig size={17} color="green" />
                                                :
                                                <CircleX size={17} color="red" />
                                    )
                                }
                            </div>
                        </div>

                        {/* Bio */}
                        <div className='flex flex-col gap-1.5 text-sm font-semibold tracking-normal text-neutral-500'>
                            <label htmlFor='bio'>Bio</label>
                            <textarea {...register('bio')} id='bio' rows={3} maxLength={160} placeholder='Tell people a little about yourself' className={`w-full resize-none rounded-md border border-neutral-200 px-4 py-3 text-sm text-neutral-950 outline-none transition focus:bg-white ${!errors.bio && 'focus:border-primary-800'} placeholder:text-neutral-400 focus:placeholder:text-neutral-500`} />

                            {/* smooth animated error container */}
                            <div className={`grid transition-all duration-200 ease-out ${errors.bio?.message ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className="overflow-hidden">
                                    <span className="text-[13px] text-danger block leading-tight">
                                        {errors.bio?.message}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className='flex flex-col gap-1.5 text-sm font-semibold tracking-normal text-neutral-500'>
                            <label htmlFor='location'>Location</label>
                            <div className='relative w-full'>
                                <MapPin size={16} className='pointer-events-none z-10 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400' />
                                <Input {...register('location')} error={errors.location?.message} id='location' type='text' placeholder='e.g. New York, USA' className={`w-full py-3 pl-10 pr-4 text-sm bg-neutral-50 focus:bg-white ${!errors.location && 'focus:border-primary-800'} placeholder:text-neutral-400 focus:placeholder:text-neutral-500`} />
                            </div>
                        </div>

                        {/* Website */}
                        <div className='flex flex-col gap-1.5 text-sm font-semibold tracking-normal text-neutral-500'>
                            <label htmlFor='website'>Website</label>
                            <div className='relative w-full'>
                                <Link2 size={16} className='pointer-events-none z-10 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400' />
                                <Input {...register('website')} error={errors.website?.message} id='website' type='url' placeholder='https://example.com' className={`w-full py-3 pl-10 pr-4 text-sm bg-neutral-50 focus:bg-white ${!errors.website && 'focus:border-primary-800'} placeholder:text-neutral-400 focus:placeholder:text-neutral-500`} />
                            </div>
                        </div>

                    </div>

                    {/* Bottom readonly data showcase */}
                    <div className='mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-neutral-100 pt-4 text-xs text-neutral-500'>
                        <span className='flex items-center gap-1'><Calendar size={13} /> Joined {joinedDate}</span>
                        <span><strong className='text-neutral-900'>{profile?.user.followingCount ?? 0}</strong> Following</span>
                        <span><strong className='text-neutral-900'>{profile?.user.followersCount ?? 0}</strong> Followers</span>
                    </div>

                </form>

            </div>
        </section>
    );
};

export default ProfileEditForm;