import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Check, PackageSearch, X } from "lucide-react";
import usePageMeta from "../../hooks/usePageMeta";
import useFetch from "../../hooks/useFetch";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button, { LinkButton } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import EmptyState, { ErrorState } from "../../components/ui/EmptyState";
import { OrderStatusBadge, PaymentStatusBadge } from "../../components/ui/StatusBadge";
import { AddressBlock, OrderItems, OrderTotals } from "../../components/checkout/OrderDetails";
import { ORDER_STATUS, formatDateRange, formatDateTime } from "../../lib/format";

const STEPS = ["pending_payment", "processing", "shipped", "delivered"];

function Stepper({ order }) {
    const cancelled = order.status === "cancelled";
    const current = STEPS.indexOf(order.status);
    return (
        <ol className="grid grid-cols-4 gap-2" aria-label="Order progress">
            {STEPS.map((step, i) => {
                const done = !cancelled && i <= current;
                return (
                    <li key={step} className="flex flex-col items-center text-center" aria-current={!cancelled && i === current ? "step" : undefined}>
                        <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${done ? "bg-primary text-primary-fg" : "bg-surface-2 text-muted"}`}>
                            {done ? <Check size={17} aria-hidden="true" /> : i + 1}
                        </span>
                        <span className={`mt-2 text-[11px] font-semibold leading-tight sm:text-xs ${done ? "text-fg" : "text-muted"}`}>{ORDER_STATUS[step].label}</span>
                    </li>
                );
            })}
        </ol>
    );
}

function OrderView({ id }) {
    const { data, loading, error, refetch } = useFetch(`/orders/${encodeURIComponent(id)}`);
    usePageMeta("Track order", "Follow the progress of your ShopSphere order.");

    if (loading && !data) return <Spinner label="Loading order" className="min-h-[40vh]" />;
    if (error?.status === 404 || error?.status === 400) {
        return (
            <EmptyState
                icon={PackageSearch}
                title="Order not found"
                description="We couldn’t find an order with that number on your account. Check the number in your order confirmation and try again."
                action={<LinkButton to="/track-order">Search again</LinkButton>}
            />
        );
    }
    if (error) return <ErrorState message={error.message} onRetry={refetch} />;

    const order = data.data;
    const timeline = [...(order.timeline || [])].reverse();

    return (
        <>
            <PageHeader
                title={`Order ${order.orderNumber}`}
                description={`Placed ${formatDateTime(order.createdAt)}`}
                actions={<><OrderStatusBadge status={order.status} /><PaymentStatusBadge status={order.paymentStatus} /></>}
            />

            <Card className="mb-6">
                {order.status === "cancelled" ? (
                    <p className="flex items-center gap-3 text-sm font-semibold text-danger"><X size={18} aria-hidden="true" /> This order was cancelled.{order.paymentStatus === "refunded" && " Your payment has been refunded."}</p>
                ) : (
                    <>
                        <Stepper order={order} />
                        {order.estimatedDelivery && order.status !== "delivered" && (
                            <p className="mt-5 text-center text-sm text-muted">Estimated delivery: <strong className="text-fg">{formatDateRange(order.estimatedDelivery)}</strong></p>
                        )}
                        {order.status === "pending_payment" && <p className="mt-5 text-center text-sm text-muted">Waiting for payment to complete.</p>}
                    </>
                )}
            </Card>

            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <div className="space-y-6">
                    <OrderItems order={order} />
                    <Card>
                        <h2 className="mb-4 text-lg font-bold">Tracking history</h2>
                        <ol className="space-y-5 border-l border-line pl-5">
                            {timeline.map((t, i) => (
                                <li key={`${t.at}-${i}`} className="relative">
                                    <span className={`absolute -left-[26px] top-1 h-3 w-3 rounded-full ring-4 ring-surface ${i === 0 ? "bg-primary" : "bg-line"}`} aria-hidden="true" />
                                    <p className="text-sm font-semibold">{t.note || ORDER_STATUS[t.status]?.label}</p>
                                    <p className="text-xs text-muted">{formatDateTime(t.at)}</p>
                                </li>
                            ))}
                        </ol>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card><h2 className="mb-3 text-lg font-bold">Shipping to</h2><AddressBlock address={order.shippingAddress} /></Card>
                    <Card><h2 className="mb-3 text-lg font-bold">Payment summary</h2><OrderTotals order={order} /></Card>
                    <Link to="/contact" className="block text-center text-sm font-semibold text-primary hover:underline">Need help with this order?</Link>
                </div>
            </div>
        </>
    );
}

function SearchForm() {
    usePageMeta("Track your order", "Enter your order number to see where your ShopSphere order is.");
    const navigate = useNavigate();
    const [value, setValue] = useState("");

    function submit(e) {
        e.preventDefault();
        const v = value.trim();
        if (v) navigate(`/track-order/${encodeURIComponent(v)}`);
    }

    return (
        <div className="mx-auto max-w-lg py-6">
            <PageHeader title="Track your order" description="Enter the order number from your order confirmation. You can also find all your orders under My Orders." />
            <Card>
                <form onSubmit={submit} className="space-y-4">
                    <Input label="Order number" placeholder="e.g. SS-1A2B3C4D" value={value} onChange={(e) => setValue(e.target.value)} required autoComplete="off" />
                    <Button type="submit" className="w-full">Track order</Button>
                </form>
                <p className="mt-4 text-center text-sm text-muted">Orders are only visible to the account that placed them. <Link to="/user/orders" className="font-semibold text-primary hover:underline">View my orders</Link></p>
            </Card>
        </div>
    );
}

export default function TrackOrderPage() {
    const { id } = useParams();
    return id ? <OrderView id={id} /> : <SearchForm />;
}
