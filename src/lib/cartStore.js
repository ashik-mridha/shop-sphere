import { useSyncExternalStore } from "react";
import { CART_KEY } from "./config";

/*
  Guest-friendly cart kept in localStorage.
  Stored items are only { productId, quantity, variant } plus a display snapshot (title, slug, image, price) used for
  instant rendering. Prices that are actually charged are ALWAYS recomputed by the server (POST /api/cart/quote).
*/
const EMPTY = { items: [], couponCode: "" };
let state = read();
const listeners = new Set();

function read() {
    try {
        const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "null");
        if (!parsed || !Array.isArray(parsed.items)) return EMPTY;
        return {
            items: parsed.items
                .filter((i) => i && typeof i.productId === "string")
                .map((i) => ({ ...i, quantity: Math.min(99, Math.max(1, Math.floor(Number(i.quantity)) || 1)) })),
            couponCode: typeof parsed.couponCode === "string" ? parsed.couponCode : "",
        };
    } catch {
        return EMPTY;
    }
}

function commit(next) {
    state = next;
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(state));
    } catch {
        // storage unavailable (private mode / quota): cart still works for this session
    }
    listeners.forEach((l) => l());
}

const lineKey = (i) => `${i.productId}|${i.variant?.size || ""}|${i.variant?.color || ""}`;

export const cartStore = {
    subscribe(listener) {
        listeners.add(listener);
        const onStorage = (e) => {
            if (e.key === CART_KEY) {
                state = read();
                listener();
            }
        };
        window.addEventListener("storage", onStorage);
        return () => {
            listeners.delete(listener);
            window.removeEventListener("storage", onStorage);
        };
    },
    getSnapshot: () => state,

    /** item: { productId, slug, title, image, price, variant?, quantity? } */
    add(item, quantity = 1) {
        const items = [...state.items];
        const index = items.findIndex((i) => lineKey(i) === lineKey(item));
        if (index >= 0) items[index] = { ...items[index], quantity: Math.min(99, items[index].quantity + quantity) };
        else items.push({ ...item, quantity: Math.min(99, quantity) });
        commit({ ...state, items });
    },
    setQuantity(key, quantity) {
        const q = Math.min(99, Math.max(1, Math.floor(quantity) || 1));
        commit({ ...state, items: state.items.map((i) => (lineKey(i) === key ? { ...i, quantity: q } : i)) });
    },
    remove(key) {
        commit({ ...state, items: state.items.filter((i) => lineKey(i) !== key) });
    },
    setCoupon(couponCode) {
        commit({ ...state, couponCode: (couponCode || "").trim().toUpperCase() });
    },
    clear() {
        commit(EMPTY);
    },
    lineKey,
};

/** const { items, couponCode, count, add, remove, setQuantity, setCoupon, clear, lineKey } = useCart() */
export default function useCart() {
    const snapshot = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot);
    return {
        ...snapshot,
        count: snapshot.items.reduce((n, i) => n + i.quantity, 0),
        add: cartStore.add,
        remove: cartStore.remove,
        setQuantity: cartStore.setQuantity,
        setCoupon: cartStore.setCoupon,
        clear: cartStore.clear,
        lineKey: cartStore.lineKey,
    };
}
