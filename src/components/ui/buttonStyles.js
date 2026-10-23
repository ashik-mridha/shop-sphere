const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition-colors select-none " +
    "disabled:cursor-not-allowed disabled:opacity-55";

const variants = {
    primary: "bg-primary text-primary-fg hover:bg-primary-hover",
    secondary: "bg-surface-2 text-fg hover:bg-line",
    outline: "border border-line bg-surface text-fg hover:bg-surface-2",
    ghost: "text-fg hover:bg-surface-2",
    accent: "bg-accent text-white hover:opacity-90 dark:text-black",
    danger: "bg-danger text-white hover:opacity-90 dark:text-black",
    "danger-soft": "bg-danger-soft text-danger hover:opacity-80",
};

const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-7 text-base",
    icon: "h-10 w-10",
};

export function buttonClasses({ variant = "primary", size = "md", className = "" } = {}) {
    return `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim();
}
