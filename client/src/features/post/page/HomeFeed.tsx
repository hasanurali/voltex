import TopBar from '@/app/TopBar';
import PostCard from '../components/PostCard';
import { useFetchHomeFeed } from '../hooks/useFetchHomeFeed';
import { useEffect, useRef } from 'react';
import { SentinelLoadingItem } from '@/components';
import PostCreateSection from '../components/PostCreateSection';
import PostCardSkeleton from '../components/PostCardSkeleton';

const HomeFeed = () => {

    const observerTarget = useRef<HTMLDivElement | null>(null);

    const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isPending: isFetchHomeFeedPending } = useFetchHomeFeed();
    const posts = data ?? [];

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
        <div className='@container max-w-215 min-h-0 min-w-0 w-full bg-secondary-50 flex flex-col overflow-hidden overflow-y-auto md:h-full'>
            <TopBar>
                Home
            </TopBar>
            <PostCreateSection />

            {
                isFetchHomeFeedPending ?
                    Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)
                    :
                    posts?.map(post => <PostCard key={post._id} post={post} />)
            }
            {
                !isFetchHomeFeedPending && <SentinelLoadingItem
                    ref={observerTarget}
                    hasNextPage={hasNextPage}
                    hasItems={posts.length > 0}
                    isFetchingNextPage={isFetchingNextPage}
                />
            }
        </div>
    )
}

export default HomeFeed;