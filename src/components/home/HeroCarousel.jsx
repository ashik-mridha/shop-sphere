import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import useFetch from "../../hooks/useFetch";
import ProductImage from "../shop/ProductImage";
import StarRating from "../ui/StarRating";
import { formatMoney } from "../../lib/format";

const INTERVAL = 6000;
const MAX_SLIDES = 4;

function slideLabel(p) {
    if (p.isNew) return "New arrival";
    if (p.discountPercent > 0) return `Deal · ${p.discountPercent}% off`;
    return "Featured";
}

function useReducedMotion() {
    const [reduced, setReduced] = useState(() => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
    useEffect(() => {
        const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
        if (!mq) return undefined;
        const onChange = () => setReduced(mq.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);
    return reduced;
}

/** Slides come from the catalogue: featured products first, then discounted and new ones. */
export default function HeroCarousel() {
    const featured = useFetch("/products", { params: { featured: "true", limit: 6, sort: "popular" } });
    const deals = useFetch("/products", { params: { onSale: "true", limit: 4, sort: "discount" } });
    const loading = featured.loading || deals.loading;

    const slides = useMemo(() => {
        const seen = new Set();
        return [...(featured.data?.data || []), ...(deals.data?.data || [])]
            .filter((p) => p.image && !seen.has(p._id) && seen.add(p._id))
            .slice(0, MAX_SLIDES);
    }, [featured.data, deals.data]);

    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [userPaused, setUserPaused] = useState(false);
    const reduced = useReducedMotion();
    const touchStart = useRef(null);
    const count = slides.length;
    const current = count ? index % count : 0;
    const playing = count > 1 && !paused && !userPaused && !reduced;

    const go = useCallback((n) => setIndex((i) => (count ? (i + n + count) % count : 0)), [count]);

    useEffect(() => {
        if (!playing) return undefined;
        const id = setInterval(() => {
            if (!document.hidden) setIndex((i) => i + 1);
        }, INTERVAL);
        return () => clearInterval(id);
    }, [playing, current]);

    function onKeyDown(e) {
        if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    }

    function onPointerDown(e) {
        touchStart.current = e.clientX;
    }

    function onPointerUp(e) {
        if (touchStart.current == null) return;
        const dx = e.clientX - touchStart.current;
        touchStart.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    }

    if (loading) return <div aria-hidden="true" className="skeleton aspect-[4/5] w-full rounded-2xl sm:aspect-[5/4] lg:aspect-square" />;

    if (!count) {
        return (
            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-line bg-surface-2 lg:aspect-square">
                <img src="/logo-mark.svg" alt="" width="96" height="124" className="h-28 w-auto opacity-80" />
            </div>
        );
    }

    return (
        <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured products"
            onKeyDown={onKeyDown}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
            className="relative"
        >
            <div
                className="relative aspect-[4/5] touch-pan-y overflow-hidden rounded-2xl border border-line bg-surface-2 shadow-xl sm:aspect-[5/4] lg:aspect-square"
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onPointerCancel={() => (touchStart.current = null)}
                aria-live={playing ? "off" : "polite"}
            >
                {slides.map((p, i) => {
                    const active = i === current;
                    return (
                        <article
                            key={p._id}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`${i + 1} of ${count}: ${p.title}`}
                            aria-hidden={!active}
                            inert={!active}
                            className={`absolute inset-0 transition-all duration-700 ease-out motion-reduce:transition-none ${active ? "translate-x-0 opacity-100" : i < current ? "-translate-x-6 opacity-0" : "translate-x-6 opacity-0"}`}
                        >
                            <ProductImage src={p.image} alt={p.imageAlts?.[0] || p.title} label={p.title} eager={i === 0} sizes="(min-width:1024px) 45vw, 100vw" width={1200} height={1200} />
                            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                            <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-fg shadow">
                                {slideLabel(p)}
                            </span>

                            <div className="absolute inset-x-3 bottom-3 rounded-xl border border-white/15 bg-black/55 p-4 text-white backdrop-blur-md sm:inset-x-5 sm:bottom-5">
                                <p className="text-xs font-medium uppercase tracking-wide text-white/70">{p.brand || p.category}</p>
                                <h3 className="mt-0.5 line-clamp-1 text-lg font-bold sm:text-xl">{p.title}</h3>
                                <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex flex-wrap items-baseline gap-x-2">
                                        <span className="text-2xl font-extrabold">{formatMoney(p.price)}</span>
                                        {p.compareAtPrice > p.price && <span className="text-sm text-white/65 line-through">{formatMoney(p.compareAtPrice)}</span>}
                                        {p.discountPercent > 0 && <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">-{p.discountPercent}%</span>}
                                    </div>
                                    {p.reviewCount > 0 && <StarRating value={p.rating} count={p.reviewCount} size={15} />}
                                </div>
                                <Link
                                    to={`/shop/${p.slug || p._id}`}
                                    tabIndex={active ? 0 : -1}
                                    className="mt-3 inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-bold text-black hover:bg-white/90"
                                >
                                    View product <ArrowRight size={15} aria-hidden="true" />
                                </Link>
                            </div>
                        </article>
                    );
                })}
            </div>

            {count > 1 && (
                <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2" role="group" aria-label="Choose slide">
                        {slides.map((p, i) => (
                            <button
                                key={p._id}
                                type="button"
                                aria-label={`Show slide ${i + 1}: ${p.title}`}
                                aria-current={i === current}
                                onClick={() => setIndex(i)}
                                className={`h-2.5 rounded-full transition-all ${i === current ? "w-8 bg-primary" : "w-2.5 bg-line hover:bg-muted"}`}
                            />
                        ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                        {!reduced && (
                            <button type="button" onClick={() => setUserPaused((v) => !v)} aria-label={userPaused ? "Resume slideshow" : "Pause slideshow"} className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface hover:bg-surface-2">
                                {userPaused ? <Play size={15} /> : <Pause size={15} />}
                            </button>
                        )}
                        <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface hover:bg-surface-2">
                            <ChevronLeft size={18} />
                        </button>
                        <button type="button" onClick={() => go(1)} aria-label="Next slide" className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface hover:bg-surface-2">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
