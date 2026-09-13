const CoverImageProgressBar = ({ coverImageUploadProgress }: { coverImageUploadProgress: number }) => {
    return (
        <div
            className='absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/45 px-6 text-white'
            role='progressbar'
            aria-label='Cover image upload progress'
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={coverImageUploadProgress}
        >

            <div className='flex items-center gap-2 text-sm font-semibold'>
                <span className='h-2 w-2 animate-pulse rounded-full bg-white' />
                Uploading cover image {Math.round(coverImageUploadProgress)}%
            </div>
            <div className='h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-white/30'>
                <div
                    className='h-full rounded-full bg-white transition-[width] duration-300 ease-out'
                    style={{ width: `${coverImageUploadProgress}%` }}
                />
            </div>
            
        </div>
    )
};

export default CoverImageProgressBar;