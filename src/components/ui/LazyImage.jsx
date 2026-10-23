import { useState } from "react";
import { ImageOff } from "lucide-react";

/** Lazy-loaded image with a neutral fallback if the URL is broken. Parent controls size/aspect. */
export default function LazyImage({ src, alt, className = "", eager = false, ...props }) {
    const [failedSrc, setFailedSrc] = useState(null);

    if (!src || failedSrc === src) {
        return (
            <div role="img" aria-label={alt} className={`flex items-center justify-center bg-surface-2 text-muted ${className}`}>
                <ImageOff size={28} aria-hidden="true" />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            onError={() => setFailedSrc(src)}
            className={className}
            {...props}
        />
    );
}
