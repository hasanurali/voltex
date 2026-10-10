import { ImageWithSkeleton } from "@/components/media";
import { numberConverter, timeConverter } from "@/utils";
import { ChevronDown, ChevronUp, EllipsisVertical, Heart, MessageSquare, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommentForm from "./CommentForm";
import type { Comment } from "../type";
import { useFetchCommentReplies } from "../hooks/useFetchCommentReplies";
import Line from "./Line";
import Curve from "./Curve";
import { createPortal } from "react-dom";


interface CommentCardProps {
    comment: Comment;
};


const CommentCard = ({ comment }: CommentCardProps) => {

    const [isReplying, setIsReplying] = useState(false);
    const [areRepliesExpanded, setAreRepliesExpanded] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditComment, setIsEditComment] = useState(false);

    const navigate = useNavigate();

    const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isPending: isFetchCommentPending } = useFetchCommentReplies(comment._id, 10, areRepliesExpanded);
    const replies = data ?? [];

    const openAuthorProfile = () => {
        navigate(`/profile/${comment.author.username}`);
    };

    return (
        <article className="relative flex gap-3 py-3">

            {/* Avatar */}
            <button
                type="button"
                onClick={openAuthorProfile}
                className={`${comment.depth >= 1 ? 'w-8' : 'w-10'} flex flex-col items-start gap-1.75 pb-9 shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-800 relative`}
            >
                <ImageWithSkeleton
                    src={comment.author.avatar}
                    alt={comment.author.displayName}
                    className="h-full w-full rounded-full object-cover"
                    containerClassName={`${comment.depth > 0 ? 'h-8 w-8' : 'h-10 w-10'} rounded-full shrink-0`}
                />
                {
                    areRepliesExpanded && <Line className="mx-auto" />
                }
                {
                    comment.depth > 0 && <Curve className={`absolute -left-8 -top-0.5 ${comment.depth > 1 && 'w-5.5! -left-7!'}`} />
                }
            </button>

            {/* Main content section */}
            <div className="min-w-0 flex-1">

                {/* Author info and content */}
                <div className="rounded-xl sm:rounded-2xl bg-white px-2 py-1.5 sm:px-4 sm:py-3 ring-1 ring-secondary-200/70 relative">
                    <div className="min-w-0 flex justify-between">
                        <div className="flex flex-wrap  items-center gap-x-2">
                            <button
                                type="button"
                                onClick={openAuthorProfile}
                                className="max-w-full truncate text-left text-sm font-semibold text-secondary-900 hover:underline"
                            >
                                {comment.author.displayName}
                            </button>

                            <div className="flex gap-1">
                                <span className="truncate text-xs text-secondary-500">@{comment.author.username}</span>
                                <span aria-hidden="true" className="text-xs text-secondary-400">·</span>
                                <time
                                    dateTime={comment.createdAt}
                                    title={new Date(comment.createdAt).toLocaleString()}
                                    className="text-xs text-secondary-500"
                                >
                                    {timeConverter(comment.createdAt)}
                                </time>
                            </div>
                        </div>

                        {
                            !isEditComment && <button
                                onClick={() => setIsMenuOpen(true)}
                                type="button"
                                className="cursor-pointer"
                            >
                                <EllipsisVertical aria-hidden="true" size={20} color="gray" />
                            </button>
                        }

                        {/* Post edit menu */}
                        {
                            isMenuOpen && <div onClick={(e) => e.stopPropagation()} className="absolute z-20 top-3 right-3 w-36 h-fit overflow-hidden rounded-md border border-secondary-100 bg-white shadow-2xl flex flex-col">
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setIsEditComment(true);
                                    }}
                                    type="button"
                                    className="flex items-center gap-2 px-3 py-2 text-left text-sm text-secondary-800 transition-colors hover:bg-sky-50 hover:text-sky-700 focus-visible:bg-sky-50 focus-visible:outline-none cursor-pointer"
                                >
                                    <Pencil size={16} aria-hidden="true" />
                                    <span>Edit</span>
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center gap-2 border-t border-secondary-100 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 hover:text-red-800 focus-visible:bg-red-50 focus-visible:outline-none cursor-pointer"
                                >
                                    <Trash2 size={16} aria-hidden="true" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        }

                        {/* Edit menu overlay */}
                        {
                            isMenuOpen && createPortal(
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsMenuOpen(false);
                                    }}
                                    aria-hidden="true"
                                    className="absolute z-10 inset-0 bg-transparent"></div>,
                                document.body
                            )
                        }
                    </div>

                    {/* Edit form and content */}
                    <div className="mt-2">
                        {
                            isEditComment ?
                                <CommentForm commentUpdateData={{ content: comment.content, commentId: comment._id }} onClose={() => setIsEditComment(false)} />
                                :
                                <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6 text-secondary-800">
                                    {comment.content}
                                </p>
                        }
                    </div>
                </div>

                {/* Bottom action buttons */}
                <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 pl-2 text-xs text-secondary-500">
                    <button
                        type="button"
                        aria-label={`${comment.hasReacted ? "Unlike" : "Like"}`}
                        className={`inline-flex items-center gap-1.5 rounded-full transition hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-800 ${comment.hasReacted ? "font-medium text-rose-600" : "cursor-pointer"}`}
                    >
                        <Heart aria-hidden="true" className={`h-4 w-4 ${comment.hasReacted ? "fill-rose-500 text-rose-500" : ""}`} />
                        {numberConverter(comment.likesCount)}
                    </button>

                    <button
                        type="button"
                        aria-expanded={isReplying}
                        onClick={() => setIsReplying((open) => !open)}
                        className="inline-flex items-center gap-1.5 rounded-full font-medium text-secondary-600 transition hover:text-[#1D9BF0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-800 cursor-pointer"
                    >
                        <MessageSquare aria-hidden="true" className="h-4 w-4" />
                        {isReplying ? "Cancel" : "Reply"}
                    </button>

                    {
                        comment.repliesCount > 0 && !areRepliesExpanded && (
                            <button
                                type="button"
                                aria-controls={`comment-replies-${comment._id}`}
                                onClick={() => setAreRepliesExpanded((expanded) => !expanded)}
                                className="inline-flex items-center gap-1.5 rounded-full font-medium text-primary-800 transition hover:text-primary-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-800 cursor-pointer"
                            >
                                <ChevronDown className="h-4 w-4" aria-hidden="true" />
                                {`${numberConverter(comment.repliesCount)} replies`}
                            </button>
                        )
                    }
                </div>

                {/* Add Reply input */}
                {
                    isReplying && (
                        <div className="mt-3">
                            <CommentForm
                                postId={comment.post}
                                parentComment={comment._id}
                                onClose={() => setIsReplying(false)}
                            />
                        </div>
                    )
                }

                {/* Comment replies fetching section */}
                {
                    areRepliesExpanded && (
                        <div id={`comment-replies-${comment._id}`} className="relative mt-1">
                            {
                                isFetchCommentPending && (
                                    <p className="py-3 text-sm text-secondary-500">Loading replies...</p>
                                )
                            }
                            {
                                replies.map((reply) => (
                                    <CommentCard key={reply._id} comment={reply} />
                                ))
                            }
                            {
                                hasNextPage && (
                                    <button
                                        type="button"
                                        onClick={() => void fetchNextPage()}
                                        disabled={isFetchingNextPage}
                                        className={`my-2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-primary-800 transition hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-800 disabled:cursor-wait disabled:opacity-60 ${!isFetchingNextPage && 'cursor-pointer'}`}
                                    >
                                        {isFetchingNextPage ? "Loading more replies..." : "Show more replies"}
                                    </button>
                                )
                            }
                            {
                                comment.repliesCount > 0 && (
                                    <div className="relative mt-5 flex min-h-9 items-center">
                                        <button
                                            type="button"
                                            onClick={() => setAreRepliesExpanded(false)}
                                            className="relative z-10 inline-flex items-center gap-1.5 py-2 text-sm font-semibold text-primary-800 transition hover:text-primary-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-800 cursor-pointer"
                                        >
                                            Hide replies
                                            <ChevronUp className="h-4 w-4" aria-hidden="true" />
                                            <Curve className={`absolute -left-8 -top-0.5 ${comment.depth > 0 && 'w-5.5! -left-7!'}`} />
                                        </button>
                                    </div>
                                )
                            }
                        </div>
                    )}
            </div>
        </article>
    );
};

export default CommentCard;
