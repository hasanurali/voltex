import { useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    showPasswordToggle?: boolean,
    error?: string;
};

const Input = ({ className = '', showPasswordToggle = false, type = 'text', error, ...props }: InputProps) => {

    const [passwordToggle, setPasswordToggle] = useState<boolean>(false);

    return (
        <div className="flex flex-col relative">

            <input
                type={showPasswordToggle ? (passwordToggle ? 'text' : 'password') : type}
                className={`rounded-md border px-3 py-2 ${showPasswordToggle && 'pr-12 '} font-sans text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${error ? 'border-danger' : 'border-border'} ${className}`}
                {...props}
            />

            {showPasswordToggle && <button
                type="button"
                className='absolute right-3.5 top-3.25'
                onClick={() => setPasswordToggle(!passwordToggle)}
            >
                {passwordToggle ? <Eye color='gray' /> : <EyeOff color='gray' />}
            </button>}

            {/* smooth animated error container */}
            <div className={`grid transition-all duration-200 ease-out ${error ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <span className="text-[13px] text-danger block leading-tight">
                        {error}
                    </span>
                </div>
            </div>

        </div>
    );
};

export default Input;