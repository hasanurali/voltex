const AvatarProgressBar = ({ avatarUploadProgress }: { avatarUploadProgress: number }) => {
    return (
        <div
            className='absolute -inset-1 flex items-center justify-center rounded-full bg-black/35'
            role='progressbar'
            aria-label='Avatar upload progress'
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={avatarUploadProgress}
        >

            <svg className='absolute inset-0 h-full w-full -rotate-90' viewBox='0 0 100 100' aria-hidden='true'>
                <circle
                    className='stroke-white/30'
                    cx='50'
                    cy='50'
                    r='46'
                    fill='none'
                    strokeWidth='5'
                />
                <circle
                    className='stroke-white transition-[stroke-dashoffset] duration-300 ease-out'
                    cx='50'
                    cy='50'
                    r='46'
                    fill='none'
                    strokeWidth='5'
                    strokeLinecap='round'
                    strokeDasharray='289'
                    strokeDashoffset={289 - (289 * avatarUploadProgress) / 100}
                />
            </svg>
            <span className='z-10 text-xs font-semibold text-white'>
                {Math.round(avatarUploadProgress)}%
            </span>

        </div>
    )
};

export default AvatarProgressBar;