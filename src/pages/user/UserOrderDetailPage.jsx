import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, CreditCard, MapPin, Star, Truck } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { ErrorState } from "../../components/ui/EmptyState";
import LazyImage from "../../components/ui/LazyImage";
import Skeleton from "../../components/ui/Skeleton";
import { OrderStatusBadge, PaymentStatusBadge } from "../../components/ui/StatusBadge";
import useFetch from "../../hooks/useFetch";
import usePageMeta from "../../hooks/usePageMeta";
import { api, errorMessage } from "../../lib/api";
import { COUNTRIES, formatDate, formatDateRange, formatDateTime, formatMoney, ORDER_STATUS } from "../../lib/format";

const STEPS = ["processing", "shipped", "delivered"];

function Progress({ status }) {
    if (status === "cancelled") return null;
    const index = status === "pending_payment" ? -1 : STEPS.indexOf(status);
    return (
        <ol className="grid grid-cols-3 gap-2" aria-label="Order progress">
            {STEPS.map((step, i) => {
                const done = i <= index;
                return (
                    <li key={step} className="text-center">
                        <div className="flex items-center">
                            <span className={`h-0.5 flex-1 ${i === 0 ? "opacity-0" : i <= index ? "bg-primary" : "bg-line"}`} />
                            <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${done ? "bg-primary text-primary-fg" : "bg-surface-2 text-muted"}`}>
                                {done ? <Check size={16} aria-hidden="true" /> : i + 1}
                            </span>
                            <span className={`h-0.5 flex-1 ${i === STEPS.length - 1 ? "opacity-0" : i < index ? "bg-primary" : "bg-line"}`} />
                        </div>
                        <p className={`mt-2 text-xs font-semibold ${done ? "text-fg" : "text-muted"}`}>{ORDER_STATUS[step].label}</p>
                    </li>
                );
            })}
        </ol>
    );
}

export default function UserOrderDetailPage() {
    const { id } = useParams();
    const { data, loading, error, refetch } = useFetch(`/orders/${id}`);
    const order = data?.data;
    usePageMeta(order ? `Order ${order.orderNumber}` : "Order details", "Order summary, delivery address and tracking history.");
    const [confirm, setConfirm] = useState(false);
    const [busy, setBusy] = useState(false);

    async function cancel() {
        setBusy(true);
        try {
            await api.post(`/orders/${order._id}/cancel`);
            toast.success("Order cancelled");
            setConfirm(false);
            refetch();
        } catch (err) {
            toast.error(errorMessage(err));
        } finally {
            setBusy(false);
        }
    }

    const back = (
        <Link to="/user/orders" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft size={16} aria-hidden="true" /> Back to orders
        </Link>
    );

    if (error) {
        return (
            <div>
                {back}
                <ErrorState message={error.status === 404 ? "We couldn’t find this order on your account." : error.message} onRetry={error.status === 404 ? undefined : refetch} />
            </div>
        );
    }
    if (loading && !order) {
        return <div>{back}<Skeleton className="mb-4 h-24" /><Skeleton className="h-72" /></div>;
    }
    if (!order) return null;

    const address = order.shippingAddress;
    const countryName = COUNTRIES.find(([c]) => c === address?.country)?.[1] || address?.country;
    const unpaid = order.status === "pending_payment" && order.paymentStatus === "pending";
    const reviewable = order.paymentStatus === "paid" && order.status !== "cancelled";
    const timeline = [...(order.timeline || [])].reverse();

    return (
        <div>
            {back}
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">Order {order.orderNumber}</h1>
                    <p className="mt-1 text-sm text-muted">Placed {formatDateTime(order.createdAt)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <OrderStatusBadge status={order.status} />
                    <PaymentStatusBadge status={order.paymentStatus} />
                    {unpaid && <Button variant="danger-soft" size="sm" onClick={() => setConfirm(true)}>Cancel order</Button>}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                <div className="space-y-6">
                    <Card>
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><Truck size={19} className="text-primary" aria-hidden="true" /> Tracking</h2>
                        <Progress status={order.status} />
                        {order.estimatedDelivery && order.status !== "cancelled" && order.status !== "delivered" && (
                            <p className="mt-5 rounded-lg bg-primary-soft px-4 py-3 text-sm">
                                Estimated delivery: <strong>{formatDateRange(order.estimatedDelivery)}</strong>
                            </p>
                        )}
                        {order.deliveredAt && <p className="mt-5 text-sm text-muted">Delivered on {formatDate(order.deliveredAt)}.</p>}

                        <h3 className="mb-3 mt-6 text-sm font-bold uppercase tracking-wide text-muted">History</h3>
                        <ol className="space-y-4 border-l-2 border-line pl-5">
                            {timeline.map((t, i) => (
                                <li key={`${t.at}-${i}`} className="relative">
                                    <span className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full ring-4 ring-surface ${i === 0 ? "bg-primary" : "bg-line"}`} />
                                    <p className="text-sm font-semibold">{t.note || ORDER_STATUS[t.status]?.label}</p>
                                    <p className="text-xs text-muted">{formatDateTime(t.at)}</p>
                                </li>
                            ))}
                        </ol>
                    </Card>

                    <Card padded={false}>
                        <h2 className="border-b border-line px-5 py-4 text-lg font-bold">Items ({order.items.reduce((n, i) => n + i.quantity, 0)})</h2>
                        <ul className="divide-y divide-line">
                            {order.items.map((item, i) => (
                                <li key={`${item.productId}-${i}`} className="flex gap-4 p-4 sm:px-5">
                                    <LazyImage src={item.image} alt={item.title} className="h-20 w-20 shrink-0 rounded-lg object-cover" />
                                    <div className="min-w-0 flex-1">
                                        <Link to={`/shop/${item.productId}`} className="line-clamp-2 font-semibold hover:text-primary">{item.title}</Link>
                                        {(item.variant?.color || item.variant?.size) && (
                                            <p className="text-xs text-muted">{[item.variant.color, item.variant.size].filter(Boolean).join(" / ")}</p>
                                        )}
                                        <p className="mt-1 text-sm text-muted">{formatMoney(item.unitPrice)} × {item.quantity}</p>
                                        {reviewable && (
                                            <Link to={`/shop/${item.productId}#reviews`} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                                                <Star size={14} aria-hidden="true" /> Write a review
                                            </Link>
                                        )}
                                    </div>
                                    <p className="font-bold">{formatMoney(item.lineTotal)}</p>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>

                <aside className="space-y-6">
                    <Card>
                        <h2 className="mb-4 text-lg font-bold">Summary</h2>
                        <dl className="space-y-2 text-sm">
                            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatMoney(order.subtotal)}</dd></div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-primary"><dt>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</dt><dd>−{formatMoney(order.discount)}</dd></div>
                            )}
                            <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd>{order.shipping ? formatMoney(order.shipping) : "Free"}</dd></div>
                            <div className="flex justify-between"><dt className="text-muted">Tax</dt><dd>{formatMoney(order.tax)}</dd></div>
                            <div className="flex justify-between border-t border-line pt-3 text-base font-bold"><dt>Total</dt><dd>{formatMoney(order.total)}</dd></div>
                        </dl>
                    </Card>

                    <Card>
                        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold"><CreditCard size={18} className="text-primary" aria-hidden="true" /> Payment</h2>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted">Card via Stripe</span>
                            <PaymentStatusBadge status={order.paymentStatus} />
                        </div>
                        {order.paidAt && <p className="mt-2 text-xs text-muted">Paid {formatDateTime(order.paidAt)}</p>}
                        {order.refundedAt && <p className="mt-2 text-xs text-muted">Refunded {formatDateTime(order.refundedAt)}</p>}
                    </Card>

                    {address && (
                        <Card>
                            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold"><MapPin size={18} className="text-primary" aria-hidden="true" /> Shipping address</h2>
                            <address className="text-sm not-italic leading-6 text-muted">
                                <span className="font-semibold text-fg">{address.fullName}</span><br />
                                {address.line1}<br />
                                {address.line2 && <>{address.line2}<br /></>}
                                {address.city}, {address.state} {address.postalCode}<br />
                                {countryName}<br />
                                {address.phone}
                            </address>
                        </Card>
                    )}
                </aside>
            </div>

            <ConfirmDialog
                open={confirm}
                title="Cancel this order?"
                message="This order hasn’t been paid yet. Cancelling it will close the checkout session."
                confirmLabel="Cancel order"
                danger
                loading={busy}
                onConfirm={cancel}
                onCancel={() => setConfirm(false)}
            />
        </div>
    );
}
