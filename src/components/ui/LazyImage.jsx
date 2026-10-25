import { useState } from "react";
import { fallbackSrc } from "../../lib/images";

/**
 * Lazy-loaded image. External hosts (Flickr, StockSnap, Unsplash) get no-referrer so hotlink protection does not
 * block them, and a broken URL is replaced with a neutral tile that still shows the product name.
 * The parent controls size/aspect.
 */
export default function LazyImage({ src, alt, label, className = "", eager = false, ...props }) {
    const [failedSrc, setFailedSrc] = useState(null);
    const broken = !src || failedSrc === src;

    return (
        <img
            src={broken ? fallbackSrc(label || alt) : src}
            alt={alt}
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : undefined}
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setFailedSrc(src)}
            className={className}
            {...props}
        />
    );
}
