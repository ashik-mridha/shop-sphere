const tones = {
    neutral: "bg-surface-2 text-muted",
    primary: "bg-primary-soft text-primary",
    success: "bg-primary-soft text-primary",
    warning: "bg-accent-soft text-accent",
    danger: "bg-danger-soft text-danger",
    info: "bg-surface-2 text-fg ring-1 ring-line",
};

export default function Badge({ tone = "neutral", className = "", children }) {
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]} ${className}`}>
            {children}
        </span>
    );
}
