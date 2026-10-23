import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import usePageMeta from "../../hooks/usePageMeta";
import useCart from "../../hooks/useCart";
import { api } from "../../lib/api";
import { formatDateRange } from "../../lib/format";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import { LinkButton } from "../../components/ui/Button";
import { PaymentStatusBadge } from "../../components/ui/StatusBadge";
import { AddressBlock, OrderItems, OrderTotals } from "../../components/checkout/OrderDetails";

const MAX_ATTEMPTS = 10;

export default function CheckoutSuccessPage() {
    usePageMeta("Order confirmation", "Your payment status and order details.");
    const [params] = useSearchParams();
    const sessionId = params.get("session_id");
    const { clear } = useCart();
    const [state, setState] = useState({ order: null, error: null, done: false });
    const cleared = useRef(false);

    useEffect(() => {
        if (!sessionId) return undefined;
        let live = true;
        let timer;
        let attempts = 0;

        async function check() {
            try {
                const res = await api.get(`/payments/session/${encodeURIComponent(sessionId)}`);
                if (!live) return;
                attempts += 1;
                const pending = res.data.paymentStatus === "pending";
                setState({ order: res.data, error: null, done: !pending || attempts >= MAX_ATTEMPTS });
                if (pending && attempts < MAX_ATTEMPTS) timer = setTimeout(check, 2000);
            } catch (error) {
                if (live) setState({ order: null, error, done: true });
            }
        }
        check();

        return () => {
            live = false;
            clearTimeout(timer);
        };
    }, [sessionId]);

    const order = state.order;
    const paid = order?.paymentStatus === "paid" || order?.paymentStatus === "refunded";

    useEffect(() => {
        if (paid && !cleared.current) {
            cleared.current = true;
            clear();
        }
    }, [paid, clear]);

    if (!sessionId) {
        return (
            <EmptyState
                icon={XCircle}
                title="No payment session found"
                description="This page needs a valid payment session. If you just paid, check My Orders for the latest status."
                action={<LinkButton to="/user/orders">Go to my orders</LinkButton>}
            />
        );
    }

    if (state.error) {
        return (
            <EmptyState
                icon={XCircle}
                title={state.error.status === 404 ? "We couldn’t find that order" : "We couldn’t check your payment"}
                description={state.error.status === 404 ? "This payment session doesn’t belong to your account." : state.error.message}
                action={<LinkButton to="/user/orders">View my orders</LinkButton>}
            />
        );
    }

    if (!order) return <Spinner label="Confirming your payment" className="min-h-[50vh]" />;

    if (order.paymentStatus === "pending") {
        return (
            <div className="mx-auto max-w-xl">
                <EmptyState
                    icon={Clock}
                    title="We’re confirming your payment"
                    description={`Order ${order.orderNumber} is waiting for confirmation from Stripe. This can take a minute. You can safely leave this page, your order will update automatically in My Orders.`}
                    action={<LinkButton to="/user/orders">View my orders</LinkButton>}
                />
            </div>
        );
    }

    if (!paid) {
        return (
            <div className="mx-auto max-w-xl">
                <EmptyState
                    icon={XCircle}
                    title="Your payment didn’t go through"
                    description={`Order ${order.orderNumber} was not paid, so you haven’t been charged. Your cart is still saved, so you can try again.`}
                    action={<LinkButton to="/cart">Back to cart</LinkButton>}
                />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex flex-col items-center text-center">
                <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <CheckCircle2 size={34} aria-hidden="true" />
                </span>
                <h1 className="text-2xl font-bold sm:text-3xl">Thank you, your order is confirmed</h1>
                <p className="mt-2 text-muted">We’ve received your payment and are preparing your order.</p>
            </div>

            <Card className="mb-6">
                <dl className="grid gap-5 sm:grid-cols-3">
                    <div><dt className="text-xs font-semibold uppercase tracking-wide text-muted">Order number</dt><dd className="mt-1 font-bold">{order.orderNumber}</dd></div>
                    <div><dt className="text-xs font-semibold uppercase tracking-wide text-muted">Estimated delivery</dt><dd className="mt-1 font-bold">{formatDateRange(order.estimatedDelivery)}</dd></div>
                    <div><dt className="text-xs font-semibold uppercase tracking-wide text-muted">Payment</dt><dd className="mt-1"><PaymentStatusBadge status={order.paymentStatus} /></dd></div>
                </dl>
            </Card>

            <div className="space-y-6">
                <OrderItems order={order} />
                <div className="grid gap-6 sm:grid-cols-2">
                    <Card><h2 className="mb-3 text-lg font-bold">Shipping to</h2><AddressBlock address={order.shippingAddress} /></Card>
                    <Card><h2 className="mb-3 text-lg font-bold">Payment summary</h2><OrderTotals order={order} /></Card>
                </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
                <LinkButton to={`/track-order/${order._id}`}>Track this order</LinkButton>
                <LinkButton to="/shop" variant="outline">Continue shopping</LinkButton>
            </div>
            <p className="mt-5 text-center text-xs text-muted">
                Need help with this order? <Link to="/contact" className="font-semibold text-primary hover:underline">Contact support</Link> and quote {order.orderNumber}.
            </p>
        </div>
    );
}
