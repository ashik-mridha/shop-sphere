import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import LazyImage from "../ui/LazyImage";
import Skeleton from "../ui/Skeleton";
import { SectionHeader } from "../ui/PageHeader";

export default function CategoryGrid() {
    const { data, loading, error } = useFetch("/categories");
    const categories = data?.data || [];
    if (!loading && (error || !categories.length)) return null;

    return (
        <section aria-labelledby="home-categories">
            <SectionHeader eyebrow="Browse" title={<span id="home-categories">Shop by category</span>} />
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
                {loading
                    ? Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="aspect-square" />)
                    : categories.map((c) => (
                        <Link
                            key={c._id}
                            to={`/shop?category=${c.slug}`}
                            className="group relative block aspect-square overflow-hidden rounded-xl border border-line bg-surface-2"
                        >
                            <LazyImage src={c.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 pt-10 text-white">
                                <span className="block text-sm font-bold">{c.name}</span>
                                <span className="block text-xs opacity-85">{c.productCount} products</span>
                            </span>
                        </Link>
                    ))}
            </div>
        </section>
    );
}
