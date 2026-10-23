import { ChevronLeft, ChevronRight } from "lucide-react";

function pageList(page, pages) {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    const set = new Set([1, pages, page, page - 1, page + 1]);
    if (page <= 3) [2, 3, 4].forEach((n) => set.add(n));
    if (page >= pages - 2) [pages - 1, pages - 2, pages - 3].forEach((n) => set.add(n));
    const sorted = [...set].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
    const out = [];
    sorted.forEach((n, i) => {
        if (i && n - sorted[i - 1] > 1) out.push("…");
        out.push(n);
    });
    return out;
}

const btn = "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition-colors";

export default function Pagination({ page, pages, onChange, className = "" }) {
    if (!pages || pages <= 1) return null;
    return (
        <nav aria-label="Pagination" className={`flex flex-wrap items-center justify-center gap-1.5 ${className}`}>
            <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => onChange(page - 1)} className={`${btn} border border-line bg-surface hover:bg-surface-2 disabled:opacity-40`}>
                <ChevronLeft size={16} />
            </button>
            {pageList(page, pages).map((n, i) =>
                n === "…" ? (
                    <span key={`gap-${i}`} className="px-1 text-muted" aria-hidden="true">…</span>
                ) : (
                    <button
                        key={n}
                        type="button"
                        onClick={() => onChange(n)}
                        aria-label={`Page ${n}`}
                        aria-current={n === page ? "page" : undefined}
                        className={`${btn} ${n === page ? "bg-primary text-primary-fg" : "border border-line bg-surface hover:bg-surface-2"}`}
                    >
                        {n}
                    </button>
                )
            )}
            <button type="button" aria-label="Next page" disabled={page >= pages} onClick={() => onChange(page + 1)} className={`${btn} border border-line bg-surface hover:bg-surface-2 disabled:opacity-40`}>
                <ChevronRight size={16} />
            </button>
        </nav>
    );
}
