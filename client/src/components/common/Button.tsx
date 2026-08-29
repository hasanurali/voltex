import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
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

const Button = ({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) => {
    return (
        <button
            className={`rounded-md font-sans font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;