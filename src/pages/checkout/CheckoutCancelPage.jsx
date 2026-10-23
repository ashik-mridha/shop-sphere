import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { XCircle } from "lucide-react";
import toast from "react-hot-toast";
import usePageMeta from "../../hooks/usePageMeta";
import { api, errorMessage } from "../../lib/api";
import Button, { LinkButton } from "../../components/ui/Button";

export default function CheckoutCancelPage() {
    usePageMeta("Payment cancelled", "Your payment was cancelled and you have not been charged.");
    const [params] = useSearchParams();
    const orderId = params.get("order_id");
    const [busy, setBusy] = useState(false);
    const [cancelled, setCancelled] = useState(false);

    async function cancelOrder() {
        setBusy(true);
        try {
            await api.post(`/orders/${encodeURIComponent(orderId)}/cancel`);
            setCancelled(true);
            toast.success("The unpaid order was cancelled.");
        } catch (error) {
            toast.error(errorMessage(error));
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="mx-auto flex max-w-lg flex-col items-center py-10 text-center">
            <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent">
                <XCircle size={32} aria-hidden="true" />
            </span>
            <h1 className="text-2xl font-bold sm:text-3xl">Your payment was cancelled</h1>
            <p className="mt-3 text-muted">You haven’t been charged. The items are still in your cart, so you can pick up where you left off whenever you’re ready.</p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
                <LinkButton to="/cart">Return to cart</LinkButton>
                <LinkButton to="/shop" variant="outline">Continue shopping</LinkButton>
            </div>

            {orderId && !cancelled && (
                <div className="mt-8 border-t border-line pt-6">
                    <p className="mb-3 text-sm text-muted">Don’t want to complete this order? You can cancel the unpaid order.</p>
                    <Button variant="ghost" size="sm" onClick={cancelOrder} loading={busy}>Cancel this unpaid order</Button>
                </div>
            )}
            {cancelled && <p role="status" className="mt-8 text-sm font-medium text-primary">The unpaid order has been cancelled.</p>}
        </div>
    );
}
