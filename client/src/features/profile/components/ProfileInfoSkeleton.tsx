import { Skeleton } from "@/components"

const ProfileInfoSkeleton = () => {
    return (
        <>
            <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-28" />
            </div>

            <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-full max-w-md" />
                <Skeleton className="h-4 w-2/3 max-w-xs" />
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-36" />
            </div>

            <div className="flex gap-4">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
            </div>
        </>
    )
};

export default ProfileInfoSkeleton;
