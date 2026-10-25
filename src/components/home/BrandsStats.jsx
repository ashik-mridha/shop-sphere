import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

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
