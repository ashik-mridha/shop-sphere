import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import LazyImage from "../ui/LazyImage";

const FOCUSABLE = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

export default function Lightbox({ images, title, alts, index, onIndex, onClose }) {
    const dialog = useRef(null);
    const touchX = useRef(null);
    const count = images.length;

    const go = (delta) => onIndex((index + delta + count) % count);

    useEffect(() => {
        const previous = document.activeElement;
        const overflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        dialog.current?.querySelector("button")?.focus();
        return () => {
            document.body.style.overflow = overflow;
            previous?.focus?.();
        };
    }, []);

    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") onClose();
            else if (e.key === "ArrowLeft" && count > 1) go(-1);
            else if (e.key === "ArrowRight" && count > 1) go(1);
            else if (e.key === "Tab" && dialog.current) {
                const items = [...dialog.current.querySelectorAll(FOCUSABLE)];
                if (!items.length) return;
                const first = items[0];
                const last = items[items.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    });

    function onTouchEnd(e) {
        if (touchX.current == null || count < 2) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    }

    const navBtn = "absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-fg shadow hover:bg-surface";

    return createPortal(
        <div ref={dialog} role="dialog" aria-modal="true" aria-label={`${title} photo gallery`} className="fixed inset-0 z-[80] flex flex-col bg-black/90">
            <div className="flex items-center justify-between px-4 py-3 text-sm text-white">
                <p aria-live="polite">Image {index + 1} of {count}</p>
                <button type="button" onClick={onClose} aria-label="Close gallery" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25">
                    <X size={20} />
                </button>
            </div>

            <div
                className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6"
                onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
                onTouchEnd={onTouchEnd}
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <LazyImage
                    eager
                    src={images[index]}
                    label={title}
                    alt={alts?.[index] || `${title}, image ${index + 1} of ${count}`}
                    className="max-h-full max-w-full select-none rounded-lg object-contain"
                    draggable={false}
                />
                {count > 1 && (
                    <>
                        <button type="button" onClick={() => go(-1)} aria-label="Previous image" className={`${navBtn} left-3`}><ChevronLeft size={22} /></button>
                        <button type="button" onClick={() => go(1)} aria-label="Next image" className={`${navBtn} right-3`}><ChevronRight size={22} /></button>
                    </>
                )}
            </div>
        </div>,
        document.body
    );
}
