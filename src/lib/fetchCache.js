// Small in-memory cache for public catalogue GETs (products, categories, stats...). Anything user-specific,
// admin or review related is never cached, and every successful write (POST/PATCH/DELETE) clears it.
const TTL = 2 * 60 * 1000;
const store = new Map();

const PUBLIC = /^\/(products|categories|stats\/public|coupons\/public|faqs|reviews\/featured)(\/|\?|$)/;

export const isCacheable = (url) => PUBLIC.test(url) && !url.includes("/reviews");

export function readCache(url) {
    const hit = store.get(url);
    if (!hit) return null;
    if (Date.now() - hit.at > TTL) {
        store.delete(url);
        return null;
    }
    return hit;
}

export function writeCache(url, data) {
    if (isCacheable(url)) store.set(url, { data, at: Date.now() });
}

export const clearFetchCache = () => store.clear();
