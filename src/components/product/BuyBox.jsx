import { Link } from "react-router-dom";
import { Check, Heart, Lock, Minus, Plus, RotateCcw, Share2, ShoppingCart, Truck } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import StarRating from "../ui/StarRating";
import { formatMoney } from "../../lib/format";
import { FREE_SHIPPING_OVER, deliveryWindow } from "./shippingInfo";

function OptionGroup({ legend, options, value, onChange, error }) {
    return (
        <fieldset aria-describedby={error ? `${legend}-error` : undefined}>
            <legend className="mb-2 text-sm font-semibold">
                {legend}: <span className="font-normal text-muted">{value || "Choose one"}</span>
            </legend>
            <div className="flex flex-wrap gap-2">
                {options.map((o) => (
                    <label key={o} className="cursor-pointer">
                        <input type="radio" name={legend} value={o} checked={value === o} onChange={() => onChange(o)} className="peer sr-only" />
                        <span className="block rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-surface-2 peer-checked:border-primary peer-checked:bg-primary-soft peer-checked:text-primary peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary">
                            {o}
                        </span>
                    </label>
                ))}
            </div>
            {error && <p id={`${legend}-error`} role="alert" className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
        </fieldset>
    );
}

export default function BuyBox({
    product, stock, color, size, setColor, setSize, quantity, setQuantity, errors, saved, cartSubtotal,
    onAdd, onBuyNow, onToggleWishlist, onShare, onOpenReviews, ctaRef,
}) {
    const maxQty = Math.max(1, Math.min(stock, 99));
    const hasDiscount = product.compareAtPrice > product.price;
    const saving = hasDiscount ? product.compareAtPrice - product.price : 0;
    const delivery = deliveryWindow();
    const projected = cartSubtotal + product.price * quantity;
    const remaining = Math.max(0, FREE_SHIPPING_OVER - projected);

    const stockBadge =
        stock === 0 ? <Badge tone="danger">Out of stock</Badge>
        : stock <= 5 ? <Badge tone="warning">Only {stock} left</Badge>
        : <Badge tone="success"><Check size={12} aria-hidden="true" /> In stock</Badge>;

    return (
        <div className="min-w-0">
            {product.brand && <p className="text-sm font-semibold uppercase tracking-wide text-primary">{product.brand}</p>}
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{product.title}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
                {product.reviewCount > 0 ? (
                    <button type="button" onClick={onOpenReviews} aria-label={`Rated ${product.rating} out of 5 from ${product.reviewCount} reviews. Read reviews`} className="rounded">
                        <StarRating value={product.rating} count={product.reviewCount} size={18} />
                    </button>
                ) : (
                    <button type="button" onClick={onOpenReviews} className="text-sm text-muted hover:text-primary">No reviews yet</button>
                )}
                {stockBadge}
            </div>

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-extrabold">{formatMoney(product.price)}</span>
                {hasDiscount && (
                    <>
                        <span className="text-lg text-muted line-through"><span className="sr-only">Was </span>{formatMoney(product.compareAtPrice)}</span>
                        <Badge tone="warning">{product.discountPercent}% off</Badge>
                    </>
                )}
            </div>
            {hasDiscount && <p className="mt-1 text-sm font-semibold text-primary">You save {formatMoney(saving)}</p>}

            {product.highlights?.length > 0 && (
                <ul className="mt-5 space-y-2 text-sm">
                    {product.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2.5">
                            <Check size={16} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                            <span>{h}</span>
                        </li>
                    ))}
                </ul>
            )}

            <div className="mt-6 space-y-5">
                {product.colors?.length > 0 && <OptionGroup legend="Colour" options={product.colors} value={color} onChange={setColor} error={errors.color} />}
                {product.sizes?.length > 0 && <OptionGroup legend="Size" options={product.sizes} value={size} onChange={setSize} error={errors.size} />}

                <div>
                    <p id="qty-label" className="mb-2 text-sm font-semibold">Quantity</p>
                    <div role="group" aria-labelledby="qty-label" className="inline-flex items-center rounded-lg border border-line">
                        <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-11 w-11 items-center justify-center hover:bg-surface-2 disabled:opacity-40">
                            <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-semibold" aria-live="polite" data-testid="qty">{quantity}</span>
                        <button type="button" aria-label="Increase quantity" disabled={quantity >= maxQty || stock === 0} onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))} className="flex h-11 w-11 items-center justify-center hover:bg-surface-2 disabled:opacity-40">
                            <Plus size={16} />
                        </button>
                    </div>
                    {stock > 0 && quantity >= maxQty && <p className="mt-1.5 text-xs text-muted">That is the maximum available for one order.</p>}
                </div>
            </div>

            <div ref={ctaRef} className="mt-6 flex flex-wrap gap-3">
                <Button size="lg" className="flex-1 basis-40" disabled={stock === 0} onClick={onAdd}>
                    <ShoppingCart size={18} aria-hidden="true" /> Add to cart
                </Button>
                <Button size="lg" variant="accent" className="flex-1 basis-40" disabled={stock === 0} onClick={onBuyNow}>
                    Buy now
                </Button>
                <Button size="lg" variant="outline" aria-pressed={saved} aria-label={saved ? "Remove from wishlist" : "Save to wishlist"} onClick={onToggleWishlist}>
                    <Heart size={18} className={saved ? "fill-danger text-danger" : ""} />
                </Button>
                <Button size="lg" variant="outline" aria-label="Share this product" onClick={onShare}>
                    <Share2 size={18} />
                </Button>
            </div>

            {stock > 0 && (
                <div className="mt-5 rounded-xl border border-line bg-surface p-4 text-sm">
                    {remaining > 0 ? (
                        <p><strong>{formatMoney(remaining)}</strong> away from free shipping.</p>
                    ) : (
                        <p className="font-semibold text-primary">This order qualifies for free shipping.</p>
                    )}
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-label="Progress to free shipping" aria-valuemin={0} aria-valuemax={FREE_SHIPPING_OVER} aria-valuenow={Math.min(projected, FREE_SHIPPING_OVER)}>
                        <div className="h-full rounded-full bg-primary motion-safe:transition-all" style={{ width: `${Math.min(100, (projected / FREE_SHIPPING_OVER) * 100)}%` }} />
                    </div>
                </div>
            )}

            <ul className="mt-5 space-y-3 rounded-xl border border-line bg-surface p-4 text-sm">
                <li className="flex items-start gap-3"><Truck size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" /><span>Order today and it should arrive between <strong>{delivery.from}</strong> and <strong>{delivery.to}</strong>.</span></li>
                <li className="flex items-start gap-3"><RotateCcw size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" /><span>Free returns within 30 days on unused items in original packaging. <Link to="/shipping-returns" className="font-semibold text-primary hover:underline">See policy</Link></span></li>
                <li className="flex items-start gap-3"><Lock size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" /><span>Secure checkout. Payments are processed by Stripe.</span></li>
            </ul>
        </div>
    );
}
