import { Lock, RotateCcw, Truck, Headset } from "lucide-react";

const items = [
    [Lock, "Secure payment", "Card payments are handled by Stripe, a PCI Level 1 provider."],
    [Truck, "Free shipping over $75", "Standard delivery in 3-7 business days."],
    [RotateCcw, "Easy 30-day returns", "Send back unused items for a full refund."],
    [Headset, "Real human support", "Questions about an order? Our team replies within one business day."],
];

export default function TrustBadges() {
    return (
        <section aria-label="Why shop with us" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {items.map(([Icon, title, text]) => (
                <div key={title} className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                        <Icon size={20} aria-hidden="true" />
                    </span>
                    <div>
                        <h2 className="text-sm font-bold">{title}</h2>
                        <p className="mt-0.5 text-xs text-muted">{text}</p>
                    </div>
                </div>
            ))}
        </section>
    );
}
