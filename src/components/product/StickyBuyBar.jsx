import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import Button from "../ui/Button";
import { formatMoney } from "../../lib/format";

/** Mobile-only add-to-cart bar. It sits above the fixed bottom nav (h-16) and hides while the main buttons are on screen. */
export default function StickyBuyBar({ title, price, disabled, ctaRef, onAdd }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ctaRef.current;
        if (!el || typeof IntersectionObserver === "undefined") return undefined;
        const io = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0), { threshold: 0 });
        io.observe(el);
        return () => io.disconnect();
    }, [ctaRef]);

    if (!visible) return null;
    return (
        <div className="fixed inset-x-0 bottom-16 z-30 border-t border-line bg-surface/95 px-4 py-3 shadow-[0_-4px_16px_rgb(0_0_0/0.08)] backdrop-blur md:hidden">
            <div className="mx-auto flex max-w-7xl items-center gap-3">
                <div className="min-w-0 flex-1">
                    <p className="truncate text-xs text-muted">{title}</p>
                    <p className="text-lg font-extrabold">{formatMoney(price)}</p>
                </div>
                <Button onClick={onAdd} disabled={disabled}>
                    <ShoppingCart size={16} aria-hidden="true" /> Add to cart
                </Button>
            </div>
        </div>
    );
}
