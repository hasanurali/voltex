import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

const Input = ({ className = '', error, ...props }: InputProps) => {
    return (
        <div className="flex flex-col gap-1">
            <input
                className={`rounded-md border px-3 py-2 font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed ${error ? 'border-danger' : 'border-border'} ${className}`}
                {...props}
            />
            {error && <span className="text-sm text-danger">{error}</span>}
        </div>
    );
};

export default Input;