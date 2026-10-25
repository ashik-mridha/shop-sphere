import { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import LazyImage from "../ui/LazyImage";
import Lightbox from "./Lightbox";
import { imgSrcSet, smallVariant } from "../../lib/productImages";

const finePointer = () => window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;

export default function Gallery({ images, title, alts = [], credits = [] }) {
    const list = images?.length ? images : [];
    const [active, setActive] = useState(0);
    const [open, setOpen] = useState(false);
    const [zoom, setZoom] = useState(null); // { x, y } in % while hovering with a mouse
    const index = Math.min(active, Math.max(list.length - 1, 0));
    const current = list[index];
    const step = (d) => setActive((index + d + list.length) % list.length);

    function onMove(e) {
        if (!finePointer()) return;
        const r = e.currentTarget.getBoundingClientRect();
        setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
    }

    const arrow = "absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-fg shadow hover:bg-surface";

    return (
        <div>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    onMouseMove={onMove}
                    onMouseLeave={() => setZoom(null)}
                    aria-label={`Open ${alts[index] || `${title} photo ${index + 1}`} of ${list.length} full screen`}
                    className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-xl border border-line bg-surface-2"
                >
                    <LazyImage
                        eager
                        key={current}
                        src={current}
                        srcSet={imgSrcSet(current)}
                        sizes="(min-width: 1024px) 560px, 100vw"
                        width={1200}
                        height={1200}
                        fetchPriority={index === 0 ? "high" : undefined}
                        label={title}
                        alt={alts[index] || `${title}, image ${index + 1} of ${list.length || 1}`}
                        draggable={false}
                        className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-150"
                        style={zoom ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
                    />
                    <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-surface/90 px-3 py-1.5 text-xs font-semibold shadow">
                        <Maximize2 size={14} aria-hidden="true" /> Zoom
                    </span>
                </button>

                {list.length > 1 && (
                    <>
                        <button type="button" onClick={() => step(-1)} aria-label="Previous image" className={`${arrow} left-3`}><ChevronLeft size={20} /></button>
                        <button type="button" onClick={() => step(1)} aria-label="Next image" className={`${arrow} right-3`}><ChevronRight size={20} /></button>
                        <p className="pointer-events-none absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-xs font-semibold shadow" aria-hidden="true">{index + 1} / {list.length}</p>
                    </>
                )}
            </div>

            {list.length > 1 && (
                <ul className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5" aria-label="Product images">
                    {list.map((src, i) => (
                        <li key={src}>
                            <button
                                type="button"
                                onClick={() => setActive(i)}
                                aria-label={`Show image ${i + 1} of ${list.length}`}
                                aria-current={i === index}
                                className={`block aspect-square w-full overflow-hidden rounded-lg border-2 bg-surface-2 ${i === index ? "border-primary" : "border-line hover:border-muted"}`}
                            >
                                <LazyImage src={smallVariant(src, 300)} alt="" label={title} width={200} height={200} className="h-full w-full object-cover" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {credits[index]?.creator && (
                <p className="mt-2 text-xs text-muted">
                    Photo:{" "}
                    {credits[index].sourceUrl ? (
                        <a href={credits[index].sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                            {credits[index].creator}
                        </a>
                    ) : (
                        credits[index].creator
                    )}
                    {credits[index].license ? ` (${credits[index].license})` : ""}
                </p>
            )}

            {open && <Lightbox images={list} title={title} alts={alts} index={index} onIndex={setActive} onClose={() => setOpen(false)} />}
        </div>
    );
}
