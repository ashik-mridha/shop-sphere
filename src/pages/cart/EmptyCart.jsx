import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyCart = () => {
    return (
        <div className="py-16 text-center">
            <ShoppingCart size={48} className="mx-auto mb-4 text-gray-400" />

            <h2 className="text-2xl font-bold">Your cart is empty</h2>

            <p className="mt-2 text-gray-500">
                Add some products to get started.
            </p>

            <Link
                to="/shop"
                className="mt-5 inline-block rounded-lg bg-black px-6 py-3 text-white"
            >
                Continue Shopping
            </Link>
        </div>
    );
};

export default EmptyCart;