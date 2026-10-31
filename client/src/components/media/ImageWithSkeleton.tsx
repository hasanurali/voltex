import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/feedback';

interface ImageWithSkeletonProps {
    src?: string;
    alt: string;
    className?: string;
    containerClassName?: string;
};

const ImageWithSkeleton = ({ src, alt, className = '', containerClassName = '' }: ImageWithSkeletonProps) => {

    const [isLoaded, setIsLoaded] = useState(() => {
        if (!src) {
            return false;
        };

        const img = new Image();
        img.src = src;

        return img.complete;
    });

    useEffect(() => {
        if (src) {
            const img = new Image();
            img.src = src;

            if (img.complete) {
                setIsLoaded(true);
                return;
            };
        };

        setIsLoaded(false);
    }, [src]);

    return (
        <div className={`relative overflow-hidden ${containerClassName}`}>
            {!isLoaded && <Skeleton className={`absolute z-auto inset-0 ${containerClassName}`} />}
            {src && (
                <img
                    src={src}
                    alt={alt}
                    onLoad={() => setIsLoaded(true)}
                    onError={() => setIsLoaded(true)}
                    className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
                />
            )}
        </div>
    );
};

export default ImageWithSkeleton;