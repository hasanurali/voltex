import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ellipsis, Heart, MessageSquare, Pencil, Trash2 } from "lucide-react";
import type { Post } from "../types";
import VideoPlayer from "./VideoPlayer";
import { numberConverter, timeConverter } from "@/utils";
import { useAuthStore, usePostStore } from "@/store";


interface PostCardProps {
    post: Post;
};


const PostCard = ({ post }: PostCardProps) => {

    const [expanded, setExpanded] = useState(false);
    const [isPostCenter, setisPostCenter] = useState(false);
    const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);

    const postRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    const auth = useAuthStore((state) => state.auth);
    const setUpdatePostId = usePostStore((state) => state.setUpdatePostId);

    const visibleMedia = post.media.slice(0, 4);
    const remainingMediaCount = post.media.length - visibleMedia.length;
    const content = post.content ?? '';
    const showMore = content.length > 200;
    const displayContent = showMore && !expanded ? `${content.slice(0, 200).trim()}...` : content;
    const isCurrentUserPost = auth?.user._id === post.author._id;

    const handleProfileNavigate = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        navigate(`/profile/${post.author.username}`);
    };

    useEffect(() => {

        const observer = new IntersectionObserver((entries) => {

            if (entries[0].isIntersecting) {
                setisPostCenter(true);
            }
            else {
                setisPostCenter(false)
            };
        }, {
            root: null,
            rootMargin: "-49% 0px -49% 0px",
            threshold: 0
        });

        const currentTarget = postRef.current;

        if (currentTarget) {
            observer.observe(currentTarget);
        };

        return () => {

            if (currentTarget) {
                setisPostCenter(false);
                observer.unobserve(currentTarget);
            };
        };
    }, [post._id]);

    return (
        <>

            <div ref={postRef} onClick={() => navigate(`/posts/${post._id}`)} className={`relative max-w-215 w-full min-w-0 h-fit flex gap-1 bg-white border-b border-b-secondary-200 p-3 sm:p-4 md:p-6 py-5 cursor-pointer transition-colors duration-200 ${isEditMenuOpen ? "" : "hover:bg-[#f9f9f9]"}`}>

                {/* User avatar: display in specific width */}
                <div onClick={handleProfileNavigate} className="h-20 w-25 hidden min-[1000px]:block min-[1155px]:hidden min-[1400px]:block">
                    <img className="w-15 h-15 mx-auto object-cover rounded-full text-center" src={post.author.avatar} alt={post.author.displayName} />
                </div>

                <div className="flex w-full min-w-0 flex-1 flex-col gap-3">

                    {/* Top header and content section */}
                    <section className="flex flex-col gap-3 min-[1000px]:pt-2 min-[1155px]:pt-0 min-[1400px]:pt-2">
                        <div className="flex justify-between items-center relative">
                            <div className="flex items-center gap-3">
                                <img className="w-12 rounded-full min-[1000px]:hidden min-[1155px]:block min-[1400px]:hidden" src={post.author.avatar} alt={post.author.displayName} />

                                <div>
                                    <p onClick={handleProfileNavigate} className="text-[16px] font-bold hover:underline decoration-1 underline-offset-1">{post.author.displayName}</p>
                                    <div className="text-sm font-medium text-secondary-400 flex gap-1">
                                        <span onClick={handleProfileNavigate}>{`@${post.author.username}`}</span>
                                        <span>• {timeConverter(post.createdAt)}</span>
                                    </div>
                                </div>
                            </div>

                            {
                                isCurrentUserPost && <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsEditMenuOpen(true)
                                    }}
                                    className="group p-2.5 rounded-full transition hover:bg-sky-100 cursor-pointer">
                                    <Ellipsis aria-hidden="true" className="group-hover:text-sky-600" />
                                </button>
                            }

                            {/* Post edit menu */}
                            {
                                isEditMenuOpen && <div onClick={(e) => e.stopPropagation()} className="absolute z-20 top-5 right-3 w-36 h-fit overflow-hidden rounded-md border border-secondary-100 bg-white shadow-2xl flex flex-col">
                                    <button
                                        onClick={() => {
                                            setUpdatePostId(post._id);
                                            setIsEditMenuOpen(false);
                                        }}
                                        type="button"
                                        className="flex items-center gap-2 px-3 py-2 text-left text-sm text-secondary-800 transition-colors hover:bg-sky-50 hover:text-sky-700 focus-visible:bg-sky-50 focus-visible:outline-none cursor-pointer"
                                    >
                                        <Pencil size={16} aria-hidden="true" />
                                        <span>Edit</span>
                                    </button>
                                    <button type="button" className="flex items-center gap-2 border-t border-secondary-100 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 hover:text-red-800 focus-visible:bg-red-50 focus-visible:outline-none cursor-pointer">
                                        <Trash2 size={16} aria-hidden="true" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            }
                        </div>

                        {/* Text content section */}
                        <p className="font-sans text-sm whitespace-pre-wrap wrap-break-word text-secondary-800">
                            {displayContent}
                            {
                                showMore && (
                                    <button type="button" onClick={() => setExpanded((prev) => !prev)} className="ml-1 font-medium text-blue-400 hover:text-blue-500 hover:underline decoration-1 underline-offset-1 cursor-pointer">
                                        {
                                            expanded ?
                                                "Show less"
                                                :
                                                "Show more"
                                        }
                                    </button>
                                )
                            }
                        </p>
                    </section>

                    {/* Media content section */}
                    <section className={`h-43.75 w-full min-w-0 @min-[376px]:h-50 @min-[426px]:h-60 @min-[500px]:h-70 @min-[600px]:h-80 @min-[700px]:h-90 ${!post.media.length && 'hidden'}`}>

                        {
                            visibleMedia.length > 0 && (
                                <div className={`grid h-full gap-1 overflow-hidden rounded-md ${visibleMedia.length === 1 ?
                                    "grid-cols-1 grid-rows-1"
                                    : visibleMedia.length === 2 ?
                                        "grid-cols-2 grid-rows-1"
                                        : "grid-cols-2 grid-rows-2"
                                    }`}>

                                    {
                                        visibleMedia.map((media, i) => {
                                            const isLastVisibleMedia = i === visibleMedia.length - 1;
                                            const showRemainingCount = isLastVisibleMedia && remainingMediaCount > 0;

                                            return (
                                                <div key={media.url} className={`relative flex min-h-0 min-w-0 items-center justify-center overflow-hidden bg-secondary-100 ${visibleMedia.length === 3 && i === 0 ? "row-span-2" : ""}`}>
                                                    {
                                                        media.mediaType === "video" ?
                                                            <VideoPlayer url={media.url} isPostCenter={isPostCenter} />
                                                            :
                                                            <img className="h-full w-full object-contain" src={media.url} alt="Post media" />
                                                    }

                                                    {/* See more section */}
                                                    {
                                                        showRemainingCount && (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/65 text-white">
                                                                <span className="text-center font-semibold">
                                                                    <span className="block text-2xl">+{remainingMediaCount}</span>
                                                                    <span className="text-sm">See all {post.media.length} photos</span>
                                                                </span>
                                                            </div>
                                                        )}
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                    </section>

                    {/* Bottom interaction section */}
                    <section className="flex gap-5 text-secondary-600">
                        <button type="button" className="flex items-center gap-2 hover:text-[#1D9BF0] cursor-pointer">
                            <MessageSquare width={20} />
                            <span className="text-sm">{numberConverter(post.commentsCount)}</span>
                        </button>

                        <button type="button" className="flex items-center gap-2 hover:text-rose-600 cursor-pointer">
                            <Heart width={20} className={`${post.hasReacted ? "fill-rose-500 text-rose-500" : ""}`} />
                            <span className={`text-sm ${post.hasReacted && 'text-rose-500'}`}>{numberConverter(post.likesCount)}</span>
                        </button>
                    </section>
                </div>
            </div>

            {/* Edit menu overlay */}
            {
                isEditMenuOpen && <div
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsEditMenuOpen(false);
                    }}
                    aria-hidden="true"
                    className="absolute z-10 inset-0 bg-transparent"></div>
            }
        </>
    )
};

export default PostCard;