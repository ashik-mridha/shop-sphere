import { useEffect, useId, useRef, useState } from "react";

/**
 * items: [{ label, onClick, icon?, danger?, to? }] – `to` is rendered by the caller via onClick navigation.
 * trigger: (props) => element, receives { open, buttonProps }.
 */
export default function Dropdown({ trigger, items, align = "right", label = "Menu" }) {
    const [open, setOpen] = useState(false);
    const root = useRef(null);
    const menuId = useId();

    useEffect(() => {
        if (!open) return undefined;
        const onDown = (e) => !root.current?.contains(e.target) && setOpen(false);
        const onKey = (e) => {
            if (e.key === "Escape") setOpen(false);
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                const els = [...(root.current?.querySelectorAll('[role="menuitem"]') || [])];
                const i = els.indexOf(document.activeElement);
                els[(i + (e.key === "ArrowDown" ? 1 : -1) + els.length) % els.length]?.focus();
            }
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <div ref={root} className="relative inline-block text-left">
            {trigger({
                open,
                buttonProps: {
                    type: "button",
                    "aria-haspopup": "menu",
                    "aria-expanded": open,
                    "aria-controls": menuId,
                    "aria-label": label,
                    onClick: () => setOpen((o) => !o),
                },
            })}
            {open && (
                <div
                    id={menuId}
                    role="menu"
                    className={`absolute z-50 mt-2 min-w-48 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-xl ${align === "right" ? "right-0" : "left-0"}`}
                >
                    {items.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                setOpen(false);
                                item.onClick?.();
                            }}
                            className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm hover:bg-surface-2 ${item.danger ? "text-danger" : "text-fg"}`}
                        >
                            {item.icon && <item.icon size={16} aria-hidden="true" />}
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
