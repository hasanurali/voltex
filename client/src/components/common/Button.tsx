import type { ButtonHTMLAttributes, ReactNode } from 'react';
import Spinner from './Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    children: ReactNode;
};

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-primary-950 text-white hover:bg-primary-800',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
    outline: 'border border-border text-foreground hover:bg-neutral-100',
    ghost: 'text-foreground hover:bg-neutral-100',
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
};

const Button = ({ variant = 'primary', size = 'md', loading = false, className = '', children, ...props }: ButtonProps) => {
    return (
        <button
            className={`flex justify-center items-center gap-3 rounded-md font-sans font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            {...props}
        >
            {loading && <Spinner size="sm" className="border-white/40 border-t-white inline-block" />}
            {children}
        </button>
    );
};

export default Button;