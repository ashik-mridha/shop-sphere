import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import ProductImage from "./ProductImage";
import { thumb } from "../../lib/images";
import StarRating from "../ui/StarRating";
import useCart from "../../hooks/useCart";
import { useWishlist } from "../../context/WishlistContext";
import { formatMoney } from "../../lib/format";

/** Uniform card: square photo (second photo on hover), badges, rating, price, quick add to cart, wishlist heart. */
export default function ProductCard({ product, eager = false }) {
    const cart = useCart();
    const wishlist = useWishlist();
    const id = String(product._id);
    const saved = wishlist.has(id);
    const stock = product.stock ?? 0;
    const outOfStock = stock <= 0;
    const lowStock = !outOfStock && stock <= 5;
    const needsOptions = Boolean(product.sizes?.length || product.colors?.length);
    const href = `/shop/${product.slug || id}`;
    const hoverImage = product.images?.find((img) => img && img !== product.image);

    function addToCart() {
        cart.add({ productId: id, slug: product.slug, title: product.title, image: product.image, price: product.price });
        toast.success("Added to cart");
    }

    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl motion-reduce:hover:translate-y-0">
            <Link to={href} className="relative block aspect-square overflow-hidden bg-surface-2" tabIndex={-1} aria-hidden="true">
                <ProductImage
                    src={product.image}
                    alt=""
                    label={product.title}
                    eager={eager}
                    className="transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                />
                {hoverImage && (
                    <img
                        src={thumb(hoverImage, 600)}
                        referrerPolicy="no-referrer"
                        alt=""
                        width="600"
                        height="600"
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 hidden h-full w-full object-cover opacity-0 transition-opacity duration-500 [@media(hover:hover)]:block [@media(hover:hover)]:group-hover:opacity-100"
                    />
                )}
            </Link>

            <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
                {product.discountPercent > 0 && (
                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-white shadow-sm dark:text-black">-{product.discountPercent}%</span>
                )}
                {product.isNew && <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-fg shadow-sm">New</span>}
                {lowStock && <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-bold text-danger shadow-sm ring-1 ring-danger/30">Only {stock} left</span>}
                {outOfStock && <span className="rounded-full bg-fg px-2.5 py-0.5 text-xs font-bold text-bg shadow-sm">Sold out</span>}
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
                    <Link to={href} className="rounded hover:text-primary">{product.title}</Link>
                </h3>
                <div className="mt-1.5 min-h-5">
                    {product.reviewCount > 0 ? <StarRating value={product.rating} count={product.reviewCount} size={14} /> : <span className="text-xs text-muted">No reviews yet</span>}
                </div>

                <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
                    <span className="text-lg font-bold">{formatMoney(product.price)}</span>
                    {product.compareAtPrice > product.price && (
                        <span className="text-sm text-muted line-through">{formatMoney(product.compareAtPrice)}</span>
                    )}
                </div>

                <div className="mt-auto pt-3">
                    {needsOptions ? (
                        <Link to={href} className="flex h-10 w-full items-center justify-center rounded-lg border border-line text-sm font-semibold hover:bg-surface-2">
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
