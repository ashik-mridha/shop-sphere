import { Ticket } from "lucide-react";
import toast from "react-hot-toast";
import useFetch from "../../hooks/useFetch";
import { formatMoney } from "../../lib/format";

function describe(c) {
    if (c.description) return c.description;
    const off = c.type === "percent" ? `${c.value}% off` : `${formatMoney(c.value)} off`;
    return c.minSubtotal ? `${off} orders over ${formatMoney(c.minSubtotal)}` : off;
}

export default function DealsBanner() {
    const { data } = useFetch("/coupons/public");
    const coupons = data?.data || [];
    if (!coupons.length) return null;

    async function copy(code) {
        try {
            await navigator.clipboard.writeText(code);
            toast.success(`Code ${code} copied. Apply it in your cart.`);
        } catch {
            toast(`Use code ${code} in your cart.`);
        }
    }

    return (
        <section aria-label="Promo codes" className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary-soft via-primary-soft to-accent-soft p-5 sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-bold text-primary">
                <Ticket size={22} aria-hidden="true" /> Promo codes you can use today
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {coupons.map((c) => (
                    <li key={c._id} className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-primary bg-surface p-4">
                        <div className="min-w-0">
                            <p className="font-mono text-lg font-extrabold tracking-wider">{c.code}</p>
                            <p className="text-sm text-muted">{describe(c)}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => copy(c.code)}
                            className="shrink-0 rounded-lg border border-line px-3 py-2 text-sm font-semibold hover:bg-surface-2"
                        >
                            Copy code
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}
