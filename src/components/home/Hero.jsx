import { RotateCcw, ShieldCheck, Star, Truck } from "lucide-react";
import { LinkButton } from "../ui/Button";
import HeroCarousel from "./HeroCarousel";
import useFetch from "../../hooks/useFetch";
import { formatNumber } from "../../lib/format";

function HeroStats({ stats }) {
    if (!stats) return null;
    const items = [
        [stats.products, "products in the catalogue"],
        [stats.customers, "registered customers"],
        [stats.deliveredOrders, "orders delivered"],
        [stats.reviews, "verified reviews"],
    ].filter(([value]) => value > 0);
    if (!items.length) return null;

    return (
        <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4">
            {items.map(([value, label]) => (
                <div key={label} className="bg-surface/90 px-4 py-4 text-center backdrop-blur">
                    <dd className="text-2xl font-extrabold text-primary sm:text-3xl">{formatNumber(value)}</dd>
                    <dt className="mt-0.5 text-xs text-muted sm:text-sm">{label}</dt>
                </div>
            ))}
        </dl>
    );
}

export default function Hero() {
    const { data } = useFetch("/stats/public");
    const stats = data?.data;

    const trust = [
        [Truck, "Free shipping over $75"],
        [RotateCcw, "30-day returns"],
        [ShieldCheck, "Secure Stripe checkout"],
        ...(stats?.averageRating ? [[Star, `${stats.averageRating}/5 from ${formatNumber(stats.reviews)} reviews`]] : []),
    ];

    return (
        <section
            aria-labelledby="hero-title"
            className="relative isolate -mt-6 w-screen overflow-hidden border-b border-line bg-surface [margin-inline:calc(50%-50vw)] sm:-mt-8"
        >
            {/* soft brand glow behind the content */}
            <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 -z-10 h-[34rem] w-[34rem] rounded-full bg-primary/15 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-24 -z-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
                <div className="grid items-center gap-10 lg:min-h-[min(70vh,640px)] lg:grid-cols-[1.05fr_1fr] lg:gap-14">
                    <div className="animate-[heroIn_700ms_ease-out_both] motion-reduce:animate-none">
                        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                            <Truck size={14} aria-hidden="true" /> Free shipping over $75
                        </p>
                        <h1 id="hero-title" className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                            Tech and everyday essentials, <span className="text-primary">chosen to last.</span>
                        </h1>
                        <p className="mt-5 max-w-xl text-base text-muted sm:text-lg">
                            Laptops, audio, smart-home gear and daily carry from brands we trust. Pay securely with Stripe and return anything unused within 30 days.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <LinkButton to="/shop" size="lg" className="shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5 motion-reduce:hover:translate-y-0">Shop now</LinkButton>
                            <LinkButton to="/shop?onSale=true&sort=discount" size="lg" variant="outline">View deals</LinkButton>
                        </div>
                        <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-2.5 text-sm text-muted sm:grid-cols-2">
                            {trust.map(([Icon, text]) => (
                                <li key={text} className="flex items-center gap-2">
                                    <Icon size={16} className="shrink-0 text-primary" aria-hidden="true" />
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="animate-[heroIn_900ms_ease-out_120ms_both] motion-reduce:animate-none">
                        <HeroCarousel />
                    </div>
                </div>

                <HeroStats stats={stats} />
            </div>
        </section>
    );
}
