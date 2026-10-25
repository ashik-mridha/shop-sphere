import { useCallback, useEffect, useState } from "react";
import { api, withParams } from "../lib/api";
import { isCacheable, readCache, writeCache } from "../lib/fetchCache";

/**
 * GET helper. `data` keeps the previous result while a new request is in flight (good for pagination),
 * `loading` is true until the current key has resolved. Public catalogue requests are cached for 2 minutes
 * (cleared by any successful write); refetch() always goes to the server.
 *   const { data, loading, error, refetch } = useFetch("/products", { params: { page } });
 * The API envelope is returned as-is: data.data, data.pagination ...
 */
export default function useFetch(path, { params, enabled = true } = {}) {
    const [state, setState] = useState({ key: null, data: null, error: null });
    const [nonce, setNonce] = useState(0);

    const url = path ? withParams(path, params) : null;
    const key = `${url}#${nonce}`;
    const active = Boolean(enabled && url);
    const cached = active && nonce === 0 && isCacheable(url) ? readCache(url) : null;
    const hasCached = Boolean(cached);

    useEffect(() => {
        if (!active || hasCached) return undefined;
        const controller = new AbortController();

        api
            .get(url, { signal: controller.signal })
            .then((data) => {
                writeCache(url, data);
                setState({ key, data, error: null });
            })
            .catch((error) => {
                if (error.name !== "AbortError") setState((prev) => ({ key, data: prev.data, error }));
            });

        return () => controller.abort();
    }, [active, hasCached, url, key]);

    const refetch = useCallback(() => setNonce((n) => n + 1), []);

    if (cached) return { data: cached.data, error: null, loading: false, refetch };

    return {
        data: state.data,
        error: state.key === key ? state.error : null,
        loading: active && state.key !== key,
        refetch,
    };
}
