import Badge from "./Badge";
import { ORDER_STATUS, PAYMENT_STATUS } from "../../lib/format";

export function OrderStatusBadge({ status }) {
    const s = ORDER_STATUS[status] || { label: status, tone: "neutral" };
    return <Badge tone={s.tone}>{s.label}</Badge>;
}

export function PaymentStatusBadge({ status }) {
    const s = PAYMENT_STATUS[status] || { label: status, tone: "neutral" };
    return <Badge tone={s.tone}>{s.label}</Badge>;
}
