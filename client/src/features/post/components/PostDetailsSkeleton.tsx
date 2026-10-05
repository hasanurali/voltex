import { Skeleton } from '@/components/feedback';

const PostDetailsSkeleton = () => {
    return (
        <div className="w-full min-w-0 flex-1 px-4 pb-20 pt-4 sm:px-6 sm:pt-6 lg:px-8">
            <div className="mx-auto w-full min-w-0 max-w-5xl">

                <div className="flex w-full min-w-0 flex-col">

                    {/* Author and content section*/}
                    <section className="min-w-0 py-5 sm:py-7">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-11 w-11 rounded-full! shrink-0" />
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>

                        <div className="mt-4 flex flex-col gap-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/5" />
                        </div>

                        <div className="mt-3 flex gap-2">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                    </section>

                    {/* Media */}
                    <Skeleton className="w-full min-w-0 h-64 sm:h-80 md:h-96 rounded-xl" />

                    {/* Details/engagement row */}
                    <section className="flex items-center justify-between gap-2 py-4">
                        <Skeleton className="h-3 w-28" />
                        <div className="flex gap-3">
                            <Skeleton className="h-4 w-14" />
                            <Skeleton className="h-4 w-14" />
                        </div>
                    </section>

                    {/* Discussion heading */}
                    <section className="border-t border-secondary-200 py-5">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="mt-3 h-4 w-40" />
                    </section>

                </div>
            </div>
        </div>
    );
};

export default PostDetailsSkeleton;