import { useState } from "react";
import { fallbackSrc, responsiveProps } from "../../lib/images";

/**
 * Responsive catalog photo with a shimmer placeholder until it has loaded, and a neutral tile showing the
 * product name if the external image is unavailable. The parent decides the box (aspect-ratio class).
 */
export default function ProductImage({ src, alt = "", label, sizes = "(min-width:1280px) 22vw, (min-width:768px) 30vw, 50vw", eager = false, className = "", width = 600, height = 600 }) {
    const [state, setState] = useState({ src, status: "loading" });
    const status = state.src === src ? state.status : "loading";
    const broken = !src || status === "error";

    return (
        <>
            {status === "loading" && !broken && <span aria-hidden="true" className="skeleton absolute inset-0" />}
            <img
                {...(broken ? { src: fallbackSrc(label || alt) } : responsiveProps(src, sizes))}
                alt={alt}
                width={width}
                height={height}
                loading={eager ? "eager" : "lazy"}
                fetchPriority={eager ? "high" : "auto"}
                decoding="async"
                referrerPolicy="no-referrer"
                onLoad={() => !broken && setState({ src, status: "loaded" })}
                onError={() => !broken && setState({ src, status: "error" })}
                className={`h-full w-full object-cover transition-opacity duration-500 ${status === "loading" && !broken ? "opacity-0" : "opacity-100"} ${className}`}
            />
        </>
    );
}
