import { Link } from "react-router-dom";
import { Store } from "lucide-react";
import { SITE_NAME } from "../../lib/config";

export default function Logo({ className = "" }) {
    return (
        <Link to="/" className={`inline-flex items-center gap-2 text-lg font-extrabold tracking-tight ${className}`} aria-label={`${SITE_NAME} home`}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-fg">
                <Store size={20} aria-hidden="true" />
            </span>
            {SITE_NAME}
        </Link>
    );
}
