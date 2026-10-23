import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Heart, Lock, Minus, Plus, RotateCcw, ShoppingCart, Truck } from "lucide-react";
import toast from "react-hot-toast";
import usePageMeta from "../../hooks/usePageMeta";
import useFetch from "../../hooks/useFetch";
import useCart from "../../hooks/useCart";
import { useWishlist } from "../../context/WishlistContext";
import { formatMoney, titleCase } from "../../lib/format";
import Gallery from "../../components/product/Gallery";
import ReviewsSection from "../../components/product/ReviewsSection";
import ProductGrid from "../../components/shop/ProductGrid";
import Button, { LinkButton } from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import StarRating from "../../components/ui/StarRating";
import Skeleton from "../../components/ui/Skeleton";
import EmptyState, { ErrorState } from "../../components/ui/EmptyState";
import { PackageSearch } from "lucide-react";

function addBusinessDays(days) {
    const d = new Date();
    let added = 0;
    while (added < days) {
        d.setDate(d.getDate() + 1);
        if (d.getDay() !== 0 && d.getDay() !== 6) added += 1;
    }
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function OptionGroup({ legend, options, value, onChange }) {
    return (
        <fieldset>
            <legend className="mb-2 text-sm font-semibold">{legend}: <span className="font-normal text-muted">{value}</span></legend>
            <div className="flex flex-wrap gap-2">
                {options.map((o) => (
                    <label key={o} className="cursor-pointer">
                        <input type="radio" name={legend} value={o} checked={value === o} onChange={() => onChange(o)} className="peer sr-only" />
                        <span className="block rounded-lg border border-line px-4 py-2 text-sm font-medium peer-checked:border-primary peer-checked:bg-primary-soft peer-checked:text-primary peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary hover:bg-surface-2">
                            {o}
                        </span>
                    </label>
                ))}
            </div>
        </fieldset>
    );
}

function ProductView({ product, onReviewChanged }) {
    const navigate = useNavigate();
    const cart = useCart();
    const wishlist = useWishlist();
    const id = String(product._id);
    const [color, setColor] = useState(product.colors?.[0] || "");
    const [size, setSize] = useState(product.sizes?.[0] || "");
    const [quantity, setQuantity] = useState(1);
    const related = useFetch(`/products/${id}/related`);

    const stock = product.stock ?? 0;
    const maxQty = Math.max(1, Math.min(stock, 99));
    const saved = wishlist.has(id);

    function addToCart() {
        const variant = color || size ? { ...(color && { color }), ...(size && { size }) } : undefined;
        cart.add({ productId: id, slug: product.slug, title: product.title, image: product.image, price: product.price, ...(variant && { variant }) }, quantity);
    }

    const stockBadge =
        stock === 0 ? <Badge tone="danger">Out of stock</Badge>
        : stock <= 5 ? <Badge tone="warning">Only {stock} left</Badge>
        : <Badge tone="success">In stock</Badge>;

    return (
        <>
            <nav aria-label="Breadcrumb" className="mb-5 text-sm text-muted">
                <ol className="flex flex-wrap items-center gap-1.5">
                    <li><Link to="/" className="hover:text-primary">Home</Link></li>
                    <li aria-hidden="true">/</li>
                    <li><Link to="/shop" className="hover:text-primary">Shop</Link></li>
                    <li aria-hidden="true">/</li>
                    <li><Link to={`/shop?category=${product.category}`} className="hover:text-primary">{titleCase(product.category)}</Link></li>
                    <li aria-hidden="true">/</li>
                    <li aria-current="page" className="max-w-[16rem] truncate font-medium text-fg">{product.title}</li>
                </ol>
            </nav>

            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                <Gallery images={product.images?.length ? product.images : [product.image]} title={product.title} />

                <div className="min-w-0">
                    {product.brand && <p className="text-sm font-semibold uppercase tracking-wide text-primary">{product.brand}</p>}
                    <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{product.title}</h1>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                        {product.reviewCount > 0 ? (
                            <a href="#reviews-heading"><StarRating value={product.rating} count={product.reviewCount} size={18} /></a>
                        ) : (
                            <span className="text-sm text-muted">No reviews yet</span>
                        )}
                        {stockBadge}
                    </div>

                    <div className="mt-5 flex flex-wrap items-baseline gap-3">
                        <span className="text-3xl font-extrabold">{formatMoney(product.price)}</span>
                        {product.compareAtPrice > product.price && (
                            <>
                                <span className="text-lg text-muted line-through">{formatMoney(product.compareAtPrice)}</span>
                                <Badge tone="warning">Save {product.discountPercent}%</Badge>
                            </>
                        )}
                    </div>

                    <p className="mt-5 text-muted">{product.description}</p>

                    <div className="mt-6 space-y-5">
                        {product.colors?.length > 0 && <OptionGroup legend="Colour" options={product.colors} value={color} onChange={setColor} />}
                        {product.sizes?.length > 0 && <OptionGroup legend="Size" options={product.sizes} value={size} onChange={setSize} />}

                        <div>
                            <p id="qty-label" className="mb-2 text-sm font-semibold">Quantity</p>
                            <div role="group" aria-labelledby="qty-label" className="inline-flex items-center rounded-lg border border-line">
                                <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-11 w-11 items-center justify-center hover:bg-surface-2 disabled:opacity-40">
                                    <Minus size={16} />
                                </button>
                                <span className="w-12 text-center font-semibold" aria-live="polite">{quantity}</span>
                                <button type="button" aria-label="Increase quantity" disabled={quantity >= maxQty || stock === 0} onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))} className="flex h-11 w-11 items-center justify-center hover:bg-surface-2 disabled:opacity-40">
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <Button
                            size="lg"
                            className="flex-1 basis-40"
                            disabled={stock === 0}
                            onClick={() => {
                                addToCart();
                                toast.success("Added to cart");
                            }}
                        >
                            <ShoppingCart size={18} aria-hidden="true" /> Add to cart
                        </Button>
                        <Button
                            size="lg"
                            variant="accent"
                            className="flex-1 basis-40"
                            disabled={stock === 0}
                            onClick={() => {
                                addToCart();
                                navigate("/checkout");
                            }}
                        >
                            Buy now
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            aria-pressed={saved}
                            aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
                            onClick={() => wishlist.toggle(id)}
                        >
                            <Heart size={18} className={saved ? "fill-danger text-danger" : ""} />
                        </Button>
                    </div>

                    <ul className="mt-6 space-y-3 rounded-xl border border-line bg-surface p-4 text-sm">
                        <li className="flex items-start gap-3"><Truck size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" /><span>Order today and it should arrive between <strong>{addBusinessDays(3)}</strong> and <strong>{addBusinessDays(7)}</strong>. Free shipping over $75.</span></li>
                        <li className="flex items-start gap-3"><RotateCcw size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" /><span>30-day returns on unused items in original packaging. <Link to="/shipping-returns" className="font-semibold text-primary hover:underline">See policy</Link></span></li>
                        <li className="flex items-start gap-3"><Lock size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" /><span>Secure checkout. Payments are processed by Stripe.</span></li>
                    </ul>
                </div>
            </div>

            {product.specs?.length > 0 && (
                <section aria-labelledby="specs-heading" className="mt-12">
                    <h2 id="specs-heading" className="text-2xl font-bold">Specifications</h2>
                    <dl className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
                        {product.specs.map((s) => (
                            <div key={s.label} className="grid gap-1 px-5 py-3 text-sm sm:grid-cols-[220px_1fr] sm:gap-4">
                                <dt className="font-semibold">{s.label}</dt>
                                <dd className="text-muted">{s.value}</dd>
                            </div>
                        ))}
                        {product.sku && (
                            <div className="grid gap-1 px-5 py-3 text-sm sm:grid-cols-[220px_1fr] sm:gap-4">
                                <dt className="font-semibold">SKU</dt>
                                <dd className="text-muted">{product.sku}</dd>
                            </div>
                        )}
                    </dl>
                </section>
            )}

            <ReviewsSection productId={id} rating={product.rating || 0} reviewCount={product.reviewCount || 0} onChanged={onReviewChanged} />

            {related.data?.data?.length > 0 && (
                <section aria-labelledby="related-heading" className="mt-14">
                    <h2 id="related-heading" className="mb-5 text-2xl font-bold">You may also like</h2>
                    <ProductGrid products={related.data.data} />
                </section>
            )}
        </>
    );
}

export default function ProductPage() {
    const { slug } = useParams();
    const { data, loading, error, refetch } = useFetch(`/products/${slug}`);
    const product = data?.data;

    usePageMeta(product ? product.title : error?.status === 404 ? "Product not found" : "Product", product?.description?.slice(0, 155));

    if (error?.status === 404 || error?.status === 400) {
        return (
            <EmptyState
                icon={PackageSearch}
                title="This product isn’t available"
                description="It may have been removed or the link is incorrect."
                action={<LinkButton to="/shop">Back to the shop</LinkButton>}
            />
        );
    }
    if (error) return <ErrorState message={error.message} onRetry={refetch} />;
    if (loading || !product) {
        return (
            <div className="grid gap-8 lg:grid-cols-2" role="status" aria-label="Loading product">
                <Skeleton className="aspect-square" />
                <div className="space-y-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-9 w-3/4" />
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-24" />
                    <Skeleton className="h-12" />
                </div>
            </div>
        );
    }

    return <ProductView key={product._id} product={product} onReviewChanged={refetch} />;
}
