
import { useState } from "react";

const ProgressiveImage = ({
    src,
    alt = "Product image",
    className = "",
    imageClassName = "h-full w-full object-contain",
}) => {
    const [loading, setLoading] = useState(Boolean(src));
    const [failed, setFailed] = useState(!src);

    const handleLoad = () => {
        setLoading(false);
        setFailed(false);
    };

    const handleError = () => {
        setLoading(false);
        setFailed(true);
    };

    return (
        <div
            className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
        >
            {loading && !failed && (
                <div
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0d1511]"
                    role="status"
                    aria-label="Loading image"
                >
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-900 border-t-emerald-400" />
                    <span className="mt-2 text-xs text-emerald-400">
                        Loading image...
                    </span>
                </div>
            )}

            {failed ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#0d1511] text-gray-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="m21 15-5-5L5 21" />
                    </svg>
                    <span className="text-xs">Image unavailable</span>
                </div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    className={`${imageClassName} ${loading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
                    onLoad={handleLoad}
                    onError={handleError}
                />
            )}
        </div>
    );
};

export default ProgressiveImage;
