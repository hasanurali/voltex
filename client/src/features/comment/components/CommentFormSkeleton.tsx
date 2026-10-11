import { Skeleton } from '@/components'

const CommentFormSkeleton = () => {
    return (
        <section className="border-b border-secondary-200 py-5">
            <div className="flex items-start gap-3">
                <Skeleton className="h-11 w-11 rounded-full! shrink-0" />

                <div className="w-full my-auto">
                    <Skeleton className="h-6 w-full rounded" />
                </div>
            </div>

            <div className="mt-2 pl-14 flex w-full items-center justify-between">
                <Skeleton className="h-5 w-5 rounded-full!" />
                <Skeleton className="h-8 w-16 rounded-full!" />
            </div>
        </section>
    )
};

export default CommentFormSkeleton;