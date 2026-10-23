import LazyImage from "../ui/LazyImage";
import Card from "../ui/Card";
import { formatMoney } from "../../lib/format";

export function OrderItems({ order }) {
    return (
        <Card padded={false}>
            <h2 className="border-b border-line px-5 py-4 text-lg font-bold">Items</h2>
            <ul className="divide-y divide-line">
                {order.items.map((i, idx) => (
                    <li key={`${i.productId}-${idx}`} className="flex items-center gap-4 px-5 py-4">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                            <LazyImage src={i.image} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm font-semibold">{i.title}</p>
                            {(i.variant?.color || i.variant?.size) && <p className="text-xs text-muted">{[i.variant.color, i.variant.size].filter(Boolean).join(" / ")}</p>}
                            <p className="text-xs text-muted">{formatMoney(i.unitPrice)} × {i.quantity}</p>
                        </div>
                        <p className="text-sm font-bold">{formatMoney(i.lineTotal)}</p>
                    </li>
                ))}
            </ul>
        </Card>
    );
}

export function OrderTotals({ order }) {
    const rows = [
        ["Subtotal", formatMoney(order.subtotal)],
        ...(order.discount > 0 ? [[`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`, `-${formatMoney(order.discount)}`]] : []),
        ["Shipping", order.shipping === 0 ? "Free" : formatMoney(order.shipping)],
        ["Tax", formatMoney(order.tax)],
    ];
    return (
        <dl className="space-y-2.5 text-sm">
            {rows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3"><dt className="text-muted">{k}</dt><dd className="font-semibold">{v}</dd></div>
            ))}
            <div className="flex justify-between gap-3 border-t border-line pt-3 text-base font-bold"><dt>Total</dt><dd>{formatMoney(order.total)}</dd></div>
        </dl>
    );
}

export function AddressBlock({ address }) {
    if (!address) return null;
    return (
        <address className="text-sm not-italic leading-6 text-muted">
            <span className="font-semibold text-fg">{address.fullName}</span><br />
            {address.line1}{address.line2 ? `, ${address.line2}` : ""}<br />
            {address.city}, {address.state} {address.postalCode}<br />
            {address.country}<br />
            {address.phone}
        </address>
    );
}
