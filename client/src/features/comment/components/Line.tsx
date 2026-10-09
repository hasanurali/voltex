interface LineProps {
    className?: string;
};


const Line = ({ className = '' }: LineProps) => {
    return (
        <div className={`h-full border-l border-secondary-200 ${className}`} />
    )
};

export default Line;