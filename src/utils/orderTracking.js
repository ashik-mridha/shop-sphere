
import {
    Check,
    Package,
    Truck,
    MapPin,
} from "lucide-react";

export const STEPS = [
    {
        label: "Confirmed",
        description: "We've received your order.",
        icon: Check,
    },
    {
        label: "Processing",
        description: "Your order is being prepared.",
        icon: Package,
    },
    {
        label: "Shipped",
        description: "Your package is on its way.",
        icon: Truck,
    },
    {
        label: "Delivered",
        description: "Your order has been delivered.",
        icon: MapPin,
    },
];

const STATUS_ORDER = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "out for delivery",
    "delivered",
];

export function getStepIndex(status = "pending") {
    const normalized = String(status).toLowerCase();

    if (["cancelled", "canceled"].includes(normalized)) {
        return -1;
    }

    const index = STATUS_ORDER.indexOf(normalized);

    if (index === -1) return 0;
    if (index === 4) return 2;

    return Math.min(index, 3);
}

export function formatDate(date) {
    if (!date) return "Date unavailable";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "Date unavailable";
    }

    return parsed.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
