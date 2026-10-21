import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import useProducts from "../../hooks/useProducts";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";

const CART_KEY = "shopsphere_cart";
const ITEMS_PER_PAGE = 8;

export default function ShopingPage() {
    const { products = [], loading, error } = useProducts();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [addedProductId, setAddedProductId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Add product to cart
    const addToCart = (product) => {
        try {
            const saved = JSON.parse(
                localStorage.getItem(CART_KEY) || "[]"
            );

            const cart = Array.isArray(saved) ? saved : [];
            const id = String(product._id ?? product.id ?? "");

            if (!id) {
                alert("Product ID missing. Cannot add to cart.");
                return;
            }

            const existing = cart.find(
                (item) => String(item._id ?? item.id ?? "") === id
            );

            let updatedCart;

            if (existing) {
                updatedCart = cart.map((item) =>
                    String(item._id ?? item.id ?? "") === id
                        ? {
                            ...item,
                            quantity: Math.min(
                                99,
                                Math.max(1, Number(item.quantity) || 1) + 1
                            ),
                        }
                        : item
                );
            } else {
                updatedCart = [...cart, { ...product, quantity: 1 }];
            }

            localStorage.setItem(
                CART_KEY,
                JSON.stringify(updatedCart)
            );

            window.dispatchEvent(new Event("cartUpdated"));

            setAddedProductId(id);

            window.setTimeout(() => {
                setAddedProductId((current) =>
                    current === id ? null : current
                );
            }, 1500);
        } catch (err) {
            console.error("Failed to add product to cart:", err);
            alert("Could not add product to cart.");
        }
    };

    // Search and category filtering
    const query = searchQuery.trim().toLowerCase();
    const productList = Array.isArray(products) ? products : [];

    const filteredProducts = useMemo(() => {
        return productList.filter((item) => {
            const category = String(item.category ?? "").toLowerCase();

            const matchesCategory =
                selectedCategory === "all" ||
                category === selectedCategory;

            const matchesSearch = [
                item.title,
                item.description,
                item.category,
            ].some((value) =>
                String(value ?? "").toLowerCase().includes(query)
            );

            return matchesCategory && matchesSearch;
        });
    }, [productList, selectedCategory, query]);

    // Dynamic categories
    const categories = [
        "all",
        ...new Set(
            productList
                .map((product) =>
                    String(product.category ?? "").trim().toLowerCase()
                )
                .filter(Boolean)
        ),
    ];

    // Pagination calculations
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredProducts, currentPage]);

    // Handle Page Change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    return (
        <main className="min-h-screen bg-[#0a0f0d] px-4 py-8 text-gray-100 sm:px-6 lg:px-12">
            <div className="mx-auto max-w-7xl">
                {/* Header and Search */}
                <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Explore Shop
                        </h1>

                        <p className="mt-1 text-sm text-gray-400">
                            Browse our collection of dynamic products
                        </p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                        />

                        <input
                            type="search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search products..."
                            aria-label="Search products"
                            className="w-full rounded-xl border border-[#22332a] bg-[#121816] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 transition focus:border-[#10B981] focus:outline-none"
                        />
                    </div>
                </div>

                {/* Category Filters */}
                <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-4">
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => handleCategoryChange(category)}
                            className={`cursor-pointer whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${selectedCategory === category
                                    ? "bg-[#10B981] text-white shadow-lg"
                                    : "border border-[#22332a] bg-[#121816] text-gray-400 hover:text-white"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#10B981] border-t-transparent"></div>
                        <p className="mt-4 text-sm text-gray-400">Loading products...</p>
                    </div>
                ) : error ? (
                    /* Error State */
                    <div className="rounded-2xl border border-red-900 bg-[#121816] py-16 text-center">
                        <p className="text-red-400">{error}</p>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-4 rounded-lg bg-[#10B981] px-4 py-2 text-white"
                        >
                            Retry
                        </button>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    /* Empty State */
                    <div className="rounded-2xl border border-[#22332a] bg-[#121816] py-24 text-center">
                        <p className="text-lg font-medium text-gray-300">
                            No products found
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Try searching for something else or change category.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("all");
                                setCurrentPage(1);
                            }}
                            className="mt-4 rounded-lg bg-[#10B981] px-4 py-2 text-sm font-semibold text-white"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    /* Product Grid & Pagination */
                    <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {paginatedProducts.map((product) => (
                                <ProductCard
                                    key={product._id ?? product.id}
                                    product={product}
                                    addedProductId={addedProductId}
                                    addToCart={addToCart}
                                />
                            ))}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </main>
    );
}