import { ShieldCheck, Truck } from "lucide-react";
import { LinkButton } from "../ui/Button";
import LazyImage from "../ui/LazyImage";

export default function Hero() {
    return (
        <section className="overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="grid items-center gap-6 lg:grid-cols-2">
                <div className="p-6 sm:p-10 lg:p-14">
                    <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                        <Truck size={14} aria-hidden="true" /> Free shipping over $75
                    </p>
                    <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                        Tech and everyday essentials, chosen to last.
                    </h1>
                    <p className="mt-4 max-w-xl text-base text-muted sm:text-lg">
                        Laptops, audio, smart-home gear and daily carry from brands we trust. Pay securely with Stripe and return anything unused within 30 days.
                    </p>
                    <div className="mt-7 flex flex-wrap gap-3">
                        <LinkButton to="/shop" size="lg">Shop all products</LinkButton>
                        <LinkButton to="/shop?onSale=true" size="lg" variant="outline">See current deals</LinkButton>
                    </div>
                    <p className="mt-6 inline-flex items-center gap-2 text-sm text-muted">
                        <ShieldCheck size={16} className="text-primary" aria-hidden="true" /> Encrypted checkout. We never see your card details.
                    </p>
                </div>
                <div className="relative aspect-[4/3] bg-surface-2 lg:aspect-auto lg:h-full lg:min-h-[420px]">
                    <LazyImage
                        eager
                        src="/products/zenbook-air-14-laptop.jpg"
                        alt="Zenbook Air 14 laptop with a miniature shopping cart on its keyboard"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </div>
            </div>
        </section>
    );
}
