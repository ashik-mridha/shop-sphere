import { Truck } from "lucide-react";
import Skeleton from "../ui/Skeleton";
import { formatMoney } from "../../lib/format";

function Row({ label, value, strong, tone }) {
    return (
        <div className={`flex items-center justify-between gap-3 ${strong ? "border-t border-line pt-3 text-base font-bold" : "text-sm"}`}>
            <dt className={strong ? "" : "text-muted"}>{label}</dt>
            <dd className={tone === "primary" ? "font-semibold text-primary" : "font-semibold"}>{value}</dd>
        </div>
    );
}

/** Totals block shared by cart and checkout. `quote` comes from POST /cart/quote. */
export default function OrderSummary({ quote, loading }) {
    if (!quote) {
        return (
            <div className="space-y-3" role="status" aria-label="Calculating totals">
                {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-5 w-full" />)}
            </div>
        );
    }

    const remaining = quote.freeShippingOver - (quote.subtotal - quote.discount);

    return (
        <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"} aria-busy={loading}>
            <dl className="space-y-3">
                <Row label={`Subtotal (${quote.itemCount} item${quote.itemCount === 1 ? "" : "s"})`} value={formatMoney(quote.subtotal)} />
                {quote.discount > 0 && <Row label={`Discount (${quote.coupon?.code})`} value={`-${formatMoney(quote.discount)}`} tone="primary" />}
                <Row label="Shipping" value={quote.shipping === 0 ? "Free" : formatMoney(quote.shipping)} tone={quote.shipping === 0 ? "primary" : undefined} />
                <Row label={`Estimated tax (${Math.round(quote.taxRate * 100)}%)`} value={formatMoney(quote.tax)} />
                <Row label="Total" value={formatMoney(quote.total)} strong />
            </dl>
            {quote.shipping > 0 && remaining > 0 && (
                <p className="mt-4 flex items-start gap-2 rounded-lg bg-primary-soft px-3 py-2.5 text-xs font-medium text-primary">
                    <Truck size={15} aria-hidden="true" className="mt-0.5 shrink-0" />
                    Add {formatMoney(remaining)} more to get free shipping.
                </p>
            )}
        </div>
    );
}
