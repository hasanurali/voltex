import { SentinelLoadingItem } from '@/components';
import { MessageCircle } from 'lucide-react';
import { numberConverter } from '@/utils';
import type { Post } from '@/features/post';
import CommentCard from './CommentCard';
import CreateCommentSection from './CreateCommentSection';
import { useFetchComment } from '../hooks/useFetchComment';
import { useEffect, useRef } from 'react';


interface CommentSectionProps {
    post: Post;
};


const CommentSection = ({ post }: CommentSectionProps) => {

    const observerTarget = useRef<HTMLDivElement | null>(null);

    const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isPending: isFetchCommentPending, isError: isFetchCommentError } = useFetchComment(post._id);
    const comments = data ?? [];

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

    return (
        <div>
            <CreateCommentSection postId={post._id} />

            <div className="flex items-center gap-2 pt-5">
                <MessageCircle className="h-4.5 w-4.5 text-secondary-500" />
                <h2 className="text-base font-bold text-secondary-900">Discussion</h2>
                <span className="text-sm text-secondary-500">{numberConverter(post.commentsCount)}</span>
            </div>

            {
                isFetchCommentPending && (
                    <p className="py-6 text-center text-sm text-secondary-500">
                        Loading comments...
                    </p>
                )
            }
            {
                !isFetchCommentPending && !isFetchCommentError && comments.length === 0 && (
                    <p className="py-6 text-center text-sm text-secondary-500">
                        No comments yet. Start the conversation.
                    </p>
                )
            }
            {
                comments.length > 0 && (
                    <div className="divide-y divide-secondary-100">
                        {
                            comments.map((comment) => (
                                <CommentCard key={comment._id} comment={comment} />
                            ))
                        }
                        {
                            !isFetchCommentPending && <SentinelLoadingItem
                                ref={observerTarget}
                                hasNextPage={hasNextPage}
                                hasItems={comments.length > 0}
                                isFetchingNextPage={isFetchingNextPage}
                            />
                        }
                    </div>
                )
            }
        </div>
    )
}

export default CommentSection;