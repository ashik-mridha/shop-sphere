// Store shipping facts used on the product page (the server stays the source of truth at checkout).
export const FREE_SHIPPING_OVER = 75;
export const SHIPPING_FLAT = 5.99;

function addBusinessDays(days) {
    const d = new Date();
    let added = 0;
    while (added < days) {
        d.setDate(d.getDate() + 1);
        if (d.getDay() !== 0 && d.getDay() !== 6) added += 1;
    }
    return d;
}

const fmt = (d) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

/** 3-7 business days from today. */
export function deliveryWindow() {
    return { from: fmt(addBusinessDays(3)), to: fmt(addBusinessDays(7)) };
}
