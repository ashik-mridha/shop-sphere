
import { useCallback, useEffect, useState } from "react";

const CART_KEY = "shopsphere_cart";

function getCartCount() {
    try {
        const saved = localStorage.getItem(CART_KEY);
        const cart = JSON.parse(saved || "[]");

        if (!Array.isArray(cart)) {
            return 0;
        }

        return cart.reduce((total, item) => {
            const quantity = Number(item?.quantity) || 1;

            if (!Number.isFinite(quantity) || quantity < 1) {
                return total;
            }

            return total + Math.min(99, Math.floor(quantity));
        }, 0);
    } catch (error) {
        console.error("Failed to read cart:", error);
        return 0;
    }
}

export default function useCartCount() {
    const [count, setCount] = useState(getCartCount);

    const updateCount = useCallback(() => {
        setCount(getCartCount());
    }, []);

    useEffect(() => {
        // Listen for cart updates in the current tab
        window.addEventListener("cartUpdated", updateCount);

        // Listen for localStorage changes in other tabs
        window.addEventListener("storage", updateCount);

        // Refresh when the user returns to the tab
        window.addEventListener("focus", updateCount);

        // Sync on page visibility change
        document.addEventListener("visibilitychange", updateCount);

        // Sync when the hook mounts
        updateCount();

        return () => {
            window.removeEventListener("cartUpdated", updateCount);
            window.removeEventListener("storage", updateCount);
            window.removeEventListener("focus", updateCount);
            document.removeEventListener(
                "visibilitychange",
                updateCount
            );
        };
    }, [updateCount]);

    return count;
}
