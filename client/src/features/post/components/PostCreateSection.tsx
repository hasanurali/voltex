import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';
import { CircleAlert, Globe2, Image as ImageIcon, LoaderCircle, Smile, UsersRound, Video, X } from 'lucide-react';
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
import { fieldApiError } from '@/utils';
import { usePostDetails } from '../hooks/usePostDetails';


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
    const [selectedMedia, setSelectedMedia] = useState<SelectedMedia[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgressByFile, setUploadProgressByFile] = useState<number[]>([]);

    const auth = useAuthStore((state) => state.auth);
    const resetPostUpdateData = usePostStore((state) => state.resetPostUpdateData);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
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

    const editor = useEditor({
        extensions: [
            starterKit,
            HashtagHighlight,
            Placeholder.configure({ placeholder: 'What’s happening?', emptyNodeClass: 'post-composer-empty' }),
            Image.configure({ inline: false }),
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
        },
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

        if (!originalContent && selectedMedia.length === 0) {
            toast.error('Write something or add media before posting');
            return;
        };

        setIsUploading(true);
        const mediaToUpload = selectedMedia.filter((item): item is SelectedMedia & { file: File } => Boolean(item.file));
        setUploadProgressByFile(mediaToUpload.map(() => 0));

        try {
            const media: MediaPayloadItem[] = await Promise.all(

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
                ...(media.length && {
                    media: media.map(item => ({ ...item, url: item.url.replace('/upload/', '/upload/f_auto,q_auto,vc_h264,w_1280/') }))
                })
            };

            if (updatePostId) {
                const updatePayload: CreatePostPayload = {
                    ...payload,
                    ...(!media.length && updatePostData?.media.length && selectedMedia.length === 0 && { media: [] })
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

    const { data: updatePostData } = usePostDetails(updatePostId ?? "");

    useEffect(() => {

        if (updatePostId && updatePostData) {

            const { content, media, hashtags, visibility } = updatePostData;

            setSelectedMedia(media.map(({ url, mediaType }) => ({ previewUrl: url, mediaType })));

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
                className={`w-full max-w-215 border-b border-gray-200 bg-white px-4 py-4 font-sans sm:px-5 ${className}`}
            >
                <div className="flex min-w-0 gap-3">
                    <img
                        src={auth?.profile.avatar}
                        alt={auth?.user.displayName ?? 'Your profile'}
                        className="h-11 w-11 shrink-0 rounded-full object-cover"
                    />

                    {/* Editor */}
                    <div className="min-w-0 flex-1">

                        <EditorContent editor={editor} />
                        {errors.content?.message && <p className="mt-2 text-sm text-red-600">{errors.content.message}</p>}
                        {
                            selectedMedia.length > 0 && (
                                <div className={`mt-3 grid grid-cols-3 gap-2 ${selectedMedia[0].mediaType === 'image' ? 'sm:grid-cols-5' : 'grid-cols-1'}`}>
                                    {
                                        selectedMedia.map(({ file, previewUrl, mediaType }, index) => (
                                            <div key={file ? `${file.name}-${file.lastModified}-${index}` : previewUrl} className={`relative overflow-hidden rounded-md border border-gray-200 bg-gray-100 ${mediaType === 'image' ? 'aspect-square w-full max-w-28' : 'aspect-video w-full max-w-sm'}`}>
                                                {
                                                    mediaType === 'image' ? (
                                                        <img src={previewUrl} alt={file?.name ?? 'Post image'} className="h-full w-full object-contain" />
                                                    ) : (
                                                        <video src={previewUrl} controls className="h-full w-full bg-black object-contain" />
                                                    )
                                                }
                                                <button
                                                    type="button"
                                                    onClick={() => removeMedia(index)}
                                                    aria-label={`Remove ${file?.name}`}
                                                    title="Remove media"
                                                    style={{ top: '0.5rem', right: '0.5rem', zIndex: 20 }}
                                                    className="absolute flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-gray-800 shadow-md ring-1 ring-black/10 transition hover:bg-red-600 hover:text-white"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))
                                    }
                                </div>
                            )
                        }
                    </div>
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
                        disabled={isBusy}
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
                            disabled={!canAddImages || isBusy}
                            title="Add images"
                            aria-label="Add images"
                            className="rounded-full p-2 text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                        >
                            <ImageIcon className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => videoInputRef.current?.click()}
                            disabled={!canAddVideo || isBusy}
                            title="Add video"
                            aria-label="Add video"
                            className="rounded-full p-2 text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                        >
                            <Video className="h-5 w-5" />
                        </button>
                        <div className="relative">
                            {isEmojiPickerOpen && (
                                <div onClick={(e) => e.stopPropagation()} className="absolute left-0 top-full z-20 mt-2">
                                    <EmojiPicker onEmojiClick={addEmoji} />
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEmojiPickerOpen((isOpen) => !isOpen)
                                }}
                                title="Add emoji"
                                aria-label="Add emoji"
                                className="rounded-full p-2 text-sky-700 transition hover:bg-sky-50 cursor-pointer"
                            >
                                <Smile className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="ml-auto flex items-center gap-3">
                        <span className="text-xs tabular-nums text-gray-500" aria-label={`${contentLength} of 2000 characters`}>
                            {contentLength}/2000
                        </span>
                        <button
                            type="submit"
                            disabled={isBusy}
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
                                        `Uploading ${uploadProgressPercent}%`
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

                {hasExistingMedia && (
                    <div className="mt-3 flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs text-amber-800 sm:ml-14">
                        <CircleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <p>
                            Remove all current media before adding replacements. Adding new media replaces all media on this post.
                        </p>
                    </div>
                )}

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