interface LogoProps {
    size?: number;
}

const Logo = ({ size = 32 }: LogoProps) => (
    <svg width={size} height={size} viewBox="0 0 96 96" role="img" aria-label="Voltex logo">
        <rect x="4" y="4" width="88" height="88" rx="20" fill="currentColor" />
        <g transform="translate(16,16) scale(2.667)">
            <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z" fill="white" />
        </g>
    </svg>
);

export default Logo;