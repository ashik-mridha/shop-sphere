import { Link } from "react-router-dom";

const CartSummary = ({ subtotal }) => {
    const shipping = subtotal >= 100 || subtotal === 0 ? 0 : 8.99;
    const total = subtotal + shipping;

    return (
        <div className="h-fit rounded-xl border border-gray-600 p-5">
            <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between border-t pt-3 text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>

            <Link
                to="/checkout"
                className="mt-5 block rounded-lg bg-black px-4 py-3 text-center font-semibold text-white"
            >
                Proceed to Checkout
            </Link>

            {subtotal > 0 && subtotal < 100 && (
                <p className="mt-3 text-sm text-gray-500">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping.
                </p>
            )}
        </div>
    );
};

export default CartSummary;