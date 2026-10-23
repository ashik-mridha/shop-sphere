import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import LazyImage from "../ui/LazyImage";
import StarRating from "../ui/StarRating";
import useCart from "../../hooks/useCart";
import { useWishlist } from "../../context/WishlistContext";
import { formatMoney } from "../../lib/format";

/** Uniform card: image, title, price, rating, add to cart, wishlist heart. */
export default function ProductCard({ product }) {
    const cart = useCart();
    const wishlist = useWishlist();
    const id = String(product._id);
    const saved = wishlist.has(id);
    const outOfStock = !(product.stock > 0);
    const needsOptions = Boolean(product.sizes?.length || product.colors?.length);
    const href = `/shop/${product.slug || id}`;

    function addToCart() {
        cart.add({ productId: id, slug: product.slug, title: product.title, image: product.image, price: product.price });
        toast.success("Added to cart");
    }

    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-shadow hover:shadow-lg">
            <Link to={href} className="relative block aspect-square overflow-hidden bg-surface-2" tabIndex={-1} aria-hidden="true">
                <LazyImage
                    src={product.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </Link>

            <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
                {product.discountPercent > 0 && (
                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-white dark:text-black">-{product.discountPercent}%</span>
                )}
                {product.isNew && <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-fg">New</span>}
                {outOfStock && <span className="rounded-full bg-fg px-2.5 py-0.5 text-xs font-bold text-bg">Sold out</span>}
            </div>

            <button
                type="button"
                onClick={() => wishlist.toggle(id)}
                aria-pressed={saved}
                aria-label={saved ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
                className="absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-fg shadow backdrop-blur transition-colors hover:text-danger"
            >
                <Heart size={18} className={saved ? "fill-danger text-danger" : ""} />
            </button>

            <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                <p className="truncate text-xs font-medium uppercase tracking-wide text-muted">{product.brand || product.category}</p>
                <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold leading-5 sm:text-[15px]">
                    <Link to={href} className="hover:text-primary">{product.title}</Link>
                </h3>
                <div className="mt-1.5 min-h-5">
                    {product.reviewCount > 0 ? <StarRating value={product.rating} count={product.reviewCount} size={14} /> : <span className="text-xs text-muted">No reviews yet</span>}
                </div>

                <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-bold">{formatMoney(product.price)}</span>
                    {product.compareAtPrice > product.price && (
                        <span className="text-sm text-muted line-through">{formatMoney(product.compareAtPrice)}</span>
                    )}
                </div>

                <div className="mt-auto pt-3">
                    {needsOptions ? (
                        <Link
                            to={href}
                            className="flex h-10 w-full items-center justify-center rounded-lg border border-line text-sm font-semibold hover:bg-surface-2"
                        >
                            Choose options
                        </Link>
                    ) : (
                        <button
                            type="button"
                            onClick={addToCart}
                            disabled={outOfStock}
                            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-fg transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ShoppingCart size={16} aria-hidden="true" />
                            {outOfStock ? "Out of stock" : "Add to cart"}
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}
