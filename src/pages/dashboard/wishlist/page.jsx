import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Heart,
    ShoppingCart,
    Trash2,
    Loader2,
    ShoppingBag
} from "lucide-react";
import toast from "react-hot-toast";

export default function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // লোকাল স্টোরেজ বা ব্যাকএন্ড থেকে উইশলিস্ট আইটেম লোড করা (এখানে localStorage ব্যবহার করা হয়েছে, চাইলে API-তে কনভার্ট করতে পারো)
    useEffect(() => {
        try {
            setLoading(true);
            const savedWishlist = JSON.parse(localStorage.getItem("shopsphere_wishlist")) || [];
            setWishlistItems(savedWishlist);
        } catch (err) {
            console.error("Load wishlist error:", err);
            toast.error("Could not load your wishlist.");
        } finally {
            setLoading(false);
        }
    }, []);

    // উইশলিস্ট থেকে প্রোডাক্ট রিমুভ করার ফাংশন
    const handleRemoveFromWishlist = (productId) => {
        const updatedWishlist = wishlistItems.filter(
            (item) => (item._id || item.id) !== productId
        );
        setWishlistItems(updatedWishlist);
        localStorage.setItem("shopsphere_wishlist", JSON.stringify(updatedWishlist));
        toast.success("Removed from wishlist");
    };

    // কার্টে যোগ করার ফাংশন (যদি তোমার শপ কার্ট লজিক থাকে)
    const handleAddToCart = (product) => {
        try {
            const existingCart = JSON.parse(localStorage.getItem("shopsphere_cart")) || [];
            const itemIndex = existingCart.findIndex(
                (item) => (item._id || item.id) === (product._id || product.id)
            );

            if (itemIndex > -1) {
                existingCart[itemIndex].quantity = (existingCart[itemIndex].quantity || 1) + 1;
            } else {
                existingCart.push({ ...product, quantity: 1 });
            }

            localStorage.setItem("shopsphere_cart", JSON.stringify(existingCart));
            toast.success("Added to cart successfully!");
        } catch (err) {
            console.error("Add to cart error:", err);
            toast.error("Failed to add to cart.");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">My Wishlist</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your saved favorite products and add them to cart anytime.
                    </p>
                </div>
                <div className="text-sm font-semibold text-gray-600 bg-gray-100 px-3.5 py-1.5 rounded-xl w-fit">
                    Total Items: <span className="text-emerald-700">{wishlistItems.length}</span>
                </div>
            </div>

            {/* Wishlist Content Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-emerald-700" size={36} />
                    <p className="mt-3 text-sm text-gray-500">Loading your wishlist...</p>
                </div>
            ) : wishlistItems.length === 0 ? (
                <div className="py-20 text-center rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <Heart className="mx-auto text-gray-300" size={54} />
                    <p className="mt-3 text-base font-medium text-gray-800">Your wishlist is empty</p>
                    <p className="mt-1 text-xs text-gray-500">
                        Explore our store and save your favorite products here.
                    </p>
                    <Link
                        to="/shop"
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 shadow-sm"
                    >
                        <ShoppingBag size={18} />
                        Explore Shop
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {wishlistItems.map((product) => {
                        const id = product._id || product.id;
                        const price = Number(product.price || 0);

                        return (
                            <div
                                key={id}
                                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                            >
                                {/* Product Image & Remove Button */}
                                <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                                    <img
                                        src={product.image || product.thumbnail || "https://placehold.co/400"}
                                        alt={product.title || "Product"}
                                        className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
                                    />

                                    {/* Remove from Wishlist Button */}
                                    <button
                                        onClick={() => handleRemoveFromWishlist(id)}
                                        className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-red-500 shadow-md backdrop-blur-sm transition hover:bg-red-500 hover:text-white"
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className="flex flex-1 flex-col justify-between p-4">
                                    <div>
                                        <h3 className="line-clamp-1 text-base font-semibold text-gray-900">
                                            {product.title || "Unnamed Product"}
                                        </h3>
                                        <p className="mt-1 text-lg font-bold text-emerald-700">
                                            ${price.toFixed(2)}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-4 flex items-center gap-2">
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-700 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-800 shadow-sm"
                                        >
                                            <ShoppingCart size={15} />
                                            Add to Cart
                                        </button>

                                        <Link
                                            to={`/shop/${id}`}
                                            className="flex cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}