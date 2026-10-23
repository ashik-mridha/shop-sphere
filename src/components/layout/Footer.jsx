import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Mail, RotateCcw, Truck } from "lucide-react";
import toast from "react-hot-toast";
import Logo from "./Logo";
import Button from "../ui/Button";
import useFetch from "../../hooks/useFetch";
import { api, errorMessage } from "../../lib/api";
import { SITE_TAGLINE } from "../../lib/config";

const columns = [
    {
        title: "Support",
        links: [
            ["Contact us", "/contact"],
            ["FAQ", "/faq"],
            ["Shipping & returns", "/shipping-returns"],
            ["Track your order", "/track-order"],
        ],
    },
    {
        title: "Company",
        links: [
            ["About ShopSphere", "/about"],
            ["Privacy policy", "/privacy"],
            ["Terms of service", "/terms"],
        ],
    },
    {
        title: "My account",
        links: [
            ["Sign in", "/login"],
            ["Create account", "/register"],
            ["My orders", "/user/orders"],
            ["Wishlist", "/wishlist"],
        ],
    },
];

export default function Footer() {
    const [email, setEmail] = useState("");
    const [busy, setBusy] = useState(false);
    const { data } = useFetch("/categories");
    const categories = data?.data || [];

    async function subscribe(e) {
        e.preventDefault();
        setBusy(true);
        try {
            const res = await api.post("/newsletter", { email });
            toast.success(res.message);
            setEmail("");
        } catch (error) {
            toast.error(errorMessage(error));
        } finally {
            setBusy(false);
        }
    }

    return (
        <footer className="mt-12 border-t border-line bg-surface">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
                <div className="grid gap-4 border-b border-line pb-8 sm:grid-cols-3">
                    {[
                        [Lock, "Secure checkout", "Payments are processed by Stripe"],
                        [Truck, "Free shipping over $75", "Delivered in 3-7 business days"],
                        [RotateCcw, "30-day returns", "Unused items, full refund"],
                    ].map(([Icon, title, text]) => (
                        <div key={title} className="flex items-center gap-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                                <Icon size={20} aria-hidden="true" />
                            </span>
                            <div>
                                <p className="text-sm font-semibold">{title}</p>
                                <p className="text-xs text-muted">{text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid gap-10 py-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
                    <div>
                        <Logo />
                        <p className="mt-3 max-w-xs text-sm text-muted">{SITE_TAGLINE}</p>
                        <form onSubmit={subscribe} className="mt-5 max-w-sm">
                            <label htmlFor="newsletter-email" className="mb-1.5 block text-sm font-semibold">Get offers in your inbox</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Mail size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                    <input
                                        id="newsletter-email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        className="h-11 w-full rounded-lg border border-line bg-surface-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <Button type="submit" loading={busy}>Join</Button>
                            </div>
                        </form>
                    </div>

                    <div>
                        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide">Shop</h2>
                        <ul className="space-y-2 text-sm text-muted">
                            <li><Link className="hover:text-primary" to="/shop">All products</Link></li>
                            {categories.map((c) => (
                                <li key={c._id}><Link className="hover:text-primary" to={`/shop?category=${c.slug}`}>{c.name}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {columns.map((col) => (
                        <div key={col.title}>
                            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide">{col.title}</h2>
                            <ul className="space-y-2 text-sm text-muted">
                                {col.links.map(([label, to]) => (
                                    <li key={to}><Link className="hover:text-primary" to={to}>{label}</Link></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row">
                    <p>© {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
                    <p className="inline-flex items-center gap-1.5">
                        <Lock size={13} aria-hidden="true" /> Secure payments powered by <strong className="text-fg">Stripe</strong>
                    </p>
                </div>
            </div>
        </footer>
    );
}
