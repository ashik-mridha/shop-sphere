import { LockKeyhole, PackageCheck, ShieldCheck, Star } from "lucide-react";
import usePageMeta from "../../hooks/usePageMeta";
import useFetch from "../../hooks/useFetch";
import Card from "../../components/ui/Card";
import Skeleton from "../../components/ui/Skeleton";
import { LinkButton } from "../../components/ui/Button";
import { formatNumber } from "../../lib/format";

const values = [
    [ShieldCheck, "Honest listings", "Clear specs, real prices and reviews only from verified buyers, so you know what you’re getting."],
    [LockKeyhole, "Secure by default", "Payments run through Stripe’s hosted checkout. We never see or store your card details."],
    [PackageCheck, "Simple delivery", "Flat $5.99 shipping, free over $75, with an estimated delivery window on every order."],
    [Star, "Easy returns", "Not right? Send unused items back within 30 days for a refund to your original payment method."],
];

export default function AboutPage() {
    usePageMeta("About us", "ShopSphere sells quality tech and everyday essentials with secure checkout, honest reviews and easy returns.");
    const { data, loading } = useFetch("/stats/public");
    const s = data?.data;

    const stats = [
        ["Products", s?.products],
        ["Categories", s?.categories],
        ["Verified reviews", s?.reviews],
        ["Average rating", s?.averageRating ? `${s.averageRating} / 5` : s ? "New" : undefined],
    ];

    return (
        <div className="space-y-14">
            <section className="rounded-2xl bg-primary-soft px-6 py-12 text-center sm:py-16">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">About ShopSphere</p>
                <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">Quality products, a checkout you can trust</h1>
                <p className="mx-auto mt-4 max-w-2xl text-muted">We curate audio gear, computers, smart-home devices, accessories, fitness equipment and kitchen essentials, and back every order with secure payment, clear delivery estimates and a 30-day return window.</p>
            </section>

            <section aria-label="ShopSphere in numbers">
                <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {stats.map(([label, value]) => (
                        <Card key={label} className="text-center">
                            <dd className="text-3xl font-extrabold text-primary">
                                {loading && !s ? <Skeleton className="mx-auto h-9 w-20" /> : typeof value === "number" ? formatNumber(value) : value ?? "—"}
                            </dd>
                            <dt className="mt-1 text-sm text-muted">{label}</dt>
                        </Card>
                    ))}
                </dl>
            </section>

            <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
                <div>
                    <h2 className="text-2xl font-bold sm:text-3xl">Our story</h2>
                    <p className="mt-4 leading-7 text-muted">ShopSphere started with a simple frustration: buying everyday tech shouldn’t mean guessing which reviews are real or whether a checkout is safe. So we built the store we wanted to shop in.</p>
                    <p className="mt-3 leading-7 text-muted">Every product page lists its real specifications and stock. Only people who actually bought an item can review it, and payments are handled by Stripe, one of the most trusted payment processors in the world.</p>
                </div>
                <ul className="grid gap-4 sm:grid-cols-2">
                    {values.map(([Icon, title, text]) => (
                        <li key={title}>
                            <Card className="h-full">
                                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary"><Icon size={20} aria-hidden="true" /></span>
                                <h3 className="font-bold">{title}</h3>
                                <p className="mt-1 text-sm text-muted">{text}</p>
                            </Card>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="rounded-2xl border border-line bg-surface px-6 py-10 text-center">
                <h2 className="text-2xl font-bold">Ready to find your next favourite?</h2>
                <p className="mx-auto mt-2 max-w-lg text-muted">Browse the full catalogue, or get in touch if you’d like a hand choosing.</p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <LinkButton to="/shop" size="lg">Shop now</LinkButton>
                    <LinkButton to="/contact" size="lg" variant="outline">Contact us</LinkButton>
                </div>
            </section>
        </div>
    );
}
