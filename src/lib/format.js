const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const number = new Intl.NumberFormat("en-US");
const date = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" });
const dateTime = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

export const formatMoney = (n) => money.format(Number(n) || 0);
export const formatNumber = (n) => number.format(Number(n) || 0);
export const formatDate = (d) => (d ? date.format(new Date(d)) : "—");
export const formatDateTime = (d) => (d ? dateTime.format(new Date(d)) : "—");

export function formatDateRange(range) {
    if (!range?.from) return "—";
    return `${date.format(new Date(range.from))} – ${date.format(new Date(range.to))}`;
}

export const ORDER_STATUS = {
    pending_payment: { label: "Awaiting payment", tone: "warning" },
    processing: { label: "Processing", tone: "info" },
    shipped: { label: "Shipped", tone: "primary" },
    delivered: { label: "Delivered", tone: "success" },
    cancelled: { label: "Cancelled", tone: "danger" },
};

export const PAYMENT_STATUS = {
    pending: { label: "Pending", tone: "warning" },
    paid: { label: "Paid", tone: "success" },
    failed: { label: "Failed", tone: "danger" },
    expired: { label: "Expired", tone: "neutral" },
    refunded: { label: "Refunded", tone: "info" },
};

export const COUNTRIES = [
    ["US", "United States"], ["CA", "Canada"], ["GB", "United Kingdom"], ["AU", "Australia"],
    ["DE", "Germany"], ["FR", "France"], ["IN", "India"], ["BD", "Bangladesh"], ["SG", "Singapore"], ["AE", "United Arab Emirates"],
];

export const titleCase = (s = "") => s.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
