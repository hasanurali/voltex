interface SentinelLoadingItemProps {
    ref: React.Ref<HTMLDivElement>;
    isFetchingNextPage: boolean;
    hasNextPage: boolean;
    hasItems: boolean;
};


const SentinelLoadingItem = ({ ref, isFetchingNextPage, hasNextPage, hasItems }: SentinelLoadingItemProps) => {
    return (
        <div ref={ref} className="py-6 w-full flex justify-center items-center shrink-0 mt-4">
            {
                isFetchingNextPage ? (
                    <p className="text-xs text-secondary-400 animate-pulse">Loading more...</p>
                ) : (
                    !hasNextPage && hasItems ? (
                        <p className="text-xs font-medium text-secondary-400 tracking-wide">
                            You've reached the end of the list
                        </p>
                    ) :
                        null
                )
            }
        </div>
    )
};

export default SentinelLoadingItem;