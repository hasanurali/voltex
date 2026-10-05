import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';
import { CircleAlert, Globe2, Image as ImageIcon, LoaderCircle, Smile, Trash2, UsersRound, Video, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore, usePostStore } from '@/store';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { EditorContent, useEditor } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet, type EditorView } from '@tiptap/pm/view';
import starterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extensions';
import { createPostSchema, type CreatePostFormValues } from '../schema/postSchema';
import type { CreatePostPayload, MediaPayloadItem } from '../types';
import { useCreatePost } from '../hooks/useCreatePost';
import { useUpdatePost } from '../hooks/useUpdatePost';
import { MAX_IMAGES, MAX_VIDEO_SIZE } from '../constants';
import { fieldApiError, filterDirtyInputs } from '@/utils';
import { usePostDetails } from '../hooks/usePostDetails';
import { ImageWithSkeleton } from '@/components/media';


interface SelectedMedia {
    file?: File;
    previewUrl: string;
    mediaType: 'image' | 'video';
};


const HashtagHighlight = Extension.create({
    name: 'hashtagHighlight',
    addProseMirrorPlugins() {
        return [new Plugin({
            key: new PluginKey('hashtagHighlight'),
            props: {
                decorations: (state) => {
                    const decorations: Decoration[] = [];
                    const hashtagPattern = /(^|[^\p{L}\p{N}_])#([\p{L}\p{N}_]*)/gu;

                    state.doc.descendants((node, position) => {
                        if (!node.isText || !node.text) {
                            return;
                        };

                        for (const match of node.text.matchAll(hashtagPattern)) {
                            const start = position + (match.index ?? 0) + match[1].length;
                            const end = start + match[0].length - match[1].length;
                            decorations.push(Decoration.inline(start, end, { class: 'text-sky-600 font-semibold' }));
                        };
                    });

                    return DecorationSet.create(state.doc, decorations);
                },
            },
        })];
    },
});

const preventEditorDragDrop = (_view: EditorView, e: DragEvent) => {

    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'none';
    };

    return true;
};


interface PostCreateSectionProps {
    isModelOpen?: boolean;
    setIsModelOpen?: (isModelOpen: boolean) => void;
    updatePostId?: string | null;
    className?: string
};


const PostCreateSection = ({ isModelOpen = false, setIsModelOpen, updatePostId = null, className = '' }: PostCreateSectionProps) => {

    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [emojiPickerPosition, setEmojiPickerPosition] = useState<{ top: number; left: number; width: number } | null>(null);
    const [selectedMedia, setSelectedMedia] = useState<SelectedMedia[]>([]);
    const [canRemoveAllMedia, setCanRemoveAllMedia] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgressByFile, setUploadProgressByFile] = useState<number[]>([]);

    const auth = useAuthStore((state) => state.auth);
    const resetPostUpdateData = usePostStore((state) => state.resetPostUpdateData);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const emojiButtonRef = useRef<HTMLButtonElement>(null);
    const previewUrlsRef = useRef(new Set<string>());

    const { mutateAsync: createPost, isPending: isCreatePending } = useCreatePost();
    const { mutateAsync: updatePost, isPending: isUpdatePending } = useUpdatePost();

    const { handleSubmit, setValue, reset, watch, setError, setValues, formState: { errors } } = useForm<CreatePostFormValues>({
        resolver: zodResolver(createPostSchema),
        defaultValues: {
            content: '',
            media: [],
            visibility: 'public'
        }
    });

    const contentLength = watch('content')?.length ?? 0;
    const visibility = watch('visibility') ?? 'public';
    const hasExistingMedia = Boolean(updatePostId && selectedMedia.some((media) => !media.file));

    const { data: updatePostData, isPending: isPostDetailsPending } = usePostDetails(updatePostId ?? "");
    const isFetchingDetails = Boolean(updatePostId && isPostDetailsPending);

    const editor = useEditor({
        extensions: [
            starterKit,
            HashtagHighlight,
            Placeholder.configure({ placeholder: 'What’s happening?', emptyNodeClass: 'post-composer-empty' }),
            Image.configure({ inline: false })
        ],
        editorProps: {
            handleDOMEvents: {
                dragover: preventEditorDragDrop,
                drop: preventEditorDragDrop,
            },
            handleDrop: (view, event) => {
                preventEditorDragDrop(view, event);
            },
            attributes: {
                class: `post-composer-editor ${isModelOpen ? 'min-h-24 sm:min-h-28' : 'min-h-11'} max-h-[50vh] w-full min-w-0 overflow-y-auto border-0 outline-none focus:border-0 focus:outline-none focus:ring-0 [&_img]:my-2 [&_img]:max-h-48 [&_img]:max-w-full [&_img]:rounded-lg`,
                style: 'max-height: 50vh; overflow-y: auto;',
            },
        },
        onUpdate: ({ editor: updatedEditor }) => {
            setValue('content', updatedEditor.getText(), {
                shouldDirty: true,
                shouldValidate: true
            });
        }
    });

    useEffect(() => {
        () => {
            previewUrlsRef.current.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
        };
    }, []);

    const createPreviewUrl = (file: File) => {
        const previewUrl = URL.createObjectURL(file);
        previewUrlsRef.current.add(previewUrl);
        return previewUrl;
    };

    const revokePreviewUrl = (previewUrl: string) => {
        if (!previewUrlsRef.current.has(previewUrl)) {
            return;
        };

        URL.revokeObjectURL(previewUrl);
        previewUrlsRef.current.delete(previewUrl);
    };

    const addEmoji = (emojiData: EmojiClickData) => {
        editor?.chain().focus().insertContent(emojiData.emoji).run();
        setIsEmojiPickerOpen(false);
    };

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

    const preventDragDrop = (e: React.DragEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'none';
        };
    };

    const addFiles = (e: React.ChangeEvent<HTMLInputElement>, mediaType: 'image' | 'video') => {

        const files = Array.from(e.target.files ?? []);
        e.target.value = '';

        if (!files.length) {
            return;
        };

        if (hasExistingMedia) {
            toast.error('Remove all current media before adding replacements');
            return;
        };

        if (mediaType === 'video') {

            const video = files[0];

            if (selectedMedia.length) {
                toast.error('A video cannot be combined with images. Remove the current media first');
            }
            else if (video.size > MAX_VIDEO_SIZE) {
                toast.error('Videos must be 100 MB or smaller');
            }
            else {
                setSelectedMedia([{ file: video, previewUrl: createPreviewUrl(video), mediaType }]);
            };

            return;
        };

        if (selectedMedia.some((media) => media.mediaType === 'video')) {
            toast.error('Remove the selected video before adding images');
            return;
        };

        const availableSlots = MAX_IMAGES - selectedMedia.length;
        const acceptedFiles = files.slice(0, availableSlots);

        if (files.length > availableSlots) {
            toast.error(`You can add up to ${MAX_IMAGES} images to a post.`);
        };

        if (acceptedFiles.length) {

            setSelectedMedia(currentMedia => [
                ...currentMedia,
                ...acceptedFiles.map(file => ({ file, previewUrl: createPreviewUrl(file), mediaType })),
            ]);
        };
    };

    const removeMedia = (index: number) => {

        setSelectedMedia(currentMedia => {

            const removedMedia = currentMedia[index];

            if (removedMedia) {
                revokePreviewUrl(removedMedia.previewUrl);
            };

            return currentMedia.filter((_, mediaIndex) => mediaIndex !== index);
        });
    };

    const removeAllMedia = () => {
        selectedMedia.forEach(({ previewUrl }) => revokePreviewUrl(previewUrl));
        setSelectedMedia([]);
        setValue('media', [], { shouldDirty: true, shouldValidate: true });
        setCanRemoveAllMedia(false);
    };

    const onSubmit = async (values: CreatePostFormValues) => {

        const originalContent = values.content?.trim() ?? '';
        const hashtags = [...new Set(
            Array.from(originalContent.matchAll(/(?:^|[^\p{L}\p{N}_])#([\p{L}\p{N}_]+)/gu), ([, hashtag]) => hashtag.toLowerCase())
        )];

        const content = originalContent
            .replace(/(^|[^\p{L}\p{N}_])#[\p{L}\p{N}_]+/gu, '$1')
            .replace(/[ \t]{2,}/g, ' ')
            .replace(/ *\n */g, '\n')
            .trim();

        if (!content && selectedMedia.length === 0) {
            toast.error('Write something or add media before posting');
            return;
        };

        setIsUploading(true);
        const mediaToUpload = selectedMedia.filter((item): item is SelectedMedia & { file: File } => Boolean(item.file));
        setUploadProgressByFile(mediaToUpload.map(() => 0));

        try {
            const medias: MediaPayloadItem[] = await Promise.all(

                mediaToUpload.map(async ({ file, mediaType }, i) => {

                    const upload = await uploadToCloudinary(file, {
                        resourceType: mediaType,
                        onProgress: (percent) => {
                            setUploadProgressByFile(progress => progress.map((value, fileIndex) => fileIndex === i ? percent : value));
                        }
                    });

                    setUploadProgressByFile(progress => progress.map((value, fileIndex) => fileIndex === i ? 100 : value));

                    return {
                        mediaType,
                        ...upload
                    };
                }));

            const payload: CreatePostPayload = {
                ...(content && { content }),
                ...(hashtags.length && { hashtags }),
                visibility: values.visibility ?? 'public',
                ...(medias.length && {
                    media: medias.map(item => ({ ...item, url: item.url.replace('/upload/', '/upload/f_auto,q_auto,vc_h264,w_1280/') }))
                })
            };

            if (updatePostId) {

                const updatePayload: CreatePostPayload = {
                    ...payload,
                    content,
                    hashtags,
                    ...(!medias.length && updatePostData?.media.length && selectedMedia.length === 0 && { media: [] })
                };

                const { media, hashtags: payloadHashtags, ...postContent } = updatePayload;

                const isSameContent = Boolean(updatePostData && !Object.keys(filterDirtyInputs(updatePostData, postContent)).length);
                const isSameHashtags = Boolean(
                    (updatePostData?.hashtags ?? []).length === (payloadHashtags ?? []).length
                    &&
                    !payloadHashtags?.filter((hashtag, i) => (
                        updatePostData?.hashtags
                        &&
                        updatePostData?.hashtags[i] !== hashtag
                    )).length
                );

                if (isSameContent && isSameHashtags && !media) {
                    selectedMedia.forEach(({ previewUrl }) => revokePreviewUrl(previewUrl));
                    setSelectedMedia([]);
                    reset({ content: '', media: [], visibility: 'public' });
                    editor?.commands.clearContent();
                    resetPostUpdateData();
                    return;
                };

                await updatePost({ postId: updatePostId, data: updatePayload });
            } else {
                await createPost(payload);
            };

            selectedMedia.forEach(({ previewUrl }) => revokePreviewUrl(previewUrl));
            setSelectedMedia([]);
            reset({ content: '', media: [], visibility: 'public' });
            editor?.commands.clearContent();

            if (updatePostId) {
                resetPostUpdateData();
            } else if (setIsModelOpen) {
                setIsModelOpen(false);
            };

            toast.success(updatePostId ? 'Your post has been updated' : 'Your post is live');
        }
        catch (error) {
            fieldApiError(error, setError);
            toast.error(updatePostId ? 'Could not update your post. Please try again' : 'Could not publish your post. Please try again');
        }
        finally {
            setIsUploading(false);
            setUploadProgressByFile([]);
        };
    };

    useEffect(() => {

        if (updatePostId && updatePostData) {

            const { content, media, hashtags, visibility } = updatePostData;

            setSelectedMedia(media.map(({ url, mediaType }) => ({ previewUrl: url, mediaType })));
            setCanRemoveAllMedia(media.some(({ mediaType }) => mediaType === 'image'));

            const hashtagsAtEnd = (hashtags ?? [])
                .map((hashtag) => hashtag.trim())
                .filter(Boolean)
                .map((hashtag) => hashtag.startsWith('#') ? hashtag : `#${hashtag}`)
                .join(' ');

            const editorContent = [content?.trim(), hashtagsAtEnd].filter(Boolean).join('\n\n');

            setValues({
                content: editorContent,
                media,
                hashtags,
                visibility
            });

            if (editor) {
                editor.commands.setContent({
                    type: 'doc',
                    content: editorContent.split('\n').map((line) => (
                        line ?
                            { type: 'paragraph', content: [{ type: 'text', text: line }] }
                            :
                            { type: 'paragraph' }
                    )),
                }, { emitUpdate: false });
            };
        };
    }, [editor, updatePostId, updatePostData]);

    if (!editor) {
        return null;
    };

    const isPending = isCreatePending || isUpdatePending;
    const isBusy = isPending || isUploading;
    const mediaToUpload = selectedMedia.filter((item): item is SelectedMedia & { file: File } => Boolean(item.file));
    const totalUploadSize = mediaToUpload.reduce((total, { file }) => total + file.size, 0);
    const uploadProgressPercent = totalUploadSize > 0 ?
        Math.round(mediaToUpload.reduce((total, { file }, index) => total + file.size * (uploadProgressByFile[index] ?? 0) / 100, 0) / totalUploadSize * 100)
        :
        0;
    const isMediaUploading = isUploading && !isPending && selectedMedia.length > 0;
    const canAddImages = !hasExistingMedia && !selectedMedia.some((media) => media.mediaType === 'video') && selectedMedia.length < MAX_IMAGES;
    const canAddVideo = !hasExistingMedia && selectedMedia.length === 0;

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                onDragOver={preventDragDrop}
                onDrop={preventDragDrop}
                className={`w-full max-w-215 border-b border-gray-200 bg-white p-3 sm:px-5 sm:py-4 font-sans ${className}`}
            >
                <div className="flex min-w-0 gap-3">
                    <ImageWithSkeleton
                        src={auth?.profile.avatar}
                        alt={auth?.user.displayName ?? 'Profile avatar'}
                        containerClassName="h-11 w-11 rounded-full shrink-0"
                        className="h-full w-full object-cover rounded-full"
                    />

                    {/* Editor */}
                    {
                        isFetchingDetails ?
                            <span className="text-sm font-medium text-neutral-400 animate-pulse py-3 pb-20 select-none">
                                Getting your post ready for editing...
                            </span>
                            :
                            <div className="min-w-0 flex-1">
                                <EditorContent editor={editor} />
                                {errors.content?.message && <p className="mt-2 text-sm text-red-600">{errors.content.message}</p>}
                                {
                                    selectedMedia.length > 0 && (
                                        <div className="mt-3">
                                            {
                                                updatePostId && canRemoveAllMedia && (
                                                    <div className="mb-2 flex min-w-0 flex-nowrap items-center justify-between gap-1">
                                                        <span className="shrink-0 whitespace-nowrap text-[11px] font-medium text-gray-500 sm:text-xs">Attached media</span>
                                                        <button
                                                            type="button"
                                                            onClick={removeAllMedia}
                                                            disabled={isBusy}
                                                            className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-1.5 py-1.5 text-[11px] font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:gap-1.5 sm:px-2.5 sm:text-xs cursor-pointer"
                                                        >
                                                            <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                                                            Remove all media
                                                        </button>
                                                    </div>
                                                )
                                            }
                                            <div className={selectedMedia[0].mediaType === 'image' ? 'grid grid-cols-3 gap-2 sm:grid-cols-5' : 'flex w-full'}>
                                                {
                                                    selectedMedia.map(({ file, previewUrl, mediaType }, index) => (
                                                        <div
                                                            key={file ? `${file.name}-${file.lastModified}-${index}` : previewUrl}
                                                            className={mediaType === 'image' ?
                                                                'relative aspect-square w-full max-w-28 overflow-hidden rounded-md border border-gray-200 bg-gray-100'
                                                                :
                                                                'relative w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-black shadow-sm'}
                                                        >
                                                            {
                                                                mediaType === 'image' ? (
                                                                    <img src={previewUrl} alt={file?.name ?? 'Post image'} className="h-full w-full object-contain" />
                                                                ) : (
                                                                    <video src={previewUrl} controls className="block aspect-video w-full bg-black object-contain" />
                                                                )
                                                            }
                                                            {
                                                                !canRemoveAllMedia && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeMedia(index)}
                                                                        aria-label={`Remove ${file?.name ?? 'media'}`}
                                                                        title="Remove media"
                                                                        className="absolute right-2 top-2 z-20 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/95 text-gray-800 shadow-md ring-1 ring-black/10 transition hover:bg-red-600 hover:text-white sm:h-8 sm:w-8"
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </button>
                                                                )
                                                            }
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                    }
                </div>

                {/* Set visibility button */}
                <div className={`mt-2 inline-flex h-8 items-center gap-1.5 rounded-full bg-sky-50 px-2.5 text-sky-700 focus-within:ring-2 focus-within:ring-sky-200 sm:ml-14 ${isBusy ? 'opacity-60' : ''}`}>
                    {
                        visibility === 'public' ?
                            <Globe2 className="pointer-events-none h-4 w-4" aria-hidden="true" />
                            :
                            <UsersRound className="pointer-events-none h-4 w-4" aria-hidden="true" />
                    }
                    <select
                        aria-label="Post audience"
                        value={visibility}
                        disabled={isBusy || isFetchingDetails}
                        onChange={(event) => setValue('visibility', event.currentTarget.value as 'public' | 'followers', { shouldDirty: true, shouldValidate: true })}
                        className="h-full cursor-pointer bg-transparent text-sm font-semibold outline-none disabled:cursor-not-allowed"
                    >
                        <option value="public">Public</option>
                        <option value="followers">Followers</option>
                    </select>
                </div>

                <div className="mt-3 border-t border-gray-100 sm:ml-14" />

                {/* Action buttons section */}
                <div className="mt-3 flex min-w-0 flex-wrap items-center justify-between gap-2 sm:ml-14">
                    <div className="flex min-w-0 flex-wrap items-center gap-1">
                        <input ref={imageInputRef} type="file" accept="image/*" multiple disabled={hasExistingMedia || isBusy} className="hidden" onChange={(event) => addFiles(event, 'image')} />
                        <input ref={videoInputRef} type="file" accept="video/*" disabled={hasExistingMedia || isBusy} className="hidden" onChange={(event) => addFiles(event, 'video')} />
                        <button
                            type="button"
                            onClick={() => imageInputRef.current?.click()}
                            disabled={!canAddImages || isBusy || isFetchingDetails}
                            aria-label="Add images"
                            className="rounded-full p-2 text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                        >
                            <ImageIcon className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => videoInputRef.current?.click()}
                            disabled={!canAddVideo || isBusy || isFetchingDetails}
                            aria-label="Add video"
                            className="rounded-full p-2 text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                        >
                            <Video className="h-5 w-5" />
                        </button>
                        <div>
                            <button
                                ref={emojiButtonRef}
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEmojiPickerOpen((isOpen) => !isOpen)
                                }}
                                disabled={isBusy || isFetchingDetails}
                                aria-label="Add emoji"
                                className="rounded-full p-2 text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                            >
                                <Smile className="h-5 w-5" />
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
                    </div>

                    <div className="ml-auto flex items-center gap-3">
                        <span className="text-xs tabular-nums text-gray-500" aria-label={`${contentLength} of 2000 characters`}>
                            {contentLength}/2000
                        </span>
                        <button
                            type="submit"
                            disabled={isBusy || isFetchingDetails}
                            className="inline-flex items-center gap-2 rounded-full bg-[#0f1419] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#272c30] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                        >
                            {isBusy && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            {
                                isPending ? (
                                    updatePostData ?
                                        'Updating…'
                                        :
                                        'Posting…'
                                ) : (
                                    isMediaUploading ?
                                        'Uploading…'
                                        :
                                        isUploading ? (
                                            'Uploading…'
                                        ) : (
                                            updatePostData ?
                                                'Update'
                                                :
                                                'Post'
                                        )
                                )
                            }
                        </button>
                    </div>
                </div>

                {
                    hasExistingMedia && (
                        <div className="mt-3 flex w-full min-w-0 items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800 sm:ml-14 sm:w-auto">
                            <CircleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
                            <p className="min-w-0 flex-1 wrap-break-word text-left">
                                Remove all current media before adding replacements. Adding new media replaces all media on this post.
                            </p>
                        </div>
                    )
                }

                {/* Upload progress bar */}
                {
                    isMediaUploading && (
                        <div className="mt-3 sm:ml-14">
                            <div className="mb-1 flex justify-between text-xs text-gray-500">
                                <span>Uploading media</span>
                                <span>{uploadProgressPercent}%</span>
                            </div>
                            <div
                                role="progressbar"
                                aria-label="Media upload progress"
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={uploadProgressPercent}
                                className="h-1.5 overflow-hidden rounded-full bg-gray-100"
                            >
                                <div className="h-full rounded-full bg-sky-600 transition-[width] duration-200" style={{ width: `${uploadProgressPercent}%` }} />
                            </div>
                        </div>
                    )
                }
            </form>
        </>
    );
};

export default PostCreateSection;