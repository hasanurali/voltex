import { Skeleton } from '@/components'

const UserInfoSkeleton = () => {
    return (
        <div className='flex flex-col gap-2.25'>
            <Skeleton className='w-25 h-4 rounded-sm! mt-1' />
            <Skeleton className='w-10 h-2.75 rounded-sm!' />
        </div>
    )
};

export default UserInfoSkeleton;