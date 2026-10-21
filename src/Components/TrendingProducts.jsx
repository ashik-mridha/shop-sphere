import { useState, useEffect } from "react";
import { Star, ShoppingCart, ArrowRight, Loader2, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const TrendingProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const SERVER_URL = "http://localhost:5000";

    useEffect(() => {
        const controller = new AbortController();

        async function fetchProducts() {
            try {
                setLoading(true);
                setError("");

                const res = await fetch(`${SERVER_URL}/api/products`, {
                    signal: controller.signal,
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch products (${res.status})`);
                }

                const data = await res.json();

                if (!Array.isArray(data)) {
                    throw new Error("Invalid products response from server");
                }

                // হোমপেজে দেখানোর জন্য প্রথম ৮টি প্রডাক্ট নেওয়া হলো
                setProducts(data.slice(0, 8));
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Failed to fetch trending products:", err);
                    setError("Trending products load kora jacche na.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchProducts();

        return () => controller.abort();
    }, []);

    return (
        <section className="bg-[#121614] py-6 sm:py-10 px-4 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-[1440px]">

                {/* Section Header */}
                <div className="flex items-center justify-between mb-5 sm:mb-8">
                    <div>
                        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#10B981]">
                            Handpicked Choice
                        </span>
                        <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5 sm:mt-1">
                            Trending Products
                        </h2>
                    </div>

                    <Link
                        to="/shop"
                        className="group flex items-center gap-1 text-xs sm:text-sm font-semibold text-gray-300 transition-colors duration-200 hover:text-[#10B981]"
                    >
                        <span>View All</span>
                        <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1 sm:w-4 sm:h-4" />
                    </Link>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16">
                        <Loader2 className="animate-spin text-[#10B981]" size={36} />
                        <p className="text-sm text-gray-400">Loading trending items...</p>
                    </div>
                ) : error ? (
                    /* Error State */
                    <div className="rounded-2xl border border-red-900/50 bg-[#0d1411] py-8 text-center">
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                ) : products.length === 0 ? (
                    /* Empty State */
                    <div className="rounded-2xl border border-[#1f2924] bg-[#0d1411] py-12 text-center">
                        <p className="text-gray-400 text-sm">No trending products available right now.</p>
                    </div>
                ) : (
                    /* Product Grid - Mobile e grid-cols-2 (পাসাপাশি ২টা) */
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                        {products.map((product) => {
                            const productId = String(product._id ?? product.id ?? "");

                            return (
                                <div
                                    key={productId}
                                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#1f2924] bg-[#0d1411] p-2.5 sm:p-4 transition-all duration-300 hover:border-[#10B981]/50 hover:shadow-xl hover:shadow-[#10B981]/10"
                                >
                                    <div>
                                        {/* Product Image Box */}
                                        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#15241d]/40 p-2 sm:p-4 flex items-center justify-center">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.title || "Product image"}
                                                    className="h-48 w-full object-contain"
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null;
                                                        e.currentTarget.src = "/no-image.png";
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-xs text-gray-600">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="mt-2 sm:mt-4 flex flex-col gap-1">
                                            <h3 className="text-xs sm:text-base font-bold text-white transition-colors duration-200 group-hover:text-[#10B981] truncate">
                                                {product.title}
                                            </h3>

                                            {/* Ratings (Static Default Rating for UI) */}
                                            <div className="flex items-center gap-1 text-[10px] sm:text-xs">
                                                <div className="flex items-center text-amber-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={11} fill="currentColor" className="sm:w-3.5 sm:h-3.5" />
                                                    ))}
                                                </div>
                                                <span className="font-semibold text-gray-300">{product.rating || "4.8"}</span>
                                                <span className="text-gray-500 hidden sm:inline">({product.reviews || 24})</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price & Action Buttons (Cart & Details) */}
                                    <div className="mt-3 flex flex-col gap-2 pt-2 border-t border-[#1f2924]/60">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs sm:text-lg font-extrabold text-white">
                                                ${Number(product.price ?? 0).toFixed(2)}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => alert(`Added ${product.title} to cart!`)}
                                                aria-label={`Add ${product.title} to cart`}
                                                className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-[#15241d] text-gray-200 border border-[#22332a] transition-all duration-200 hover:bg-[#10B981] hover:text-[#121614] hover:border-[#10B981] active:scale-90 cursor-pointer"
                                            >
                                                <ShoppingCart size={13} className="sm:w-4 sm:h-4" />
                                            </button>
                                        </div>

                                        {/* Details Button */}
                                        <Link
                                            to={`/shop/${encodeURIComponent(productId)}`}
                                            className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-[#22332a] bg-[#15241d]/50 py-2 text-xs font-semibold text-emerald-400 transition-all hover:bg-emerald-600 hover:text-white hover:border-emerald-600"
                                        >
                                            <Eye size={14} />
                                            <span>Details</span>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </section>
    );
};

export default TrendingProducts;