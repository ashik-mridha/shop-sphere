import { srcSetFor, thumb } from "./images";

/** Smaller rendition of a catalog photo (Unsplash ?w=, Flickr _z); other URLs pass through unchanged. */
export const smallVariant = (src, width = 600) => (typeof src === "string" ? thumb(src, width) : src);

/** srcset for hosts that can resize, undefined otherwise. */
export const imgSrcSet = (src) => (typeof src === "string" ? srcSetFor(src) : undefined);

export const absoluteUrl = (path) => (/^https?:\/\//.test(path) ? path : `${window.location.origin}${path}`);
