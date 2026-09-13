interface SkeletonProps {
    className?: string;
}

const Skeleton = ({ className = '' }: SkeletonProps) => {

    return <div className={`animate-pulse rounded-md bg-neutral-300 ${className}`} />
};

export default Skeleton;