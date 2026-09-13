import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/feedback';

interface ImageWithSkeletonProps {
    src?: string;
    alt: string;
    className?: string;
    containerClassName?: string;
};

const ImageWithSkeleton = ({ src, alt, className = '', containerClassName = '' }: ImageWithSkeletonProps) => {

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
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
                    className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
                />
            )}
        </div>
    );
};

export default ImageWithSkeleton;