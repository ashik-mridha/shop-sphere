import { useEffect } from "react";
import { SITE_NAME } from "../lib/config";

function setMeta(attr, name, content) {
    let el = document.head.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
    }
    el.setAttribute("content", content);
}

/** Per-page <title> and meta description (also mirrored to Open Graph tags). */
export default function usePageMeta(title, description) {
    useEffect(() => {
        const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} – Quality tech and everyday essentials`;
        document.title = fullTitle;
        setMeta("property", "og:title", fullTitle);
        if (description) {
            setMeta("name", "description", description);
            setMeta("property", "og:description", description);
        }
    }, [title, description]);
}
