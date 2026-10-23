import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Select } from "../ui/Input";
import ConfirmDialog from "../ui/ConfirmDialog";
import LazyImage from "../ui/LazyImage";
import { OrderStatusBadge, PaymentStatusBadge } from "../ui/StatusBadge";
import { api, errorMessage } from "../../lib/api";
import { formatDateRange, formatDateTime, formatMoney, ORDER_STATUS } from "../../lib/format";

const NEXT = ["processing", "shipped", "delivered"];

function Row({ label, value, strong }) {
    return (
        <div className={`flex justify-between gap-4 ${strong ? "border-t border-line pt-2 text-base font-bold" : "text-sm"}`}>
            <dt className={strong ? "" : "text-muted"}>{label}</dt>
            <dd>{value}</dd>
        </div>
    );
}

export default function OrderDetailModal({ order: initial, onClose, onChanged }) {
    const [order, setOrder] = useState(initial);
    const [status, setStatus] = useState(NEXT.includes(initial.status) ? initial.status : "processing");
    const [saving, setSaving] = useState(false);
    const [confirmRefund, setConfirmRefund] = useState(false);
    const [refunding, setRefunding] = useState(false);

    const paid = order.paymentStatus === "paid";
    const cancelled = order.status === "cancelled";
    const canUpdate = paid && !cancelled;
    const canRefund = paid && Boolean(order.paymentIntentId);
    const a = order.shippingAddress || {};

    let blockedReason = "";
    if (cancelled) blockedReason = "This order is cancelled, so its status can no longer change.";
    else if (!paid) blockedReason = "Status can only change after payment is confirmed.";

    async function updateStatus() {
        setSaving(true);
        try {
            const res = await api.patch(`/admin/orders/${order._id}/status`, { status });
            setOrder(res.data);
            toast.success("Order status updated");
            onChanged();
        } catch (error) {
            toast.error(errorMessage(error));
        } finally {
            setSaving(false);
        }
    }

    async function refund() {
        setRefunding(true);
        try {
            const res = await api.post(`/payments/${order._id}/refund`, {});
            setOrder(res.data);
            toast.success("Refund issued and items restocked");
            setConfirmRefund(false);
            onChanged();
        } catch (error) {
            toast.error(errorMessage(error));
            setConfirmRefund(false);
        } finally {
            setRefunding(false);
        }
    }

    return (
        <>
            <Modal open onClose={onClose} title={`Order ${order.orderNumber}`} size="lg">
                <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-2">
                        <OrderStatusBadge status={order.status} />
                        <PaymentStatusBadge status={order.paymentStatus} />
                        <span className="text-sm text-muted">Placed {formatDateTime(order.createdAt)}</span>
                    </div>

                    {(order.needsReview || order.stockIssue) && (
                        <div role="alert" className="flex gap-3 rounded-lg border border-accent/40 bg-accent-soft p-3 text-sm">
                            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                            <ul className="space-y-1">
                                {order.needsReview && <li>The amount Stripe collected did not match the order total. Check this payment in the Stripe dashboard.</li>}
                                {order.stockIssue && <li>Stock ran out before this payment was confirmed. Some items may need to be back-ordered.</li>}
                            </ul>
                        </div>
                    )}

                    <section aria-labelledby="od-items">
                        <h3 id="od-items" className="mb-2 font-bold">Items</h3>
                        <ul className="divide-y divide-line rounded-lg border border-line">
                            {order.items.map((i, idx) => (
                                <li key={`${i.productId}-${idx}`} className="flex items-center gap-3 p-3">
                                    <LazyImage src={i.image} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold">{i.title}</p>
                                        <p className="text-xs text-muted">
                                            {formatMoney(i.unitPrice)} × {i.quantity}
                                            {i.variant && (i.variant.color || i.variant.size) ? ` · ${[i.variant.color, i.variant.size].filter(Boolean).join(" / ")}` : ""}
                                        </p>
                                    </div>
                                    <span className="text-sm font-bold">{formatMoney(i.lineTotal)}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <section aria-labelledby="od-totals">
                            <h3 id="od-totals" className="mb-2 font-bold">Payment</h3>
                            <dl className="space-y-2">
                                <Row label="Subtotal" value={formatMoney(order.subtotal)} />
                                {order.discount > 0 && <Row label={`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`} value={`-${formatMoney(order.discount)}`} />}
                                <Row label="Shipping" value={order.shipping ? formatMoney(order.shipping) : "Free"} />
                                <Row label="Tax" value={formatMoney(order.tax)} />
                                <Row label="Total" value={formatMoney(order.total)} strong />
                            </dl>
                            <dl className="mt-3 space-y-1 text-xs text-muted">
                                <div>Method: {order.paymentMethod === "stripe" ? "Stripe Checkout" : order.paymentMethod}</div>
                                {order.paymentIntentId && <div className="break-all">Payment intent: {order.paymentIntentId}</div>}
                                {order.stripeSessionId && <div className="break-all">Session: {order.stripeSessionId}</div>}
                                {order.paidAt && <div>Paid {formatDateTime(order.paidAt)}</div>}
                                {order.refundedAt && <div>Refunded {formatDateTime(order.refundedAt)}</div>}
                            </dl>
                        </section>

                        <section aria-labelledby="od-ship">
                            <h3 id="od-ship" className="mb-2 font-bold">Customer & shipping</h3>
                            <address className="text-sm not-italic leading-6">
                                <strong>{a.fullName || order.customer?.name}</strong><br />
                                {a.line1}{a.line2 ? `, ${a.line2}` : ""}<br />
                                {[a.city, a.state, a.postalCode].filter(Boolean).join(", ")} {a.country}<br />
                                {order.customer?.email}<br />
                                {order.customer?.phone}
                            </address>
                            {order.estimatedDelivery && (
                                <p className="mt-2 text-xs text-muted">Estimated delivery: {formatDateRange(order.estimatedDelivery)}</p>
                            )}
                        </section>
                    </div>

                    <section aria-labelledby="od-timeline">
                        <h3 id="od-timeline" className="mb-2 font-bold">Timeline</h3>
                        <ol className="space-y-3 border-l-2 border-line pl-4">
                            {[...(order.timeline || [])].reverse().map((t, i) => (
                                <li key={i} className="relative text-sm">
                                    <span className="absolute -left-[22px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
                                    <p className="font-semibold">{ORDER_STATUS[t.status]?.label || t.status}</p>
                                    <p className="text-muted">{t.note}</p>
                                    <p className="text-xs text-muted">{formatDateTime(t.at)}</p>
                                </li>
                            ))}
                        </ol>
                    </section>

                    <section aria-labelledby="od-actions" className="rounded-xl border border-line bg-surface-2 p-4">
                        <h3 id="od-actions" className="mb-3 font-bold">Manage order</h3>
                        <div className="flex flex-wrap items-end gap-3">
                            <Select
                                label="Fulfilment status"
                                wrapperClassName="min-w-48 flex-1"
                                value={status}
                                disabled={!canUpdate}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                {NEXT.map((s) => <option key={s} value={s}>{ORDER_STATUS[s].label}</option>)}
                            </Select>
                            <Button onClick={updateStatus} loading={saving} disabled={!canUpdate || status === order.status}>Update status</Button>
                            <Button variant="danger-soft" onClick={() => setConfirmRefund(true)} disabled={!canRefund}>Refund order</Button>
                        </div>
                        {blockedReason && <p className="mt-3 text-xs text-muted">{blockedReason}</p>}
                        {order.paymentStatus === "refunded" && <p className="mt-3 text-xs text-muted">This order has been refunded and its items were returned to stock.</p>}
                        {canUpdate && <p className="mt-3 text-xs text-muted">Paid orders are cancelled by refunding them, which also restocks the items.</p>}
                    </section>
                </div>
            </Modal>

            <ConfirmDialog
                open={confirmRefund}
                danger
                loading={refunding}
                title="Refund this order?"
                message={`${formatMoney(order.total)} will be returned to the customer through Stripe, the order will be cancelled and its items restocked. This cannot be undone.`}
                confirmLabel="Issue refund"
                onConfirm={refund}
                onCancel={() => setConfirmRefund(false)}
            />
        </>
    );
}
