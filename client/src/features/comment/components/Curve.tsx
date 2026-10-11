interface CurveProps {
    className?: string;
};


const Curve = ({ className = '' }: CurveProps) => {
    return (
        <div className={`w-6.25 h-5 rounded-bl-2xl border-l border-b border-secondary-200 ${className}`} />
    )
};

export default Curve;