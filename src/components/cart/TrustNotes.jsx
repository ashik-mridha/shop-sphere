import { Lock, RotateCcw, Truck } from "lucide-react";

export default function TrustNotes() {
    return (
        <ul className="mt-5 space-y-2.5 border-t border-line pt-5 text-xs text-muted">
            <li className="flex items-center gap-2.5"><Lock size={15} className="text-primary" aria-hidden="true" /> Secure checkout, payments powered by Stripe</li>
            <li className="flex items-center gap-2.5"><Truck size={15} className="text-primary" aria-hidden="true" /> Free shipping on orders over $75</li>
            <li className="flex items-center gap-2.5"><RotateCcw size={15} className="text-primary" aria-hidden="true" /> 30-day returns on unused items</li>
        </ul>
    );
}
