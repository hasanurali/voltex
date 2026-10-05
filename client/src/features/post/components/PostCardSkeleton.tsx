import { Skeleton } from '@/components/feedback';

const PostCardSkeleton = () => {
    return (
        <div className="relative max-w-215 w-full min-w-0 h-fit flex gap-1 bg-white border-b border-b-secondary-200 p-3 sm:p-4 md:p-6 py-5">

            {/* Avatar */}
            <div className="h-20 w-25 hidden min-[1000px]:block min-[1155px]:hidden min-[1400px]:block">
                <Skeleton className="w-15 h-15 mx-auto rounded-full!" />
            </div>

            <div className="flex w-full min-w-0 flex-1 flex-col gap-3">

                {/* Header */}
                <section className="flex flex-col gap-3 min-[1000px]:pt-2 min-[1155px]:pt-0 min-[1400px]:pt-2">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-12 h-12 rounded-full! min-[1000px]:hidden min-[1155px]:block min-[1400px]:hidden" />
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>

                    {/* Text content */}
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                </section>

                {/* Media block */}
                <Skeleton className="h-43.75 w-full @min-[376px]:h-50 @min-[426px]:h-60 @min-[500px]:h-70 @min-[600px]:h-80 @min-[700px]:h-90 rounded-md" />

                {/* Action row */}
                <section className="flex gap-5">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-12" />
                </section>
            </div>
        </div>
    );
};

export default PostCardSkeleton;