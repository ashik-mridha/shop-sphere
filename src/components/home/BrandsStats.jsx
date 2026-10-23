import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { formatNumber } from "../../lib/format";

export function Brands() {
    const { data } = useFetch("/products/meta/filters");
    const brands = data?.data?.brands || [];
    if (!brands.length) return null;

    return (
        <section aria-labelledby="home-brands" className="text-center">
            <h2 id="home-brands" className="mb-4 text-sm font-bold uppercase tracking-widest text-muted">Brands in our catalogue</h2>
            <ul className="flex flex-wrap justify-center gap-2.5">
                {brands.map((b) => (
                    <li key={b}>
                        <Link to={`/shop?brand=${encodeURIComponent(b)}`} className="block rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary">
                            {b}
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export function StatsStrip() {
    const { data } = useFetch("/stats/public");
    const s = data?.data;
    if (!s) return null;
    const items = [
        [formatNumber(s.products), "products in the catalogue"],
        [formatNumber(s.customers), "registered customers"],
        [formatNumber(s.reviews), "verified reviews"],
        [s.averageRating ? `${s.averageRating} / 5` : "—", "average rating"],
    ];
    return (
        <section aria-label="ShopSphere in numbers" className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4">
            {items.map(([value, label]) => (
                <div key={label} className="bg-surface px-4 py-5 text-center">
                    <p className="text-2xl font-extrabold text-primary sm:text-3xl">{value}</p>
                    <p className="mt-1 text-xs text-muted sm:text-sm">{label}</p>
                </div>
            ))}
        </section>
    );
}
