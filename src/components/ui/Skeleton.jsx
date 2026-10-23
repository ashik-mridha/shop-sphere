export default function Skeleton({ className = "" }) {
    return <div aria-hidden="true" className={`skeleton rounded-lg ${className}`} />;
}

export function ProductCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border border-line bg-surface" aria-hidden="true">
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="space-y-3 p-4">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    );
}

export function ProductGridSkeleton({ count = 8 }) {
    return (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4" role="status" aria-label="Loading products">
            {Array.from({ length: count }, (_, i) => <ProductCardSkeleton key={i} />)}
        </div>
    );
}

export function TableSkeleton({ rows = 6, cols = 5 }) {
    return (
        <div className="space-y-2 rounded-xl border border-line bg-surface p-4" role="status" aria-label="Loading">
            {Array.from({ length: rows }, (_, r) => (
                <div key={r} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                    {Array.from({ length: cols }, (_, c) => <Skeleton key={c} className="h-8" />)}
                </div>
            ))}
        </div>
    );
}
