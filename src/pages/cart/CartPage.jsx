import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Tag, X } from "lucide-react";
import toast from "react-hot-toast";
import usePageMeta from "../../hooks/usePageMeta";
import useCart from "../../hooks/useCart";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button, { LinkButton } from "../../components/ui/Button";
import EmptyState, { ErrorState } from "../../components/ui/EmptyState";
import CartLine from "../../components/cart/CartLine";
import OrderSummary from "../../components/cart/OrderSummary";
import TrustNotes from "../../components/cart/TrustNotes";
import useQuote from "../../components/cart/useQuote";

export default function CartPage() {
    usePageMeta("Shopping cart", "Review the items in your cart, apply a coupon and continue to secure checkout.");
    const navigate = useNavigate();
    const cart = useCart();
    const { quote, loading, error, refetch } = useQuote(cart.items, cart.couponCode);
    const [code, setCode] = useState("");

    if (cart.items.length === 0) {
        return (
            <EmptyState
                icon={ShoppingBag}
                title="Your cart is empty"
                description="Looks like you haven’t added anything yet. Explore the shop and find something you’ll love."
                action={<LinkButton to="/shop">Start shopping</LinkButton>}
            />
        );
    }

    const lineFor = (item) =>
        quote?.lines.find((l) => cart.lineKey({ productId: l.productId, variant: l.variant }) === cart.lineKey(item));
    const blocked = !quote || quote.lines.some((l) => l.unavailable || !l.available);

    function applyCoupon(e) {
        e.preventDefault();
        const value = code.trim();
        if (!value) return;
        cart.setCoupon(value);
        setCode("");
    }

    function proceed() {
        if (blocked) {
            toast.error("Please fix the highlighted items before checking out.");
            return;
        }
        navigate("/checkout");
    }

    return (
        <>
            <PageHeader title="Shopping cart" description={`${cart.count} item${cart.count === 1 ? "" : "s"} in your cart`} />

            {error && !quote && <ErrorState message={error.message} onRetry={refetch} />}

            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                <Card padded={false}>
                    <ul className="divide-y divide-line">
                        {cart.items.map((item) => {
                            const key = cart.lineKey(item);
                            return <CartLine key={key} item={item} line={lineFor(item)} lineKey={key} onQuantity={cart.setQuantity} onRemove={cart.remove} />;
                        })}
                    </ul>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line p-4 sm:px-5">
                        <Link to="/shop" className="text-sm font-semibold text-primary hover:underline">← Continue shopping</Link>
                        <button type="button" onClick={cart.clear} className="text-sm font-medium text-muted hover:text-danger">Clear cart</button>
                    </div>
                </Card>

                <aside aria-label="Order summary" className="lg:sticky lg:top-24 lg:self-start">
                    <Card>
                        <h2 className="mb-4 text-lg font-bold">Order summary</h2>

                        {cart.couponCode ? (
                            <div className="mb-5">
                                {quote?.coupon ? (
                                    <div className="flex items-center justify-between gap-2 rounded-lg bg-primary-soft px-3 py-2.5 text-sm font-semibold text-primary">
                                        <span className="inline-flex items-center gap-2"><Tag size={15} aria-hidden="true" /> {quote.coupon.code} applied</span>
                                        <button type="button" onClick={() => cart.setCoupon("")} aria-label="Remove coupon" className="rounded p-1 hover:bg-primary/10"><X size={15} /></button>
                                    </div>
                                ) : quote?.couponError ? (
                                    <div role="alert" className="flex items-start justify-between gap-2 rounded-lg bg-danger-soft px-3 py-2.5 text-sm font-medium text-danger">
                                        <span><strong>{cart.couponCode}</strong>: {quote.couponError}</span>
                                        <button type="button" onClick={() => cart.setCoupon("")} aria-label="Remove coupon" className="rounded p-1 hover:bg-danger/10"><X size={15} /></button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted">Checking coupon…</p>
                                )}
                            </div>
                        ) : (
                            <form onSubmit={applyCoupon} className="mb-5 flex gap-2">
                                <div className="flex-1">
                                    <label htmlFor="coupon" className="sr-only">Coupon code</label>
                                    <input
                                        id="coupon"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="Coupon code"
                                        autoComplete="off"
                                        maxLength={40}
                                        className="h-11 w-full rounded-lg border border-line bg-surface px-3.5 text-sm uppercase placeholder:normal-case placeholder:text-muted/70 focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <Button type="submit" variant="outline" disabled={!code.trim()}>Apply</Button>
                            </form>
                        )}

                        <OrderSummary quote={quote} loading={loading} />

                        <Button size="lg" className="mt-6 w-full" onClick={proceed} disabled={!quote}>Proceed to checkout</Button>
                        {quote && blocked && <p className="mt-2 text-center text-xs text-danger">Some items need your attention before checkout.</p>}
                        <TrustNotes />
                    </Card>
                </aside>
            </div>
        </>
    );
}
