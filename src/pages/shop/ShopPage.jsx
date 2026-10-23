import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PackageSearch, Search, SlidersHorizontal, X } from "lucide-react";
import usePageMeta from "../../hooks/usePageMeta";
import useFetch from "../../hooks/useFetch";
import ProductGrid from "../../components/shop/ProductGrid";
import ShopFilters from "../../components/shop/ShopFilters";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Pagination from "../../components/ui/Pagination";
import EmptyState, { ErrorState } from "../../components/ui/EmptyState";
import { ProductGridSkeleton } from "../../components/ui/Skeleton";
import { Select } from "../../components/ui/Input";
import PageHeader from "../../components/ui/PageHeader";

const PAGE_SIZE = 12;
const FILTER_KEYS = ["category", "brand", "minPrice", "maxPrice", "rating", "inStock", "onSale"];

export default function ShopPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filtersOpen, setFiltersOpen] = useState(false);

    const values = Object.fromEntries(searchParams.entries());
    const page = Math.max(1, parseInt(values.page, 10) || 1);
    const sort = values.sort || "newest";
    const q = values.q || "";

    const categoriesRes = useFetch("/categories");
    const metaRes = useFetch("/products/meta/filters");
    const categories = categoriesRes.data?.data || [];
    const bounds = metaRes.data?.data || {};
    const brands = bounds.brands || [];

    const { data, loading, error, refetch } = useFetch("/products", {
        params: { q, sort, page, limit: PAGE_SIZE, ...Object.fromEntries(FILTER_KEYS.map((k) => [k, values[k]])) },
    });
    const products = data?.data || [];
    const pagination = data?.pagination;

    const activeCategory = categories.find((c) => c.slug === values.category);
    usePageMeta(
        activeCategory ? `${activeCategory.name}` : q ? `Search: ${q}` : "Shop all products",
        activeCategory?.description || "Browse the full ShopSphere catalogue. Filter by category, brand, price and rating."
    );

    function update(patch, { keepPage = false } = {}) {
        const next = new URLSearchParams(searchParams);
        Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
        if (!keepPage) next.delete("page");
        setSearchParams(next);
    }

    function clearAll() {
        const next = new URLSearchParams();
        if (q) next.set("q", q);
        if (sort !== "newest") next.set("sort", sort);
        setSearchParams(next);
    }

    const activeCount = FILTER_KEYS.filter((k) => values[k]).length;
    const filters = (
        <ShopFilters values={values} categories={categories} brands={brands} bounds={bounds} onApply={update} onClear={clearAll} />
    );

    return (
        <div>
            <PageHeader
                title={activeCategory ? activeCategory.name : "Shop"}
                description={activeCategory?.description || "Everything we sell, in one place."}
            />

            <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
                <aside aria-label="Filters" className="hidden lg:block">
                    <div className="sticky top-24 rounded-xl border border-line bg-surface p-5">
                        <h2 className="mb-4 font-bold">Filters</h2>
                        {filters}
                    </div>
                </aside>

                <div className="min-w-0">
                    <div className="mb-5 flex flex-wrap items-end gap-3">
                        <form
                            role="search"
                            className="relative min-w-0 flex-1 basis-56"
                            onSubmit={(e) => {
                                e.preventDefault();
                                update({ q: new FormData(e.currentTarget).get("q").toString().trim() });
                            }}
                        >
                            <label htmlFor="shop-search" className="sr-only">Search products</label>
                            <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                            <input
                                key={q}
                                id="shop-search"
                                name="q"
                                defaultValue={q}
                                placeholder="Search by name, brand or SKU"
                                className="h-11 w-full rounded-lg border border-line bg-surface pl-10 pr-3 text-sm focus:border-primary focus:outline-none"
                            />
                        </form>

                        <Select label="Sort by" value={sort} onChange={(e) => update({ sort: e.target.value === "newest" ? "" : e.target.value })} wrapperClassName="w-44">
                            <option value="newest">Newest</option>
                            <option value="popular">Most popular</option>
                            <option value="rating">Top rated</option>
                            <option value="price-asc">Price: low to high</option>
                            <option value="price-desc">Price: high to low</option>
                            <option value="discount">Biggest discount</option>
                        </Select>

                        <Button variant="outline" className="lg:hidden" onClick={() => setFiltersOpen(true)}>
                            <SlidersHorizontal size={16} aria-hidden="true" /> Filters{activeCount ? ` (${activeCount})` : ""}
                        </Button>
                    </div>

                    <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted" aria-live="polite">
                        {pagination && <span>{pagination.total} {pagination.total === 1 ? "product" : "products"}</span>}
                        {q && (
                            <button type="button" onClick={() => update({ q: "" })} className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-3 py-1 font-medium text-fg">
                                “{q}” <X size={13} aria-label="Clear search" />
                            </button>
                        )}
                        {activeCategory && (
                            <button type="button" onClick={() => update({ category: "" })} className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-3 py-1 font-medium text-fg">
                                {activeCategory.name} <X size={13} aria-label="Remove category filter" />
                            </button>
                        )}
                    </div>

                    {error ? (
                        <ErrorState message={error.message} onRetry={refetch} />
                    ) : loading && !products.length ? (
                        <ProductGridSkeleton count={8} />
                    ) : products.length === 0 ? (
                        <EmptyState
                            icon={PackageSearch}
                            title="No products match your filters"
                            description="Try removing a filter or searching for something else."
                            action={<Button onClick={() => setSearchParams(new URLSearchParams())}>Reset search and filters</Button>}
                        />
                    ) : (
                        <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
                            <ProductGrid products={products} />
                            <Pagination
                                className="mt-8"
                                page={pagination?.page || 1}
                                pages={pagination?.pages || 1}
                                onChange={(p) => {
                                    update({ page: p > 1 ? String(p) : "" }, { keepPage: true });
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters" footer={<Button onClick={() => setFiltersOpen(false)}>Show {pagination?.total ?? ""} results</Button>}>
                {filters}
            </Modal>
        </div>
    );
}
