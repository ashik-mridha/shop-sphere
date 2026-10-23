import { Loader2 } from "lucide-react";

export default function Spinner({ label = "Loading", className = "" }) {
    return (
        <div role="status" className={`flex items-center justify-center gap-2 py-10 text-muted ${className}`}>
            <Loader2 className="animate-spin text-primary" size={22} aria-hidden="true" />
            <span className="text-sm">{label}…</span>
        </div>
    );
}
