interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeMap = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-10 w-10 border-4',
};

const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => {
    return (
        <div
            role="status"
            aria-label="Loading"
            className={`animate-spin rounded-full border-neutral-200 border-t-primary-950 ${sizeMap[size]} ${className}`}
        />
    );
};

export default Spinner;