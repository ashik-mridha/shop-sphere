import { Link } from "react-router-dom";
import { SITE_NAME } from "../../lib/config";

export default function Logo({ className = "" }) {
    return (
        <Link to="/" className={`inline-flex items-center gap-2.5 text-lg font-extrabold tracking-tight ${className}`}>
            <img src="/icon.svg" width="36" height="36" alt="ShopSphere logo" className="h-9 w-9 rounded-lg" decoding="async" />
            <span>{SITE_NAME}</span>
        </Link>
    );
}
