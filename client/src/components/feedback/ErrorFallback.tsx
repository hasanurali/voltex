interface ErrorFallbackProps {
    message?: string;
}

const ErrorFallback = ({ message = 'Something went wrong' }: ErrorFallbackProps) => {
    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            {message && <p className="text-gray-500">{message}</p>}
            <button
                className="rounded bg-black px-4 py-2 text-white"
                onClick={() => window.location.reload()}
            >
                Reload
            </button>
        </div>
    );
}

export default ErrorFallback;