import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { api, errorMessage } from "../lib/api";
import useAuth from "../hooks/useAuth";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
    const { user, isPending } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const userId = user?.id ?? null;
    const [loaded, setLoaded] = useState({ userId: null, ids: [] });

    useEffect(() => {
        if (!userId) return undefined;
        let active = true;
        api
            .get("/wishlist")
            .then((res) => active && setLoaded({ userId, ids: res.ids || [] }))
            .catch(() => active && setLoaded({ userId, ids: [] }));
        return () => {
            active = false;
        };
    }, [userId]);

    // ids only count while they belong to the current user (they vanish on logout)
    const ids = useMemo(() => (userId && loaded.userId === userId ? loaded.ids : []), [userId, loaded]);

    const toggle = useCallback(
        async (productId) => {
            if (!userId) {
                toast("Please sign in to save items to your wishlist.");
                navigate("/login", { state: { from: location } });
                return;
            }
            const has = ids.includes(productId);
            const next = has ? ids.filter((i) => i !== productId) : [productId, ...ids];
            setLoaded({ userId, ids: next }); // optimistic
            try {
                if (has) await api.del(`/wishlist/${productId}`);
                else await api.post(`/wishlist/${productId}`);
                toast.success(has ? "Removed from wishlist" : "Saved to wishlist");
            } catch (error) {
                setLoaded({ userId, ids });
                toast.error(errorMessage(error));
            }
        },
        [userId, ids, navigate, location]
    );

    const value = useMemo(
        () => ({ ids, count: ids.length, has: (id) => ids.includes(id), toggle, ready: !isPending }),
        [ids, toggle, isPending]
    );

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWishlist() {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
    return ctx;
}
