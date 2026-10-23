import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { buttonClasses } from "./buttonStyles";

export default function Button({ variant, size, loading = false, disabled, className, children, type = "button", ...props }) {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            className={buttonClasses({ variant, size, className })}
            {...props}
        >
            {loading && <Loader2 className="animate-spin" size={16} aria-hidden="true" />}
            {children}
        </button>
    );
}

export function LinkButton({ to, variant, size, className, children, ...props }) {
    return (
        <Link to={to} className={buttonClasses({ variant, size, className })} {...props}>
            {children}
        </Link>
    );
}
