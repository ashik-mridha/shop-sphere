import React, { useState, useEffect } from "react";
import { ShoppingCart, Heart, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProductCard({ product, addedProductId, addToCart }) {
    const id = String(product._id ?? product.id ?? "");
    const isAdded = addedProductId === id;

    // ১. উইশলিস্টে আগে থেকেই আছে কিনা চেক করার স্টেট
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        if (!id) return;
        try {
            const savedWishlist = JSON.parse(localStorage.getItem("shopsphere_wishlist")) || [];
            const exists = savedWishlist.some(
                (item) => String(item._id ?? item.id ?? "") === id
            );
            setIsWishlisted(exists);
        } catch (err) {
            console.error("Wishlist check error:", err);
        }
    }, [id]);

    // ২. উইশলিস্টে যোগ/রিমুভ করার হ্যান্ডলার
    const handleToggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!id) return;

        try {
            let savedWishlist = JSON.parse(localStorage.getItem("shopsphere_wishlist")) || [];
            const exists = savedWishlist.some(
                (item) => String(item._id ?? item.id ?? "") === id
            );

            if (exists) {
                // উইশলিস্ট থেকে রিমুভ করা
                savedWishlist = savedWishlist.filter(
                    (item) => String(item._id ?? item.id ?? "") !== id
                );
                setIsWishlisted(false);
                toast.success("Removed from wishlist");
            } else {
                // উইশলিস্টে যোগ করা
                savedWishlist.push(product);
                setIsWishlisted(true);
                toast.success("Added to wishlist!");
            }

            // localStorage আপডেট করা
            localStorage.setItem("shopsphere_wishlist", JSON.stringify(savedWishlist));
        } catch (err) {
            console.error("Wishlist toggle error:", err);
            toast.error("Failed to update wishlist");
        }
    };

    return (
        <article className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#22332a] bg-[#121816] shadow-lg transition-all duration-300 hover:border-[#10B981]/60">
            <div>
                {/* Product Image */}
                <div className="relative h-52 overflow-hidden bg-[#0d1411]">
                    <img
                        src={product.image || ""}
                        alt={product.title || "Product image"}
                        className="h-full w-full object-contain p-4"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/no-image.png";
                        }}
                    />

                    {/* 🔥 Wishlist Icon Button with Dynamic State & Click Event */}
                    <button
                        type="button"
                        onClick={handleToggleWishlist}
                        aria-label={`Add ${product.title || "product"} to wishlist`}
                        className={`absolute right-3 top-3 cursor-pointer rounded-full p-2 backdrop-blur-md transition-all ${isWishlisted
                                ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                                : "bg-black/60 text-gray-200 hover:text-red-500"
                            }`}
                        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <Heart size={18} className={isWishlisted ? "fill-current text-white" : ""} />
                    </button>

                    {product.category && (
                        <span className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#10B981]">
                            {product.category}
                        </span>
                    )}
                </div>

                {/* Product Information */}
                <div className="p-4">
                    <h2 className="line-clamp-1 text-base font-semibold text-white transition-colors group-hover:text-[#10B981]">
                        {product.title || "Untitled Product"}
                    </h2>

                    <p className="mt-1 line-clamp-2 text-xs text-gray-400">
                        {product.description || "No description provided for this item."}
                    </p>
                </div>
            </div>

            {/* Price and Actions */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#22332a]/50 p-4">
                <div>
                    <span className="block text-xs text-gray-500">Price</span>
                    <span className="text-lg font-bold text-[#10B981]">
                        ${Number(product.price ?? 0).toFixed(2)}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => addToCart(product)}
                        className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white shadow-md transition ${isAdded ? "bg-emerald-700" : "bg-[#10B981] hover:bg-[#0d9668]"
                            }`}
                    >
                        {isAdded ? <CheckCircle size={15} /> : <ShoppingCart size={15} />}
                        {isAdded ? "Added" : "Add"}
                    </button>

                    <Link
                        to={`/shop/${encodeURIComponent(id)}`}
                        className="rounded-xl border border-emerald-600 px-3 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-600 hover:text-white"
                    >
                        Details
                    </Link>
                </div>
            </div>
        </article>
    );
}