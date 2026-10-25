import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PackageSearch } from "lucide-react";
import toast from "react-hot-toast";
import usePageMeta from "../../hooks/usePageMeta";
import useFetch from "../../hooks/useFetch";
import useCart from "../../hooks/useCart";
import useRecentlyViewed from "../../hooks/useRecentlyViewed";
import { useWishlist } from "../../context/WishlistContext";
import { titleCase } from "../../lib/format";
import { absoluteUrl } from "../../lib/productImages";
import Gallery from "../../components/product/Gallery";
import BuyBox from "../../components/product/BuyBox";
import ProductTabs from "../../components/product/ProductTabs";
import ReviewsSection from "../../components/product/ReviewsSection";
import StickyBuyBar from "../../components/product/StickyBuyBar";
import RecentlyViewed from "../../components/product/RecentlyViewed";
import { FREE_SHIPPING_OVER, SHIPPING_FLAT } from "../../components/product/shippingInfo";
import ProductGrid from "../../components/shop/ProductGrid";
import { LinkButton } from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import EmptyState, { ErrorState } from "../../components/ui/EmptyState";

const prefersReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function useProductJsonLd(product) {
    useEffect(() => {
        const images = (product.images?.length ? product.images : [product.image]).map(absoluteUrl);
        const data = {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            image: images,
            description: product.description,
            sku: product.sku || undefined,
            brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
            offers: {
                "@type": "Offer",
                url: window.location.href,
                priceCurrency: "USD",
                price: Number(product.price).toFixed(2),
                itemCondition: "https://schema.org/NewCondition",
                availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            },
            ...(product.reviewCount > 0 && {
                aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewCount },
            }),
        };
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.id = "product-jsonld";
        script.text = JSON.stringify(data);
        document.head.appendChild(script);
        return () => script.remove();
    }, [product]);
}

function Specs({ product }) {
    const rows = [...(product.specs || []), ...(product.sku ? [{ label: "SKU", value: product.sku }] : [])];
    if (!rows.length) return <p className="text-sm text-muted">No specifications listed for this product.</p>;
    return (
        <dl className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
            {rows.map((s) => (
                <div key={s.label} className="grid gap-1 px-5 py-3 text-sm sm:grid-cols-[220px_1fr] sm:gap-4">
                    <dt className="font-semibold">{s.label}</dt>
                    <dd className="text-muted">{s.value}</dd>
                </div>
            ))}
        </dl>
    );
}

function ShippingReturns() {
    return (
        <div className="max-w-3xl space-y-5 text-sm">
            <div>
                <h3 className="font-bold">Shipping</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
                    <li>Standard shipping is ${SHIPPING_FLAT.toFixed(2)}, and free on orders of ${FREE_SHIPPING_OVER} or more.</li>
                    <li>Orders usually arrive within 3-7 business days after payment is confirmed.</li>
                    <li>Track your order any time from <Link to="/track-order" className="font-semibold text-primary hover:underline">Track order</Link>.</li>
                </ul>
            </div>
            <div>
                <h3 className="font-bold">Returns</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
                    <li>Return unused items in their original packaging within 30 days of delivery.</li>
                    <li>Refunds go back to your original payment method once we have inspected the return.</li>
                </ul>
            </div>
            <p className="text-muted">Full details are in our <Link to="/shipping-returns" className="font-semibold text-primary hover:underline">shipping and returns policy</Link>.</p>
        </div>
    );
}

function ProductView({ product, onReviewChanged }) {
    const navigate = useNavigate();
    const cart = useCart();
    const wishlist = useWishlist();
    const id = String(product._id);
    const [color, setColor] = useState("");
    const [size, setSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [errors, setErrors] = useState({});
    const [tab, setTab] = useState("description");
    const ctaRef = useRef(null);
    const related = useFetch(`/products/${id}/related`);
    const recentIds = useRecentlyViewed(id);

    const stock = product.stock ?? 0;
    const images = product.images?.length ? product.images : [product.image];
    const cartSubtotal = cart.items.reduce((sum, i) => sum + (Number(i.price) || 0) * i.quantity, 0);

    useProductJsonLd(product);

    function validate() {
        const next = {};
        if (product.colors?.length && !color) next.color = "Please choose a colour.";
        if (product.sizes?.length && !size) next.size = "Please choose a size.";
        setErrors(next);
        if (Object.keys(next).length) {
            requestAnimationFrame(() => document.querySelector("fieldset [role='alert']")?.scrollIntoView({ block: "center", behavior: prefersReducedMotion() ? "auto" : "smooth" }));
            return false;
        }
        return true;
    }

    function addToCart() {
        if (!validate()) return false;
        const variant = color || size ? { ...(color && { color }), ...(size && { size }) } : undefined;
        cart.add({ productId: id, slug: product.slug, title: product.title, image: product.image, price: product.price, ...(variant && { variant }) }, quantity);
        return true;
    }

    async function share() {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({ title: product.title, text: `${product.title} at ShopSphere`, url });
            } else {
                await navigator.clipboard.writeText(url);
                toast.success("Link copied to clipboard");
            }
        } catch (error) {
            if (error?.name !== "AbortError") toast.error("Could not share this product.");
        }
    }

    function openReviews() {
        setTab("reviews");
        requestAnimationFrame(() => document.getElementById("product-tabs")?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" }));
    }

    const tabs = [
        { id: "description", label: "Description", panel: <p className="max-w-3xl whitespace-pre-line text-muted">{product.description}</p> },
        { id: "specs", label: "Specifications", panel: <Specs product={product} /> },
        { id: "shipping", label: "Shipping & returns", panel: <ShippingReturns /> },
        {
            id: "reviews",
            label: `Reviews${product.reviewCount > 0 ? ` (${product.reviewCount})` : ""}`,
            panel: <ReviewsSection productId={id} rating={product.rating || 0} reviewCount={product.reviewCount || 0} onChanged={onReviewChanged} />,
        },
    ];

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

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
                <Gallery images={images} title={product.title} alts={product.imageAlts} credits={product.imageCredits} />
                <BuyBox
                    product={product}
                    stock={stock}
                    color={color}
                    size={size}
                    setColor={(v) => { setColor(v); setErrors((e) => ({ ...e, color: undefined })); }}
                    setSize={(v) => { setSize(v); setErrors((e) => ({ ...e, size: undefined })); }}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    errors={errors}
                    saved={wishlist.has(id)}
                    cartSubtotal={cartSubtotal}
                    ctaRef={ctaRef}
                    onAdd={() => addToCart() && toast.success("Added to cart")}
                    onBuyNow={() => addToCart() && navigate("/checkout")}
                    onToggleWishlist={() => wishlist.toggle(id)}
                    onShare={share}
                    onOpenReviews={openReviews}
                />
            </div>

            <ProductTabs tabs={tabs} active={tab} onChange={setTab} />

            {related.data?.data?.length > 0 && (
                <section aria-labelledby="related-heading" className="mt-14">
                    <h2 id="related-heading" className="mb-5 text-2xl font-bold">You may also like</h2>
                    <ProductGrid products={related.data.data} />
                </section>
            )}

            <RecentlyViewed ids={recentIds} />

            <StickyBuyBar title={product.title} price={product.price} disabled={stock === 0} ctaRef={ctaRef} onAdd={() => addToCart() && toast.success("Added to cart")} />
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
            <div role="status" aria-label="Loading product">
                <Skeleton className="mb-5 h-4 w-72" />
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                    <div>
                        <Skeleton className="aspect-square w-full" />
                        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="aspect-square" />)}</div>
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-9 w-3/4" />
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-24" />
                        <Skeleton className="h-11 w-40" />
                        <Skeleton className="h-12" />
                    </div>
                </div>
                <Skeleton className="mt-12 h-48" />
            </div>
        );
    }

    return <ProductView key={product._id} product={product} onReviewChanged={refetch} />;
}
