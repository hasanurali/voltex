import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Expand, Globe2, Heart, LockKeyhole, MessageCircle, X } from "lucide-react";
import TopBar from "@/app/TopBar";
import { numberConverter, timeConverter } from "@/utils";
import VideoPlayer from "../components/VideoPlayer";
import { usePostDetails } from "../hooks/usePostDetails";
import { Button } from "@/components";

const PostDetails = () => {

    const [activeViewerIndex, setActiveViewerIndex] = useState<number | null>(null);

    const navigate = useNavigate();

    const { postId } = useParams<{ postId: string }>();

    const { data: post, isError, refetch } = usePostDetails(postId ?? "");
    const viewerMedia = post?.media ?? [];

    const viewerImages = viewerMedia
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => item.mediaType === "image");
    const activeViewerMedia = activeViewerIndex === null ? undefined : viewerMedia[activeViewerIndex];
    const activeImagePosition = viewerImages.findIndex(({ index }) => index === activeViewerIndex);

    useEffect(() => {
        if (activeViewerIndex === null) {
            return;
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setActiveViewerIndex(null);
            }
            else if (activeViewerMedia?.mediaType === "image" && event.key === "ArrowLeft") {
                const previousPosition = (activeImagePosition - 1 + viewerImages.length) % viewerImages.length;
                setActiveViewerIndex(viewerImages[previousPosition]?.index ?? null);
            }
            else if (activeViewerMedia?.mediaType === "image" && event.key === "ArrowRight") {
                const nextPosition = (activeImagePosition + 1) % viewerImages.length;
                setActiveViewerIndex(viewerImages[nextPosition]?.index ?? null);
            };
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [activeImagePosition, activeViewerIndex, activeViewerMedia?.mediaType, viewerImages]);

    const handleProfileNavigation = () => {
        navigate(`/profile/${post?.author.username}`);
    };

    if (isError) {
        return (
            <>
                <TopBar>Post</TopBar>

                <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
                    <p className="text-base font-semibold text-secondary-900">We couldn't load this post.</p>
                    <Button size="md" onClick={() => refetch()} className="rounded-md text-sm font-semibold cursor-pointer">
                        Try again
                    </Button>
                </div>
            </>
        );
    };

    if (!post) {
        return (
            <>
                <TopBar>Post</TopBar>

                <div className="flex min-h-[60vh] items-center justify-center px-6 text-center text-sm text-secondary-500">
                    This post is no longer available.
                </div>
            </>
        );
    };

    const media = post.media ?? [];
    const visibleMedia = media.slice(0, 6);
    const galleryLayout = visibleMedia.length === 1
        ? "grid-cols-1 grid-rows-1 aspect-[4/3] sm:aspect-[16/10]"
        : visibleMedia.length === 2
            ? "grid-cols-2 grid-rows-1 aspect-[4/3] sm:aspect-[16/10]"
            : visibleMedia.length === 3 || visibleMedia.length === 4
                ? "grid-cols-2 grid-rows-2 aspect-[4/3] sm:aspect-[16/10]"
                : visibleMedia.length === 5
                    ? "grid-cols-6 grid-rows-2 aspect-[4/3] sm:aspect-[16/10]"
                    : "grid-cols-3 grid-rows-2 aspect-[4/3] sm:aspect-[16/10]";

    return (
        <div className="flex min-h-full min-w-0 w-full flex-col bg-secondary-50">

            <TopBar>Post</TopBar>

            <div className="w-full min-w-0 flex-1 px-4 pb-20 pt-4 sm:px-6 sm:pt-6 lg:px-8">
                <div className="mx-auto w-full min-w-0 max-w-5xl">

                    <article className="flex w-full min-w-0 flex-col">

                        {/* Author post's text content and hashtags section */}
                        <section className="min-w-0 py-5 sm:py-7" aria-label="Post content">
                            <div className="flex items-center gap-3">
                                <button onClick={handleProfileNavigation} className="shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-700" >
                                    <img src={post.author.avatar} alt={post.author.displayName} className="h-11 w-11 rounded-full object-cover" />
                                </button >

                                <div className="min-w-0 flex-1">
                                    <button onClick={handleProfileNavigation} className="block max-w-full truncate text-left text-sm font-bold text-secondary-950 hover:underline">
                                        {post.author.displayName}
                                    </button>
                                    <p className="truncate text-sm text-secondary-500">@{post.author.username}</p>
                                </div>
                            </div >

                            <div className="mt-4">
                                {
                                    post.content ? (
                                        <p className="whitespace-pre-wrap wrap-break-word text-[15px] leading-7 text-secondary-800">{post.content}</p>
                                    ) : (
                                        <p className="text-sm italic text-secondary-400">No caption</p>
                                    )
                                }

                                {
                                    post.hashtags && post.hashtags.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {
                                                post.hashtags.map((hashtag) => (
                                                    <span key={hashtag} className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">{hashtag.startsWith("#") ? hashtag : `#${hashtag}`}</span>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        </section >

                        {/* Media rendering section */}
                        {
                            visibleMedia.length > 0 && (
                                <section className={`grid min-w-0 gap-1 overflow-hidden rounded-xl bg-secondary-100 ${galleryLayout}`} aria-label="Post media">
                                    {
                                        visibleMedia.map((item, index) => {

                                            const isFiveItemLayout = visibleMedia.length === 5;

                                            const tileLayout = isFiveItemLayout ?
                                                index < 2 ?
                                                    "col-span-3"
                                                    :
                                                    "col-span-2"
                                                :
                                                visibleMedia.length === 3 && index === 0 ? "row-span-2" : "";

                                            const hasMoreMedia = index === visibleMedia.length - 1 && media.length > visibleMedia.length;

                                            return (
                                                <div key={item.url} className={`relative min-h-0 min-w-0 overflow-hidden bg-neutral-100 ${tileLayout}`}>
                                                    {
                                                        item.mediaType === "video" ? (
                                                            <VideoPlayer url={item.url} />
                                                        ) : (
                                                            <button onClick={() => setActiveViewerIndex(index)} className="group absolute inset-0 h-full w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-white">
                                                                <img src={item.url} alt={`Post image ${index + 1}`} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
                                                                <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/15 group-hover:opacity-100 group-focus-visible:opacity-100">
                                                                    <Expand className="h-6 w-6 drop-shadow" />
                                                                </span>
                                                            </button>
                                                        )
                                                    }
                                                    {
                                                        hasMoreMedia && (
                                                            <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-xl font-bold text-white">
                                                                +{media.length - visibleMedia.length}
                                                            </span>
                                                        )
                                                    }
                                                </div>
                                            );
                                        })
                                    }
                                </section>
                            )
                        }

                        {/* Post time/visibility and engagement counts section*/}
                        <section className="flex items-center justify-between gap-2 py-4 text-xs text-secondary-600" aria-label="Post details and engagement">
                            <div className="flex min-w-0 flex-1 items-center gap-1.5 text-secondary-500">
                                <time className="truncate" dateTime={post.createdAt} title={`${new Date(post.createdAt).toLocaleString()}${post.isEdited ? " · edited" : ""}`}>
                                    {timeConverter(post.createdAt)}{post.isEdited ? " · edited" : ""}
                                </time>

                                <span>·</span>

                                <span className="inline-flex shrink-0 items-center gap-1">
                                    {
                                        post.visibility === "public" ?
                                            <Globe2 className="h-3.5 w-3.5" />
                                            :
                                            <LockKeyhole className="h-3.5 w-3.5" />
                                    }
                                    <span className="hidden min-[400px]:inline">{post.visibility === "public" ? "Public" : "Followers"}</span>
                                </span>
                            </div>

                            <div className="flex shrink-0 items-center gap-3 text-sm">
                                <button className="inline-flex items-center gap-1">
                                    <MessageCircle className="h-4 w-4" />
                                    <span className="font-semibold text-secondary-900">{numberConverter(post.commentsCount)}</span>
                                    <span className="hidden sm:inline">Comments</span>
                                </button>

                                <button className="inline-flex items-center gap-1">
                                    <Heart className={`h-4 w-4 ${post.hasReacted ? "fill-rose-500 text-rose-500" : ""}`} />
                                    <span className="font-semibold text-secondary-900">{numberConverter(post.likesCount)}</span>
                                    <span className="hidden sm:inline">Likes</span>
                                </button>
                            </div>
                        </section>

                        {/* Comment section */}
                        <section className="border-t border-secondary-200 py-5" aria-labelledby="comments-heading">
                            <div className="flex items-center gap-2">
                                <MessageCircle className="h-4.5 w-4.5 text-secondary-500" />
                                <h2 id="comments-heading" className="text-base font-bold text-secondary-900">Discussion</h2>
                                <span className="text-sm text-secondary-500">{numberConverter(post.commentsCount)}</span>
                            </div>

                            <p className="mt-3 text-sm text-secondary-500">
                                {post.commentsCount === 0 ? "No comments yet." : "Comments aren't available in this view yet."}
                            </p>
                        </section>
                    </article >
                </div >
            </div >

            {/* Full-screen image section */}
            {
                activeViewerIndex !== null && viewerMedia[activeViewerIndex] && (
                    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4" role="dialog" aria-label="Post media viewer" onClick={() => setActiveViewerIndex(null)}>
                        <button type="button" onClick={() => setActiveViewerIndex(null)} className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white cursor-pointer">
                            <X className="h-5 w-5" />
                        </button>

                        {
                            activeViewerMedia?.mediaType === "image" && viewerImages.length > 1 && (
                                <button type="button" onClick={(event) => {
                                    event.stopPropagation();
                                    const previousPosition = (activeImagePosition - 1 + viewerImages.length) % viewerImages.length;
                                    setActiveViewerIndex(viewerImages[previousPosition].index);
                                }}
                                    className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6 sm:h-12 sm:w-12"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                            )
                        }

                        <div className="flex h-[min(72vh,760px)] w-[min(92vw,1100px)] items-center justify-center" onClick={(event) => event.stopPropagation()}>
                            {
                                activeViewerMedia && <img src={activeViewerMedia.url} alt={`Post image ${activeImagePosition + 1}`} className="max-h-full max-w-full object-contain" />
                            }
                        </div>

                        {
                            activeViewerMedia?.mediaType === "image" && viewerImages.length > 1 && (
                                <button type="button" onClick={(event) => { event.stopPropagation(); const nextPosition = (activeImagePosition + 1) % viewerImages.length; setActiveViewerIndex(viewerImages[nextPosition].index); }} aria-label="Next image" className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6 sm:h-12 sm:w-12">
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            )
                        }

                        {
                            activeViewerMedia?.mediaType === "image" && (
                                <>
                                    {
                                        viewerImages.length > 1 && (
                                            <div className="mt-4 flex max-w-full items-center gap-2 overflow-x-auto px-2" onClick={(event) => event.stopPropagation()}>
                                                {viewerImages.map(({ item, index }) => (
                                                    <button
                                                        key={item.url}
                                                        onClick={() => setActiveViewerIndex(index)}
                                                        className={`relative h-12 w-12 shrink-0 overflow-hidden rounded border-2 bg-neutral-800 sm:h-14 sm:w-14 ${activeViewerIndex === index ? "border-white" : "border-transparent opacity-60 hover:opacity-100"}`}
                                                    >
                                                        <img src={item.url} alt="" className="h-full w-full object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        )
                                    }
                                    <p className="mt-2 text-xs text-white/70">{activeImagePosition + 1} / {viewerImages.length}</p>
                                </>
                            )
                        }
                    </div>
                )
            }
        </div >
    );
};

export default PostDetails;