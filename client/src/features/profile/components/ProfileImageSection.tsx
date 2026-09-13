import React, { useRef, useState } from 'react';
import { Check, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import CoverImageProgressBar from './CoverImageProgressBar';
import AvatarProgressBar from './AvatarProgressBar';
import { uploadToCloudinary } from '@/lib/cloudinary';
import type { AuthUser } from '@/features/auth'
import { useUpdateAvatar } from '../hooks/useUpdateAvatar';
import { useUpdateCoverImage } from '../hooks/useUpdateCoverImage';
import { MAX_AVATAR_IMAGE_SIZE, MAX_COVER_IMAGE_SIZE } from '../constants';
import { validateImageFile } from '@/utils';
import { CLOUDINARY_FOLDERS } from '@/lib';
import ProfileIconButton from './ProfileIconButton';
import { useDeleteAvatar } from '../hooks/useDeleteAvatar';
import { useDeleteCoverImage } from '../hooks/useDeleteCoverImage';
import Spinner from '@/components/common/Spinner';
import { ImageWithSkeleton } from '@/components/media';


interface CoverImageProps {
    isOwnProfile: boolean;
    viewedProfile: AuthUser | undefined;
    isLoading: boolean;
};


const ProfileImageSection = ({ isOwnProfile, viewedProfile, isLoading }: CoverImageProps) => {

    const [avatarImageFile, setAvatarImageFile] = useState<File | null>(null);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [avatarImagePreview, setAvatarImagePreview] = useState<string>('');
    const [coverImagePreview, setCoverImagePreview] = useState<string>('');
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [uploadingImage, setUploadingImage] = useState<'avatar' | 'cover' | null>(null);

    const avatarImageInputRef = useRef<HTMLInputElement | null>(null);
    const coverImageInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageFileSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const imageFile = e.target.files?.[0];

        if (!imageFile) {
            return;
        };

        const isAvatarImage = e.target.name === 'avatarImage';

        const fileSize = isAvatarImage ? MAX_AVATAR_IMAGE_SIZE : MAX_COVER_IMAGE_SIZE;
        const validationError = validateImageFile(imageFile, fileSize);
        if (validationError) {
            toast.error(validationError);
            return;
        };

        const ImagePreviewUrl = URL.createObjectURL(imageFile);

        if (isAvatarImage) {

            setAvatarImageFile(imageFile);
            setAvatarImagePreview(ImagePreviewUrl);
            return;
        };

        setCoverImageFile(imageFile);
        setCoverImagePreview(ImagePreviewUrl);
    };

    const clearImageData = (imageType: 'avatar' | 'cover') => {

        if (imageType === 'avatar') {

            if (avatarImagePreview) {
                URL.revokeObjectURL(avatarImagePreview);
            };

            setAvatarImageFile(null);
            setAvatarImagePreview('');

            if (avatarImageInputRef.current) {
                avatarImageInputRef.current.value = '';
            };

            return;
        };

        if (coverImagePreview) {
            URL.revokeObjectURL(coverImagePreview);
        };

        setCoverImageFile(null);
        setCoverImagePreview('');

        if (coverImageInputRef.current) {
            coverImageInputRef.current.value = '';
        };
    };

    const handleImageCancel = (imageType: 'avatar' | 'cover') => {
        clearImageData(imageType);
    };

    const { mutateAsync: updateAvatarMutateAsync } = useUpdateAvatar(viewedProfile?.user.username ?? '');
    const { mutateAsync: updateCoverImageMutateAsync } = useUpdateCoverImage(viewedProfile?.user.username ?? '');
    const handleSaveImageFile = async (imageType: 'avatar' | 'cover') => {

        const imageFile = imageType === 'avatar' ?
            avatarImageFile
            :
            coverImageFile;

        if (!imageFile) {
            return;
        };

        try {

            setUploadingImage(imageType);
            setUploadProgress(0);

            const { url, publicId } = await uploadToCloudinary(imageFile, {
                folder: imageType === 'avatar' ?
                    CLOUDINARY_FOLDERS.avatar
                    :
                    CLOUDINARY_FOLDERS.cover,
                onProgress: setUploadProgress,
            });

            if (imageType === 'avatar') {

                await updateAvatarMutateAsync({ url, publicId }, {
                    onSuccess: () => {
                        clearImageData(imageType);
                    }
                });
            }
            else {

                await updateCoverImageMutateAsync({ url, publicId }, {
                    onSuccess: () => {
                        clearImageData(imageType);
                    }
                });
            };
        } catch (error) {

            if (imageType === 'avatar') {

                toast.error('Failed to upload avatar');
            }
            else {
                toast.error('Failed to upload cover image');
            };
        } finally {
            setUploadProgress(null);
            setUploadingImage(null);
        };
    };

    const { mutate: deleteAvatarMutate, isPending: isDeleteAvatarPending } = useDeleteAvatar(viewedProfile?.user.username ?? '');
    const { mutate: deleteCoverImageMutate, isPending: isDeleteCoverImagePending } = useDeleteCoverImage(viewedProfile?.user.username ?? '');
    const isImageDeleting = isDeleteAvatarPending || isDeleteCoverImagePending;
    const handleDeleteImageFile = (imageType: 'avatar' | 'cover') => {

        if (imageType === 'avatar') {

            deleteAvatarMutate();
            return;
        }

        deleteCoverImageMutate();
    };

    const fileUploadProgress = uploadProgress === null ?
        0
        :
        Math.min(Math.max(uploadProgress, 0), 100);

    return (
        <section className='relative w-full h-48 sm:h-56 md:h-64 lg:h-72'>

            <ImageWithSkeleton
                src={coverImagePreview || viewedProfile?.profile.coverImage}
                alt=""
                containerClassName="w-full h-full inset-0 rounded-none!"
                className="w-full h-full object-cover"
            />

            {/* Cover image upload progress bar */}
            {uploadingImage === 'cover' && uploadProgress !== null && (
                <CoverImageProgressBar coverImageUploadProgress={fileUploadProgress} />
            )}

            {/* Invisible input for cover image file select */}
            <input onChange={handleImageFileSelectChange} ref={coverImageInputRef} type='file' id='CoverImagefileInput' name='coverImage' className='hidden' />

            {/* Cover image edit/delete and check/cancel button */}
            {isOwnProfile && uploadingImage === null && !isLoading && (
                <div className='absolute right-3 top-3 flex gap-2'>

                    {
                        coverImageFile ? (
                            <>
                                <ProfileIconButton
                                    aria-label='Save cover image'
                                    onClick={() => handleSaveImageFile('cover')}
                                >
                                    <Check size={16} />
                                </ProfileIconButton>

                                <ProfileIconButton
                                    aria-label='Cancel cover image change'
                                    onClick={() => handleImageCancel('cover')}
                                >
                                    <X size={16} />
                                </ProfileIconButton>
                            </>
                        ) : (
                            <>
                                <ProfileIconButton
                                    aria-label='Edit cover image'
                                    disabled={isImageDeleting}
                                    onClick={() => coverImageInputRef.current && coverImageInputRef.current.click()}
                                >
                                    <Pencil size={15} />
                                </ProfileIconButton>

                                <ProfileIconButton
                                    aria-label='Delete cover image'
                                    disabled={isImageDeleting}
                                    onClick={() => handleDeleteImageFile('cover')}
                                >
                                    {isDeleteCoverImagePending ? <Spinner size='sm' /> : <Trash2 size={15} />}
                                </ProfileIconButton>
                            </>
                        )
                    }

                </div>
            )}

            {/* Avatar container */}
            <div className='absolute bottom-0 left-3 z-10 w-[clamp(5rem,18cqw,7rem)] h-[clamp(5rem,18cqw,7rem)] translate-y-1/2 sm:left-4 bg-white rounded-full'>

                <ImageWithSkeleton
                    src={avatarImagePreview || viewedProfile?.profile.avatar}
                    alt={viewedProfile?.user.displayName ?? 'User avatar'}
                    containerClassName="w-full h-full object-cover rounded-full border-3 border-white rounded-full!"
                    className="w-full h-full object-cover"
                />

                {/* avatar progress bar */}
                {uploadingImage === 'avatar' && uploadProgress !== null && (
                    <AvatarProgressBar avatarUploadProgress={fileUploadProgress} />
                )}

                {/* Invisible input for avatar image file select */}
                <input onChange={handleImageFileSelectChange} ref={avatarImageInputRef} type='file' id='avatarFileInput' name='avatarImage' className='hidden' />

                {/* Avatar edit/delete and check/cancel button */}
                {isOwnProfile && uploadProgress === null && !isLoading && (
                    <div className='absolute bottom-1 -right-13 min-[560px]:-right-12 flex flex-row gap-2'>

                        {
                            avatarImageFile ? (
                                <>
                                    <ProfileIconButton
                                        aria-label='Save avatar image'
                                        onClick={() => handleSaveImageFile('avatar')}
                                    >
                                        <Check size={15} />
                                    </ProfileIconButton>

                                    <ProfileIconButton
                                        aria-label='Cancel avatar image change'
                                        onClick={() => handleImageCancel('avatar')}
                                    >
                                        <X size={15} />
                                    </ProfileIconButton>
                                </>
                            ) : (
                                <>
                                    <ProfileIconButton
                                        aria-label='Edit profile avatar'
                                        disabled={isImageDeleting}
                                        onClick={() => avatarImageInputRef.current && avatarImageInputRef.current.click()}
                                    >
                                        <Pencil size={15} />
                                    </ProfileIconButton>

                                    <ProfileIconButton
                                        aria-label='Delete profile avatar'
                                        disabled={isImageDeleting}
                                        onClick={() => handleDeleteImageFile('avatar')}
                                    >
                                        {isDeleteAvatarPending ? <Spinner size='sm' /> : <Trash2 size={15} />}
                                    </ProfileIconButton>
                                </>
                            )
                        }

                    </div>
                )}

            </div>
        </section>
    )
};

export default ProfileImageSection;