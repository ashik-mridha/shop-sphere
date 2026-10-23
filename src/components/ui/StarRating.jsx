import { Star } from "lucide-react";
import { useState } from "react";

export default function StarRating({ value = 0, count, size = 16, className = "" }) {
    const rounded = Math.round(value * 2) / 2;
    return (
        <div className={`inline-flex items-center gap-1.5 ${className}`} role="img" aria-label={`Rated ${value} out of 5${count != null ? ` from ${count} reviews` : ""}`}>
            <span className="flex" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} className="relative inline-flex">
                        <Star size={size} className="text-line" fill="currentColor" strokeWidth={0} />
                        <span className="absolute inset-0 overflow-hidden text-accent" style={{ width: rounded >= n ? "100%" : rounded >= n - 0.5 ? "50%" : "0%" }}>
                            <Star size={size} fill="currentColor" strokeWidth={0} />
                        </span>
                    </span>
                ))}
            </span>
            {count != null && <span className="text-xs text-muted">({count})</span>}
        </div>
    );
}

export function RatingInput({ value, onChange, label = "Your rating" }) {
    const [hover, setHover] = useState(0);
    const shown = hover || value;
    return (
        <fieldset>
            <legend className="mb-1.5 text-sm font-medium">{label}</legend>
            <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                    <button
                        key={n}
                        type="button"
                        aria-label={`${n} star${n > 1 ? "s" : ""}`}
                        aria-pressed={value === n}
                        onClick={() => onChange(n)}
                        onMouseEnter={() => setHover(n)}
                        className="rounded p-0.5"
                    >
                        <Star size={28} className={n <= shown ? "text-accent" : "text-line"} fill="currentColor" strokeWidth={0} />
                    </button>
                ))}
            </div>
        </fieldset>
    );
}
