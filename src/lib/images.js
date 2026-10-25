// Catalog photos are absolute https URLs on external hosts. These helpers only change the *size* parameters
// (Unsplash ?w=, Flickr _z/_b suffix); every other URL is used exactly as stored.

function parse(url) {
    try {
        return new URL(url);
    } catch {
        return null;
    }
}

/** A smaller rendition for cards and thumbnails. Unknown hosts are returned unchanged. */
export function thumb(url, width = 600) {
    const u = parse(url);
    if (!u) return url;
    if (u.hostname === "images.unsplash.com") {
        u.searchParams.set("w", String(width));
        return u.toString();
    }
    if (u.hostname.endsWith("staticflickr.com") && width <= 640) return url.replace(/_b\.jpg$/, "_z.jpg");
    return url;
}

/** srcset string where the host can resize (Unsplash, Flickr); undefined otherwise. */
export function srcSetFor(url, widths = [400, 800, 1200]) {
    const u = parse(url);
    if (!u) return undefined;
    if (u.hostname === "images.unsplash.com") return widths.map((w) => `${thumb(url, w)} ${w}w`).join(", ");
    if (u.hostname.endsWith("staticflickr.com") && /_b\.jpg$/.test(url)) return `${thumb(url, 640)} 640w, ${url} 1024w`;
    return undefined;
}

export function responsiveProps(src, sizes) {
    if (!src) return { src };
    const srcSet = srcSetFor(src);
    return srcSet ? { src: thumb(src, 800), srcSet, sizes } : { src };
}

/** Inline SVG shown when a photo fails to load, so the product name is still visible. */
export function fallbackSrc(label = "Image unavailable") {
    const text = String(label).replace(/[<>&"']/g, "").slice(0, 48);
    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><rect width="600" height="600" fill="#e6e9ee"/>` +
        `<g fill="none" stroke="#8b94a1" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"><rect x="230" y="215" width="140" height="110" rx="14"/><circle cx="268" cy="253" r="12"/><path d="M236 315l42-40 30 28 24-20 38 32"/></g>` +
        `<text x="300" y="400" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="30" fill="#5b6470">${text}</text></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
