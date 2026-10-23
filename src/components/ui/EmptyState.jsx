export default function EmptyState({ icon: Icon, title, description, action, className = "" }) {
    return (
        <div className={`flex flex-col items-center rounded-xl border border-dashed border-line bg-surface px-6 py-14 text-center ${className}`}>
            {Icon && (
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Icon size={26} aria-hidden="true" />
                </span>
            )}
            <h2 className="text-lg font-bold">{title}</h2>
            {description && <p className="mt-1.5 max-w-md text-sm text-muted">{description}</p>}
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}

export function ErrorState({ message, onRetry }) {
    return (
        <div role="alert" className="flex flex-col items-center rounded-xl border border-danger/30 bg-danger-soft px-6 py-10 text-center">
            <h2 className="text-lg font-bold text-danger">We couldn’t load this</h2>
            <p className="mt-1.5 max-w-md text-sm text-fg/80">{message || "Something went wrong. Please try again."}</p>
            {onRetry && (
                <button type="button" onClick={onRetry} className="mt-4 rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white dark:text-black">
                    Try again
                </button>
            )}
        </div>
    );
}
