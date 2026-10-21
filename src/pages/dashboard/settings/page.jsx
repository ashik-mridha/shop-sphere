
import { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Package } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import AddProductCard from "./AddProductCard";
import ManageProductsTable from "./ManageProductsTable";
import ProductSearchFilter from "./ProductSearchFilter";
import ProductPagination from "./ProductPagination";

const ITEMS_PER_PAGE = 5;
const SERVER_URL = "http://localhost:5000";

const EMPTY_PRODUCT = {
    title: "",
    price: "",
    category: "",
    image: "",
    description: "",
};

export default function AdminSettings() {
    const [products, setProducts] = useState([]);
    const [showAddCard, setShowAddCard] = useState(false);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const [newProduct, setNewProduct] = useState(EMPTY_PRODUCT);
    const [editingId, setEditingId] = useState(null);
    const [editedPrice, setEditedPrice] = useState("");

    // Fetch products from backend
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);

            const res = await fetch(`${SERVER_URL}/api/products`);

            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }

            const data = await res.json();

            if (!Array.isArray(data)) {
                throw new Error("Invalid products response from server");
            }

            setProducts(data);
        } catch (error) {
            console.error("Fetch products error:", error);
            toast.error("Products load হয়নি। Backend server check করো।");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Add product
    const handleAddProduct = async (e) => {
        e.preventDefault();

        const price = Number(newProduct.price);

        if (
            !newProduct.title.trim() ||
            newProduct.price === "" ||
            !Number.isFinite(price) ||
            price < 0
        ) {
            toast.error("Valid title and price দাও");
            return;
        }

        const loadingToast = toast.loading("Adding product...");

        try {
            const res = await fetch(`${SERVER_URL}/api/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...newProduct,
                    title: newProduct.title.trim(),
                    price,
                }),
            });

            if (!res.ok) {
                throw new Error(`Add failed: ${res.status}`);
            }

            toast.success("Product added successfully!", {
                id: loadingToast,
            });

            setNewProduct(EMPTY_PRODUCT);
            setShowAddCard(false);
            setCurrentPage(1);

            await fetchProducts();
        } catch (error) {
            console.error("Add product error:", error);
            toast.error("Product add হয়নি। Backend/API check করো।", {
                id: loadingToast,
            });
        }
    };

    // Delete product

    const handleDeleteProduct = async (id) => {
        if (!id) {
            toast.error("Product ID পাওয়া যায়নি!");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) return;

        const loadingToast = toast.loading("Deleting product...");

        try {
            const res = await fetch(
                `http://localhost:5000/api/products/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data.message || `Delete failed: ${res.status}`);
            }

            setProducts((prev) =>
                prev.filter((product) => product._id !== id)
            );

            toast.success("Product deleted successfully!", {
                id: loadingToast,
            });
        } catch (error) {
            console.error("Delete error:", error);

            toast.error(error.message || "Product delete failed!", {
                id: loadingToast,
            });
        }
    };


    // Update product price
    const handleUpdatePrice = async (id) => {
        if (
            editedPrice === "" ||
            !Number.isFinite(Number(editedPrice)) ||
            Number(editedPrice) < 0
        ) {
            toast.error("Valid price দাও");
            return;
        }

        const loadingToast = toast.loading("Updating price...");

        try {
            const res = await fetch(`${SERVER_URL}/api/products/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ price: Number(editedPrice) }),
            });

            if (!res.ok) {
                throw new Error(`Update failed: ${res.status}`);
            }

            setProducts((prev) =>
                prev.map((p) =>
                    p._id === id
                        ? { ...p, price: Number(editedPrice) }
                        : p
                )
            );

            setEditingId(null);
            setEditedPrice("");

            toast.success("Price updated successfully!", {
                id: loadingToast,
            });
        } catch (error) {
            console.error("Update price error:", error);
            toast.error("Price update হয়নি।", {
                id: loadingToast,
            });
        }
    };

    // Search and category filter
    const filteredProducts = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return products.filter((item) => {
            const matchesCategory =
                selectedCategory === "all" ||
                item.category?.toLowerCase() ===
                selectedCategory.toLowerCase();

            const matchesSearch =
                item.title?.toLowerCase().includes(query);

            return matchesCategory && matchesSearch;
        });
    }, [products, searchQuery, selectedCategory]);

    // Reset page when search/filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
    );

    // Keep current page valid after deleting products
    useEffect(() => {
        setCurrentPage((page) => Math.min(page, totalPages));
    }, [totalPages]);

    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;

        return filteredProducts.slice(
            start,
            start + ITEMS_PER_PAGE
        );
    }, [filteredProducts, currentPage]);

    return (
        <div className="mx-auto max-w-6xl p-6 text-gray-900 dark:text-gray-100">
            <Toaster position="top-right" reverseOrder={false} />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="flex items-center gap-2 text-2xl font-bold">
                    <Package className="text-[#10B981]" />
                    Admin Settings - Product Management
                </h1>

                <button
                    type="button"
                    onClick={() => setShowAddCard((prev) => !prev)}
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#10B981] px-4 py-2 font-medium text-white shadow-md transition hover:bg-[#0d9668]"
                >
                    <Plus size={18} />
                    {showAddCard ? "Close Form" : "Add Product"}
                </button>
            </div>

            {showAddCard && (
                <AddProductCard
                    newProduct={newProduct}
                    setNewProduct={setNewProduct}
                    handleAddProduct={handleAddProduct}
                    onClose={() => setShowAddCard(false)}
                />
            )}

            <ProductSearchFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />

            <ManageProductsTable
                products={paginatedProducts}
                loading={loading}
                editingId={editingId}
                setEditingId={setEditingId}
                editedPrice={editedPrice}
                setEditedPrice={setEditedPrice}
                handleUpdatePrice={handleUpdatePrice}
                handleDeleteProduct={handleDeleteProduct}
            />

            <ProductPagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                totalResults={filteredProducts.length}
                itemsPerPage={ITEMS_PER_PAGE}
            />
        </div>
    );
}
