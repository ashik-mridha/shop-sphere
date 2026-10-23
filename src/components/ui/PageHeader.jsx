export default function PageHeader({ title, description, actions, className = "" }) {
    return (
        <div className={`mb-6 flex flex-wrap items-end justify-between gap-4 ${className}`}>
            <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
                {description && <p className="mt-1 text-sm text-muted sm:text-base">{description}</p>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
    );
}

export function SectionHeader({ eyebrow, title, description, action }) {
    return (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
                {eyebrow && <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">{eyebrow}</p>}
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
                {description && <p className="mt-1 text-sm text-muted">{description}</p>}
            </div>
            {action}
        </div>
    );
}
