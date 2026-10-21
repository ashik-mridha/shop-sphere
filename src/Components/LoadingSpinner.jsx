
const LoadingSpinner = ({ fullScreen = false, text = "Loading..." }) => {
    return (
        <div
            className={
                fullScreen
                    ? "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0b100e]/90 backdrop-blur-sm"
                    : "flex min-h-[180px] w-full flex-col items-center justify-center"
            }
            role="status"
            aria-live="polite"
        >
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-900 border-t-emerald-400" />

            <p className="mt-3 text-sm font-medium text-emerald-400">
                {text}
            </p>
        </div>
    );
};

export default LoadingSpinner;
