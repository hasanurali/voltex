import React from 'react';

interface ProfileIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
};

const ProfileIconButton = ({ children, className = '', type = 'button', ...props }: ProfileIconButtonProps) => {
    return (
        <button
            type={type}
            className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-sm transition duration-200 hover:scale-110 hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/80 cursor-pointer ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default ProfileIconButton;