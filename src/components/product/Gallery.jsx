import { useState } from "react";
import LazyImage from "../ui/LazyImage";

export default function Gallery({ images, title }) {
    const [active, setActive] = useState(0);
    const list = images?.length ? images : [];
    const current = list[Math.min(active, list.length - 1)];

    return (
        <div>
            <div className="aspect-square overflow-hidden rounded-xl border border-line bg-surface-2">
                <LazyImage eager src={current} alt={`${title}, image ${active + 1} of ${list.length || 1}`} className="h-full w-full object-cover" />
            </div>
            {list.length > 1 && (
                <ul className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5" aria-label="Product images">
                    {list.map((src, i) => (
                        <li key={src}>
                            <button
                                type="button"
                                onClick={() => setActive(i)}
                                aria-label={`Show image ${i + 1}`}
                                aria-current={i === active}
                                className={`block aspect-square w-full overflow-hidden rounded-lg border-2 bg-surface-2 ${i === active ? "border-primary" : "border-line hover:border-muted"}`}
                            >
                                <LazyImage src={src} alt="" className="h-full w-full object-cover" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
