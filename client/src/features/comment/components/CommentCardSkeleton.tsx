import { Skeleton } from '@/components/feedback';

const CommentCardSkeleton = () => {

    return (
        <div className="relative flex gap-3 py-3">

            {/* Avatar */}
            <div className="w-10 shrink-0">
                <Skeleton className="h-10 w-10 rounded-full!" />
            </div>

            <div className="min-w-0 flex-1">

                <div className="rounded-xl sm:rounded-2xl border border-secondary-200 bg-neutral-50/50 px-2 py-1.5 sm:px-4 sm:py-3">

                    {/* Name, username and time */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-10" />
                    </div>

                    {/* Content lines */}
                    <div className="mt-3 flex flex-col gap-2">
                        <Skeleton className="h-3.5 w-full" />
                        <Skeleton className="h-3.5 w-3/5" />
                    </div>
                </div>

                {/* Action buttons */}
                <div className="mt-2 flex items-center gap-5 pl-2">
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>
        </div>
    );
};

export default CommentCardSkeleton;