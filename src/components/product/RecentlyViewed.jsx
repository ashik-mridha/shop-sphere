import ProductGrid from "../shop/ProductGrid";
import useFetch from "../../hooks/useFetch";

/** Re-fetches the viewed products so price, stock and photos are always current. */
export default function RecentlyViewed({ ids }) {
    const { data } = useFetch("/products", { params: { ids: ids.join(","), limit: 8 }, enabled: ids.length > 0 });
    const byId = new Map((data?.data || []).map((p) => [String(p._id), p]));
    const products = ids.map((id) => byId.get(id)).filter(Boolean);
    if (!products.length) return null;

    return (
        <section aria-labelledby="recent-heading" className="mt-14">
            <h2 id="recent-heading" className="mb-5 text-2xl font-bold">Recently viewed</h2>
            <ProductGrid products={products} />
        </section>
    );
}
