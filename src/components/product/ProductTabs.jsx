import { useRef } from "react";

/** Accessible tabs: roving tabindex, Left/Right/Home/End keys. tabs: [{ id, label, panel }]. */
export default function ProductTabs({ tabs, active, onChange }) {
    const refs = useRef({});

    function onKeyDown(e, i) {
        const last = tabs.length - 1;
        const next = e.key === "ArrowRight" ? (i + 1) % tabs.length : e.key === "ArrowLeft" ? (i - 1 + tabs.length) % tabs.length : e.key === "Home" ? 0 : e.key === "End" ? last : null;
        if (next == null) return;
        e.preventDefault();
        onChange(tabs[next].id);
        refs.current[tabs[next].id]?.focus();
    }

    return (
        <div id="product-tabs" className="mt-12 scroll-mt-24">
            <div role="tablist" aria-label="Product information" className="flex gap-1 overflow-x-auto border-b border-line">
                {tabs.map((t, i) => {
                    const selected = t.id === active;
                    return (
                        <button
                            key={t.id}
                            ref={(el) => (refs.current[t.id] = el)}
                            role="tab"
                            type="button"
                            id={`tab-${t.id}`}
                            aria-selected={selected}
                            aria-controls={`panel-${t.id}`}
                            tabIndex={selected ? 0 : -1}
                            onClick={() => onChange(t.id)}
                            onKeyDown={(e) => onKeyDown(e, i)}
                            className={`-mb-px shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${selected ? "border-primary text-primary" : "border-transparent text-muted hover:text-fg"}`}
                        >
                            {t.label}
                        </button>
                    );
                })}
            </div>
            {tabs.map((t) => (
                <div key={t.id} role="tabpanel" id={`panel-${t.id}`} aria-labelledby={`tab-${t.id}`} hidden={t.id !== active} tabIndex={0} className="pt-6 focus-visible:outline-offset-4">
                    {t.id === active ? t.panel : null}
                </div>
            ))}
        </div>
    );
}
