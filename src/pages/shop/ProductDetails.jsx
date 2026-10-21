import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    ShoppingCart,
    Loader2,
    Minus,
    Plus,
    Star,
    CheckCircle2,
    ShieldCheck,
    Truck,
    RefreshCw,
} from "lucide-react";

const SERVER_URL = "http://localhost:5000";
const CART_KEY = "shopsphere_cart";

export default function ProductDetails() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function loadProduct() {
            try {
                setLoading(true);
                setError("");

                const res = await fetch(
                    `${SERVER_URL}/api/products/${id}`,
                    { signal: controller.signal }
                );

                if (!res.ok) {
                    throw new Error(
                        res.status === 404
                            ? "Product not found"
                            : "Failed to load product"
                    );
                }

                const data = await res.json();
                setProduct(data.product ?? data);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadProduct();

        return () => controller.abort();
    }, [id]);

    // LocalStorage এ কার্ট ম্যানেজমেন্ট হ্যান্ডেল করার ফাংশন
    const handleAddToCart = () => {
        if (!product) return;
        try {
            const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
            const cart = Array.isArray(saved) ? saved : [];
            const prodId = String(product._id ?? product.id ?? "");

            const existing = cart.find(
                (item) => String(item._id ?? item.id ?? "") === prodId
            );

            let updatedCart;
            if (existing) {
                updatedCart = cart.map((item) =>
                    String(item._id ?? item.id ?? "") === prodId
                        ? {
                            ...item,
                            quantity: Math.min(
                                99,
                                (Number(item.quantity) || 1) + quantity
                            ),
                        }
                        : item
                );
            } else {
                updatedCart = [...cart, { ...product, quantity }];
            }

            localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
            window.dispatchEvent(new Event("cartUpdated"));

            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        } catch (err) {
            console.error("Failed to add to cart:", err);
            alert("Could not add product to cart.");
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0a0f0d]">
                <Loader2 className="animate-spin text-emerald-500" size={40} />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-24 text-center text-white">
                <h1 className="text-2xl font-bold text-red-400">
                    {error || "Product not found"}
                </h1>
                <Link
                    to="/shop"
                    className="mt-5 inline-block rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
                >
                    Back to Shop
                </Link>
            </div>
        );
    }

    const price = Number(product.price) || 0;
    const total = price * quantity;

    // ডাইনামিক ডেটা বা ফলব্যাক ভ্যালু
    const rating = product.rating || 4.8;
    const reviewsCount = product.reviews || 32;
    const stockStatus = product.stock !== undefined ? product.stock > 0 : true;

    return (
        <div className="min-h-screen bg-[#0a0f0d] px-4 py-10 text-white sm:px-8 lg:px-12">
            <div className="mx-auto max-w-6xl">
                <Link
                    to="/shop"
                    className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-emerald-400"
                >
                    <ArrowLeft size={18} /> Back to Shop
                </Link>

                <div className="grid gap-10 rounded-3xl border border-[#22332a] bg-[#121816] p-6 md:grid-cols-2 md:p-10 shadow-2xl">

                    {/* Left: Product Image */}
                    <div className="flex flex-col gap-4">
                        <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-[#0d1411] border border-[#22332a]/60 p-4">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.title || "Product image"}
                                    className="h-full w-full object-contain transition duration-300 hover:scale-105"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = "/no-image.png";
                                    }}
                                />
                            ) : (
                                <p className="text-gray-500 text-sm">No image available</p>
                            )}
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-3 pt-2">
                            <div className="flex flex-col items-center justify-center rounded-xl border border-[#22332a] bg-[#0d1411] p-3 text-center">
                                <ShieldCheck size={20} className="text-emerald-400 mb-1" />
                                <span className="text-[11px] text-gray-300 font-medium">Secure Payment</span>
                            </div>
                            <div className="flex flex-col items-center justify-center rounded-xl border border-[#22332a] bg-[#0d1411] p-3 text-center">
                                <Truck size={20} className="text-emerald-400 mb-1" />
                                <span className="text-[11px] text-gray-300 font-medium">Fast Delivery</span>
                            </div>
                            <div className="flex flex-col items-center justify-center rounded-xl border border-[#22332a] bg-[#0d1411] p-3 text-center">
                                <RefreshCw size={20} className="text-emerald-400 mb-1" />
                                <span className="text-[11px] text-gray-300 font-medium">7-Day Return</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Info & Actions */}
                    <div className="flex flex-col justify-between">
                        <div>
                            {/* Category & Stock Tag */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs uppercase tracking-widest font-semibold text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-800/50">
                                    {product.category || "General"}
                                </span>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stockStatus ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800' : 'bg-red-900/30 text-red-400 border border-red-800'}`}>
                                    {stockStatus ? "In Stock" : "Out of Stock"}
                                </span>
                            </div>

                            <h1 className="mt-4 text-2xl font-bold sm:text-3xl text-white tracking-tight">
                                {product.title}
                            </h1>

                            {/* Ratings */}
                            <div className="mt-2 flex items-center gap-2 text-xs">
                                <div className="flex items-center text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill="currentColor" />
                                    ))}
                                </div>
                                <span className="font-bold text-gray-200">{rating}</span>
                                <span className="text-gray-500">({reviewsCount} reviews)</span>
                            </div>

                            <p className="mt-4 text-2xl font-extrabold text-emerald-400">
                                ${price.toFixed(2)}
                            </p>

                            <p className="mt-4 text-sm leading-relaxed text-gray-400">
                                {product.description || "No description provided for this premium item."}
                            </p>

                            {/* Dynamic Features / Highlights List */}
                            <div className="mt-6 space-y-2 border-t border-[#22332a]/60 pt-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Key Highlights:</p>
                                <ul className="space-y-1.5 text-xs text-gray-300">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                                        <span>100% Genuine and authentic product quality</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                                        <span>Tested and certified for long-lasting durability</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                                        <span>Manufacturer warranty included</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="mt-8 space-y-6 pt-6 border-t border-[#22332a]">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-300">
                                    Select Quantity
                                </label>

                                <div className="flex items-center gap-3 rounded-xl border border-[#22332a] bg-[#0d1411] p-1.5">
                                    <button
                                        type="button"
                                        disabled={quantity <= 1}
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="rounded-lg border border-[#22332a] p-1.5 text-gray-300 transition hover:bg-[#15241d] disabled:opacity-30"
                                    >
                                        <Minus size={16} />
                                    </button>

                                    <span className="min-w-6 text-center text-sm font-bold">
                                        {quantity}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                                        disabled={quantity >= 99}
                                        className="rounded-lg border border-[#22332a] p-1.5 text-gray-300 transition hover:bg-[#15241d] disabled:opacity-30"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-400">Total Price</span>
                                <span className="text-2xl font-bold text-white">
                                    ${total.toFixed(2)}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition shadow-md cursor-pointer ${addedToCart
                                            ? "bg-emerald-700 text-white"
                                            : "border border-emerald-600 bg-[#0d1411] text-emerald-400 hover:bg-emerald-600 hover:text-white"
                                        }`}
                                >
                                    <ShoppingCart size={18} />
                                    {addedToCart ? "Added to Cart!" : "Add to Cart"}
                                </button>

                                <Link
                                    to={`/checkout/${product._id || product.id}?quantity=${quantity}`}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10B981] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0d9668] shadow-lg shadow-[#10B981]/20"
                                >
                                    Order Now
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}