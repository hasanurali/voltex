import { ChevronLeft, ChevronRight, Image, PlusCircle, SendHorizontal, Smile, Video, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { MAX_MESSAGE_IMAGE_SIZE, MAX_MESSAGE_IMAGES_LENGTH, MAX_MESSAGE_VIDEO_SIZE } from '../constants';
import { fieldApiError, validateImageFile } from '@/utils';
import { useForm } from 'react-hook-form';
import { createMessageSchema, type CreateMessageFormValues } from '../schemas/messageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateMessage } from '../hooks/useCreateMessage';
import { uploadToCloudinary } from '@/lib';
import type { CreateMessagePayload, PayloadMedia, TemporaryMessage } from '../type';
import { useQueryClient } from '@tanstack/react-query';
import { messageKeys } from '../api/messageKeys';
import { conversationKeys } from '@/features/conversation';
import { createPortal } from 'react-dom';
import type { EmojiClickData } from 'emoji-picker-react';
import EmojiPicker from 'emoji-picker-react';


type CreateMessageInputProps = {
    createId: string;
    createIdType: 'conversation' | 'participant';
    setMessage: (key: string, val: TemporaryMessage) => void,
    setProgress: (key: string, cb: (progress: number[]) => number[]) => void,
    className?: string;
};

interface MessageMediaFile {
    file: File;
    previewUrl: string;
    mediaType: 'image' | 'video';
};

const maxHeight = 160;

const CreateMessageInput = ({ createId, createIdType, setMessage, setProgress, className = '' }: CreateMessageInputProps) => {

    const [messageMediaFiles, setMessageMediaFiles] = useState<MessageMediaFile[]>([]);
    const [currentMediaIndex, setCurrentMediaIndex] = useState<number | null>(null);
    const [mediaContainerWidth, setMediaContainerWidth] = useState(0);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [emojiPickerPosition, setEmojiPickerPosition] = useState<{ top: number; left: number; width: number } | null>(null);

    const mediaInputRef = useRef<HTMLInputElement>(null);
    const messageMediaPreviewUrlsRef = useRef(new Set<string>());
    const mediaContainerRef = useRef<HTMLDivElement>(null);
    const emojiButtonRef = useRef<HTMLButtonElement>(null);
    const messageInputRef = useRef<HTMLTextAreaElement>(null);

    const { register, handleSubmit, reset, setError, setValue, getValues, formState: { errors } } = useForm<CreateMessageFormValues>({
        resolver: zodResolver(createMessageSchema)
    });

    const contentField = register('content');

    const resizeMessageInput = () => {
        const textArea = messageInputRef.current;
        if (!textArea) {
            return;
        };

        textArea.style.height = 'auto';
        const contentHeight = textArea.scrollHeight;

        textArea.style.height = `${Math.min(maxHeight, contentHeight)}px`;
        textArea.style.overflowY = contentHeight > maxHeight ? 'auto' : 'hidden';
    };

    const createPreviewUrl = (file: File) => {

        const previewUrl = URL.createObjectURL(file);

        messageMediaPreviewUrlsRef.current.add(previewUrl);

        return previewUrl;
    };

    const handleMedia = () => {

        const input = mediaInputRef.current;
        if (!input || !input.files) {
            return;
        };

        const files = Array.from(input?.files ?? []);

        if (!files.length) {
            return;
        };

        const mediaType = files.every(file => file.type.includes('image')) ? 'image' : 'video';

        if (mediaType === 'video') {

            const video = files[0];

            if (messageMediaFiles.length) {
                toast.error('A video cannot be combined with images. Remove the current media first');
            }
            else if (video.size > MAX_MESSAGE_VIDEO_SIZE) {
                toast.error(`Videos must be ${MAX_MESSAGE_VIDEO_SIZE / 1024 / 1024} MB or smaller`);
            }
            else {
                setMessageMediaFiles([{ file: video, previewUrl: createPreviewUrl(video), mediaType }]);
            };

            input.value = '';

            return;
        };

        if (messageMediaFiles.some(media => media.mediaType === 'video')) {
            toast.error('Remove the selected video before adding images');
            input.value = '';
            return;
        };

        const availableSlots = MAX_MESSAGE_IMAGES_LENGTH - messageMediaFiles.length;
        const acceptedFiles = files.slice(0, availableSlots);

        if (files.length > availableSlots) {
            toast.error(`You can add up to ${MAX_MESSAGE_IMAGES_LENGTH} images to a message`);
        };

        let hasShownError = false;
        acceptedFiles.forEach(file => {
            const errorMsg = validateImageFile(file, MAX_MESSAGE_IMAGE_SIZE)
            if (errorMsg) {
                if (!hasShownError) {
                    toast.error(errorMsg);
                };

                return false;
            };

            return true;
        });

        if (acceptedFiles.length) {

            setMessageMediaFiles([
                ...messageMediaFiles,
                ...acceptedFiles.map(file => ({ file, previewUrl: createPreviewUrl(file), mediaType } as MessageMediaFile))
            ]);
        };

        input.value = '';
    };

    const revokePreviewUrl = (previewUrl: string) => {

        if (!messageMediaPreviewUrlsRef.current.has(previewUrl)) {
            return;
        };

        URL.revokeObjectURL(previewUrl);
        messageMediaPreviewUrlsRef.current.delete(previewUrl);
    };

    const removeMedia = (idx: number) => {
        setMessageMediaFiles(currentMessageMedia => {

            const removedMedia = currentMessageMedia[idx];

            if (removedMedia) {
                revokePreviewUrl(removedMedia.previewUrl);
            };

            return currentMessageMedia.filter((_, i) => i !== idx);
        });
    };

    const clearAllMedia = () => {
        messageMediaFiles.forEach(({ previewUrl }) => revokePreviewUrl(previewUrl));
        setMessageMediaFiles([]);
        if (mediaInputRef.current) {
            mediaInputRef.current.value = '';
        };
    };

    const addEmoji = (emojiData: EmojiClickData) => {
        setValue('content', getValues('content') + emojiData.emoji);
        resizeMessageInput();
        setIsEmojiPickerOpen(false);
    };

    const { mutateAsync: createMessageMutateAsync, isPending: isCreateMessagePending } = useCreateMessage();
    const queryClient = useQueryClient();

    const onSubmit = async ({ content }: CreateMessageFormValues) => {

        if (!content && !messageMediaFiles.length) {
            return;
        };

        const key = `${crypto.randomUUID()}`;

        setMessage(key, {
            _id: key,
            media: messageMediaFiles.map(({ previewUrl, mediaType }) => ({
                url: previewUrl,
                mediaType
            })),
            content: content ?? '',
            createdAt: new Date().toISOString(),
            progress: new Array(messageMediaFiles.length).fill(0),
            isTemporary: true
        });

        const teporaryMediaFiles = [...messageMediaFiles];
        reset();
        resizeMessageInput();
        setMessageMediaFiles([]);

        try {

            const medias: PayloadMedia[] = await Promise.all(

                teporaryMediaFiles.map(async ({ file, mediaType }, i) => {

                    const upload = await uploadToCloudinary(file, {
                        resourceType: mediaType,
                        onProgress: (percent) => {

                            setProgress(key, (currentProgress) =>
                                currentProgress.map((value, fileIndex) => fileIndex === i ? percent : value)
                            );
                        }
                    });

                    setProgress(key, (currentProgress) =>
                        currentProgress.map((value, fileIndex) => fileIndex === i ? 100 : value)
                    );

                    return {
                        mediaType,
                        ...upload
                    };
                }));

            let createMessagePayload: CreateMessagePayload;

            if (createIdType === 'conversation') {
                createMessagePayload = {
                    conversation: createId,
                    content,
                    media: medias
                };
            } else {
                createMessagePayload = {
                    participant: createId,
                    content,
                    media: medias
                };
            };

            await createMessageMutateAsync(createMessagePayload, {
                onSuccess: (data) => {

                    queryClient.setQueryData(messageKeys.conversationMessages(data.conversation), () => {

                        queryClient.invalidateQueries({ queryKey: conversationKeys.conversations() });

                        if (!data.media.length) {
                            setMessage(key, data);
                            return;
                        };

                        if (data.media[0].mediaType === 'video') {

                            const video: HTMLVideoElement = document.createElement('video');
                            video.src = data.media[0].url;
                            video.preload = 'auto';

                            video.onloadeddata = () => {
                                setMessage(key, data);
                            };

                            video.onerror = () => {
                                setMessage(key, data);
                            };
                        }
                        else {

                            const img: HTMLImageElement = document.createElement('img');
                            img.src = data.media[0].url;

                            img.onload = () => {
                                setMessage(key, data);
                            };

                            img.onerror = () => {
                                setMessage(key, data);
                            };
                        };
                    });
                }
            });
        } catch (error) {
            fieldApiError(error, setError);
            toast.error('Could not send your message. Please try again');
        }
    };

    useEffect(() => {

        const errMessage = errors.content?.message || errors.media?.message;

        if (errMessage) {
            toast.error(errMessage);
        };
    }, [errors.content, errors.media]);

    useEffect(() => {

        const mediaContainer = mediaContainerRef.current;
        if (!mediaContainer) {
            return;
        };

        const observer = new ResizeObserver(([entry]) => {
            if (entry) {
                requestAnimationFrame(() => {
                    setMediaContainerWidth(entry.contentRect.width);
                });
            };
        });

        observer.observe(mediaContainer);

        return () => {
            if (mediaContainer) {
                observer.unobserve(mediaContainer);
            };
        };
    }, [messageMediaFiles.length]);

    useEffect(() => {
        return () => {
            [...messageMediaPreviewUrlsRef.current].forEach(url => URL.revokeObjectURL(url));
            if (mediaInputRef.current) {
                mediaInputRef.current.value = '';
            };
        };
    }, []);

    useEffect(() => {

        const removeEmojiPicker = () => {
            if (isEmojiPickerOpen) {
                setIsEmojiPickerOpen(false);
            };
        };

        window.addEventListener('click', removeEmojiPicker);

        return () => {
            window.removeEventListener('click', removeEmojiPicker);
        };
    }, [isEmojiPickerOpen]);

    useEffect(() => {

        if (!isEmojiPickerOpen) {
            setEmojiPickerPosition(null);
            return;
        };

        const updateEmojiPickerPosition = () => {

            const button = emojiButtonRef.current;
            if (!button) {
                return;
            };

            const rect = button.getBoundingClientRect();
            const width = Math.min(350, Math.max(0, window.innerWidth - 24));
            const height = 340;
            const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12));
            const belowTop = rect.bottom + 8;
            const top = belowTop + height <= window.innerHeight - 12 ?
                belowTop
                :
                Math.max(12, rect.top - height - 8);

            setEmojiPickerPosition({ top, left, width });
        };

        updateEmojiPickerPosition();
        window.addEventListener('resize', updateEmojiPickerPosition);
        window.addEventListener('scroll', updateEmojiPickerPosition, true);

        return () => {
            window.removeEventListener('resize', updateEmojiPickerPosition);
            window.removeEventListener('scroll', updateEmojiPickerPosition, true);
        };
    }, [isEmojiPickerOpen]);

    const messageMedia = messageMediaFiles[0]?.mediaType === 'image' ? messageMediaFiles : [];
    const currentViewerMedia = currentMediaIndex !== null ? messageMedia[currentMediaIndex] : null;

    const visibleImageCount = mediaContainerWidth === 0 || mediaContainerWidth > 540 ?
        MAX_MESSAGE_IMAGES_LENGTH
        :
        mediaContainerWidth > 430 ?
            MAX_MESSAGE_IMAGES_LENGTH - 1
            :
            mediaContainerWidth > 320 ?
                MAX_MESSAGE_IMAGES_LENGTH - 2
                :
                MAX_MESSAGE_IMAGES_LENGTH - 3;
    const hiddenImageCount = Math.max(0, messageMediaFiles.length - visibleImageCount);
    const visibleMediaFiles = messageMediaFiles[0]?.mediaType === 'image' ?
        messageMediaFiles.slice(0, visibleImageCount)
        :
        messageMediaFiles;

    return (
        <div className={`mx-auto w-full min-w-0 max-w-3xl rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm transition duration-200 focus-within:border-secondary-400 focus-within:ring-2 focus-within:ring-secondary-100/70 ${className}`}>

            {/* Media display container */}
            {
                messageMediaFiles.length > 0 && (
                    <div className='w-full h-35 pt-1 flex flex-col gap-2'>
                        <p className='flex justify-between text-sm font-medium text-secondary-400'>
                            <span className='flex items-center gap-1'>
                                {
                                    messageMediaFiles[0].mediaType === 'video' ?
                                        <Video size={20} className='pr-1' />
                                        :
                                        <Image size={20} className='pr-1' />
                                }
                                {`${messageMediaFiles.length} ${messageMediaFiles[0].mediaType} attached`}
                            </span>
                            <button
                                onClick={clearAllMedia}
                                type='button'
                                className='flex items-center gap-1 cursor-pointer'
                            >
                                <X size={20} />
                                Remove
                            </button>
                        </p>

                        <div ref={mediaContainerRef} className='flex w-full min-w-0 gap-3 overflow-hidden'>
                            {
                                visibleMediaFiles.map(({ previewUrl, mediaType }, i) => (
                                    <div onClick={() => setCurrentMediaIndex(i)} key={`${previewUrl}-${i}`} className='relative overflow-hidden cursor-zoom-in'>
                                        {
                                            mediaType === 'image' ?
                                                <img src={previewUrl} className='w-25 h-25 object-cover rounded-sm' />
                                                :
                                                <video src={previewUrl} controls className='w-50 h-25 object-cover rounded-sm' />
                                        }
                                        {
                                            mediaType === 'image' && hiddenImageCount > 0 && i === visibleImageCount - 1 && (
                                                <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm font-semibold text-white">
                                                    +{hiddenImageCount}
                                                </div>
                                            )
                                        }
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeMedia(i);
                                            }}
                                            type="button"
                                            className="absolute right-1 top-1 z-20 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/95 text-gray-800 shadow-md ring-1 ring-black/10 transition hover:bg-red-600 hover:text-white"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )
            }

            {/* Message input form */}
            <form onSubmit={handleSubmit(onSubmit)} className={`flex w-full min-w-0 items-end gap-1.5 ${messageMediaFiles.length ? 'border-t' : ''} border-neutral-200 sm:gap-2.5 sm:p-2.5`}>
                <input
                    ref={mediaInputRef}
                    onChange={handleMedia}
                    type="file"
                    multiple
                    className="hidden"
                />
                <button
                    onClick={() => mediaInputRef.current?.click()}
                    type="button"
                    aria-label="Add attachment"
                    className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-secondary-500 transition-colors hover:bg-neutral-100 hover:text-secondary-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <PlusCircle size={20} strokeWidth={1.8} />
                </button>
                <textarea
                    {...contentField}
                    ref={(element) => {
                        contentField.ref(element);
                        messageInputRef.current = element;
                    }}
                    onChange={(e) => {
                        void contentField.onChange(e);
                        resizeMessageInput();
                    }}
                    rows={1}
                    placeholder="Message"
                    className="max-h-38 min-h-10 min-w-0 flex-1 resize-none overflow-y-hidden bg-transparent px-1 py-2 text-base leading-5 text-secondary-900 outline-none placeholder:leading-6 placeholder:text-neutral-400 disabled:opacity-60 sm:text-sm"
                />
                <div>
                    <button
                        ref={emojiButtonRef}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEmojiPickerOpen((isOpen) => !isOpen)
                        }}
                        disabled={isCreateMessagePending}
                        type="button"
                        aria-label="Add emoji"
                        title="Add emoji"
                        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-secondary-500 transition-colors hover:bg-neutral-100 hover:text-secondary-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Smile size={20} strokeWidth={1.8} />
                    </button>
                    {
                        isEmojiPickerOpen && emojiPickerPosition && createPortal(
                            <div
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    position: 'fixed',
                                    top: emojiPickerPosition.top,
                                    left: emojiPickerPosition.left,
                                    width: emojiPickerPosition.width,
                                    zIndex: 1000,
                                }}
                                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.18)] ring-1 ring-black/5"
                            >
                                <EmojiPicker
                                    onEmojiClick={addEmoji}
                                    width={emojiPickerPosition.width}
                                    height={340}
                                    searchPlaceHolder="Search emoji"
                                    previewConfig={{ showPreview: false }}
                                />
                            </div>,
                            document.body
                        )
                    }
                </div>
                <button
                    type="submit"
                    aria-label="Send message"
                    className="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary-950 px-3 text-sm font-semibold text-white transition-colors hover:bg-secondary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-500 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
                >
                    <span className="hidden min-[360px]:inline">Send</span>
                    <SendHorizontal size={17} strokeWidth={2} />
                </button>
            </form>

            {/* Full-screen image section */}
            {
                (messageMedia.length >= 1 && currentMediaIndex !== null) && createPortal(<>
                    {
                        currentMediaIndex !== null && messageMedia[currentMediaIndex] && (
                            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4" role="dialog" aria-label="Post media viewer" onClick={() => setCurrentMediaIndex(null)}>
                                <button type="button" onClick={() => setCurrentMediaIndex(null)} className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white cursor-pointer">
                                    <X className="h-5 w-5" />
                                </button>

                                {
                                    currentViewerMedia?.mediaType === "image" && messageMedia.length > 1 && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const previousPosition = (currentMediaIndex - 1 + messageMedia.length) % messageMedia.length;
                                                setCurrentMediaIndex(previousPosition);
                                            }}
                                            type="button"
                                            aria-label="Previous image"
                                            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6 sm:h-12 sm:w-12"
                                        >
                                            <ChevronLeft className="h-6 w-6" />
                                        </button>
                                    )
                                }

                                <div className="flex h-[min(72vh,760px)] w-[min(92vw,1100px)] items-center justify-center" onClick={(event) => event.stopPropagation()}>
                                    {
                                        currentViewerMedia && <img src={currentViewerMedia.previewUrl} alt={`Post image ${currentMediaIndex + 1}`} className="max-h-full max-w-full object-contain" />
                                    }
                                </div>

                                {
                                    currentViewerMedia?.mediaType === "image" && messageMedia.length > 1 && (
                                        <button type="button" onClick={(e) => {
                                            e.stopPropagation();
                                            const nextPosition = (currentMediaIndex + 1) % messageMedia.length;
                                            setCurrentMediaIndex(nextPosition);
                                        }}
                                            aria-label="Next image"
                                            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6 sm:h-12 sm:w-12">
                                            <ChevronRight className="h-6 w-6" />
                                        </button>
                                    )
                                }

                                {
                                    currentViewerMedia?.mediaType === "image" && (
                                        <>
                                            {
                                                messageMedia.length > 1 && (
                                                    <div className="mt-4 flex max-w-full items-center gap-2 overflow-x-auto px-2" onClick={(event) => event.stopPropagation()}>
                                                        {
                                                            messageMedia.map(({ previewUrl }, i) => (
                                                                <button
                                                                    key={`${previewUrl}-${i}`}
                                                                    onClick={() => setCurrentMediaIndex(i)}
                                                                    className={`relative h-12 w-12 shrink-0 overflow-hidden rounded border-2 bg-neutral-800 sm:h-14 sm:w-14 ${currentMediaIndex === i ? "border-white" : "border-transparent opacity-60 hover:opacity-100"}`}
                                                                >
                                                                    <img src={previewUrl} alt="" className="h-full w-full object-cover" />
                                                                </button>
                                                            ))
                                                        }
                                                    </div>
                                                )
                                            }
                                            <p className="mt-2 text-xs text-white/70">{currentMediaIndex + 1} / {messageMedia.length}</p>
                                        </>
                                    )
                                }
                            </div>
                        )
                    }
                </>,
                    document.body
                )
            }
        </div>
    );
};

export default CreateMessageInput;