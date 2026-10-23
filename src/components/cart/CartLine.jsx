import { Link } from "react-router-dom";
import { AlertTriangle, Minus, Plus, Trash2 } from "lucide-react";
import LazyImage from "../ui/LazyImage";
import { formatMoney } from "../../lib/format";

export default function CartLine({ item, line, lineKey, onQuantity, onRemove }) {
    const unitPrice = line?.unitPrice ?? item.price;
    const max = line && line.stock > 0 ? Math.min(99, line.stock) : 99;
    const variantText = [item.variant?.color, item.variant?.size].filter(Boolean).join(" / ");
    const href = `/shop/${item.slug || item.productId}`;

    let warning = null;
    if (line?.unavailable) warning = "This product is no longer available. Remove it to continue.";
    else if (line && line.stock === 0) warning = "This product is out of stock. Remove it to continue.";
    else if (line && !line.available) warning = `Only ${line.stock} left in stock. Reduce the quantity to continue.`;

    return (
        <li className="flex gap-3 p-4 sm:gap-5 sm:p-5">
            <Link to={href} className="block h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-2 sm:h-28 sm:w-28" tabIndex={-1} aria-hidden="true">
                <LazyImage src={item.image} alt="" className="h-full w-full object-cover" />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <Link to={href} className="line-clamp-2 text-sm font-semibold hover:text-primary sm:text-base">{item.title}</Link>
                        {variantText && <p className="mt-0.5 text-xs text-muted">{variantText}</p>}
                        <p className="mt-1 text-sm text-muted">{formatMoney(unitPrice)} each</p>
                    </div>
                    <p className="shrink-0 text-sm font-bold sm:text-base">{formatMoney(unitPrice * item.quantity)}</p>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                    <div className="inline-flex items-center rounded-lg border border-line" role="group" aria-label={`Quantity for ${item.title}`}>
                        <button type="button" onClick={() => onQuantity(lineKey, item.quantity - 1)} disabled={item.quantity <= 1} aria-label="Decrease quantity" className="flex h-9 w-9 items-center justify-center hover:bg-surface-2 disabled:opacity-40">
                            <Minus size={15} />
                        </button>
                        <span className="w-9 text-center text-sm font-semibold" aria-live="polite">{item.quantity}</span>
                        <button type="button" onClick={() => onQuantity(lineKey, Math.min(max, item.quantity + 1))} disabled={item.quantity >= max} aria-label="Increase quantity" className="flex h-9 w-9 items-center justify-center hover:bg-surface-2 disabled:opacity-40">
                            <Plus size={15} />
                        </button>
                    </div>
                    <button type="button" onClick={() => onRemove(lineKey)} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-danger hover:bg-danger-soft">
                        <Trash2 size={15} aria-hidden="true" /> Remove
                    </button>
                </div>

                {warning && (
                    <p role="alert" className="mt-3 flex items-start gap-2 rounded-lg bg-danger-soft px-3 py-2 text-xs font-medium text-danger">
                        <AlertTriangle size={14} aria-hidden="true" className="mt-0.5 shrink-0" /> {warning}
                    </p>
                )}
            </div>
        </li>
    );
}
