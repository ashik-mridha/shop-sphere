import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";

/** Server-side pricing for the current cart. Returns { quote, loading, error, refetch }. */
export default function useQuote(items, couponCode) {
    const payload = useMemo(
        () => ({
            items: items.map((i) => ({
                productId: i.productId,
                quantity: i.quantity,
                ...(i.variant && (i.variant.size || i.variant.color) && { variant: i.variant }),
            })),
            couponCode: couponCode || "",
        }),
        [items, couponCode]
    );
    const key = JSON.stringify(payload);
    const [nonce, setNonce] = useState(0);
    const [state, setState] = useState({ key: null, quote: null, error: null });
    const active = payload.items.length > 0;
    const fullKey = `${key}#${nonce}`;

    useEffect(() => {
        if (!active) return undefined;
        let live = true;
        api
            .post("/cart/quote", JSON.parse(key))
            .then((res) => live && setState({ key: fullKey, quote: res.data, error: null }))
            .catch((error) => live && setState((prev) => ({ key: fullKey, quote: prev.quote, error })));
        return () => {
            live = false;
        };
    }, [active, key, fullKey]);

    const refetch = useCallback(() => setNonce((n) => n + 1), []);

    return {
        quote: active ? state.quote : null,
        loading: active && state.key !== fullKey,
        error: state.key === fullKey ? state.error : null,
        refetch,
    };
}
