import { Skeleton } from "@/components"

interface IconsSkeletonProps {
    isOwnProfile: boolean;
};

const IconsSkeleton = ({ isOwnProfile }: IconsSkeletonProps) => {
    return (
        <>
            {!isOwnProfile && <Skeleton className="w-9 h-9 shrink-0 rounded-full!" />}
            <Skeleton className="w-9 h-9 shrink-0 rounded-full!" />
            <Skeleton className={`${isOwnProfile ? 'w-[122.31px]' : 'w-22.5'} h-9 sm:h-full rounded-full! sm:px-5`} />
        </>
    )
}

export default IconsSkeleton;