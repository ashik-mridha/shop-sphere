import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import useFetch from "../../hooks/useFetch";
import ProductGrid from "../shop/ProductGrid";
import { ProductGridSkeleton } from "../ui/Skeleton";
import { SectionHeader } from "../ui/PageHeader";
import { ErrorState } from "../ui/EmptyState";

export default function ProductSection({ eyebrow, title, description, params, to, limit = 8 }) {
    const { data, loading, error, refetch } = useFetch("/products", { params: { limit, ...params } });
    const products = data?.data || [];
    if (!loading && !error && !products.length) return null;

    return (
        <section aria-label={title}>
            <SectionHeader
                eyebrow={eyebrow}
                title={title}
                description={description}
                action={
                    <Link to={to} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                        View all <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                }
            />
            {error ? <ErrorState title="Could not load products" message={error.message} onRetry={refetch} /> : loading ? <ProductGridSkeleton count={Math.min(limit, 4)} /> : <ProductGrid products={products} />}
        </section>
    );
}
