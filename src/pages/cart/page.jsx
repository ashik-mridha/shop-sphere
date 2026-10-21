import { useEffect, useState } from "react";
import EmptyCart from "./EmptyCart";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

const CART_KEY = "shopsphere_cart";

const Cartpage = () => {
    const [cart, setCart] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(
            "shopsphere_cart",
            JSON.stringify(cart)
        );

        window.dispatchEvent(new Event("cartUpdated"));
    }, [cart]);

    const updateQuantity = (item, change) => {
        setCart((current) =>
            current
                .map((product) =>
                    (product._id || product.id) === (item._id || item.id)
                        ? {
                            ...product,
                            quantity: Math.max(
                                1,
                                Math.min(99, (product.quantity || 1) + change)
                            ),
                        }
                        : product
                )
        );
    };

    const removeItem = (item) => {
        setCart((current) =>
            current.filter(
                (product) =>
                    (product._id || product.id) !== (item._id || item.id)
            )
        );
    };

    const subtotal = cart.reduce(
        (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
        0
    );

    return (
        <main className="mx-auto min-h-screen max-w-6xl px-4 py-10">
            <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

            {cart.length === 0 ? (
                <EmptyCart />
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <section className="space-y-4 md:col-span-2">
                        {cart.map((item) => (
                            <CartItem
                                key={item._id || item.id}
                                item={item}
                                onUpdate={updateQuantity}
                                onRemove={removeItem}
                            />
                        ))}

                        <button
                            onClick={() => setCart([])}
                            className="text-sm text-red-500 hover:underline"
                        >
                            Clear Cart
                        </button>
                    </section>

                    <CartSummary subtotal={subtotal} />
                </div>
            )}
        </main>
    );
};

export default Cartpage;