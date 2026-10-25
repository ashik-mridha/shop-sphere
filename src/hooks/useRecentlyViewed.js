import { useEffect, useState } from "react";

const KEY = "shopsphere_recently_viewed";
const MAX = 8;

function read() {
    try {
        const parsed = JSON.parse(localStorage.getItem(KEY) || "[]");
        return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string" && /^[a-f\d]{24}$/i.test(id)) : [];
    } catch {
        return [];
    }
}

/**
 * Remembers the last 8 viewed product ids (ids only: price, stock and photos are always re-fetched fresh).
 * Returns the ids viewed BEFORE this visit, without the current product.
 */
export default function useRecentlyViewed(currentId) {
    const [previous] = useState(() => read().filter((id) => id !== currentId).slice(0, MAX));

    useEffect(() => {
        if (!currentId) return;
        try {
            const next = [currentId, ...read().filter((id) => id !== currentId)].slice(0, MAX);
            localStorage.setItem(KEY, JSON.stringify(next));
        } catch {
            // storage unavailable: feature quietly disabled
        }
    }, [currentId]);

    return previous;
}
