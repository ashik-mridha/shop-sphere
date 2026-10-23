import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const sizes = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl" };
const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function Modal({ open, onClose, title, children, footer, size = "md" }) {
    const panel = useRef(null);
    const titleId = useId();

    useEffect(() => {
        if (!open) return undefined;
        const previous = document.activeElement;
        const overflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        panel.current?.querySelector(FOCUSABLE)?.focus();

        function onKey(e) {
            if (e.key === "Escape") onClose?.();
            if (e.key !== "Tab" || !panel.current) return;
            const items = [...panel.current.querySelectorAll(FOCUSABLE)];
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
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = overflow;
            previous?.focus?.();
        };
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-4">
            <div className="absolute inset-0 bg-black/55" onClick={onClose} aria-hidden="true" />
            <div
                ref={panel}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className={`relative flex max-h-[92vh] w-full flex-col rounded-t-2xl border border-line bg-surface shadow-2xl sm:rounded-2xl ${sizes[size]}`}
            >
                <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
                    <h2 id={titleId} className="text-lg font-bold">{title}</h2>
                    <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-lg p-1.5 text-muted hover:bg-surface-2">
                        <X size={20} />
                    </button>
                </div>
                <div className="overflow-y-auto px-5 py-5">{children}</div>
                {footer && <div className="flex flex-wrap justify-end gap-3 border-t border-line px-5 py-4">{footer}</div>}
            </div>
        </div>,
        document.body
    );
}
