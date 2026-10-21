
import { Package, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function OrderSummary({ order }) {
    const productImage = order.productImage || order.image;
    const unitPrice = Number(order.unitPrice ?? order.price ?? 0);
    const quantity = Number(order.quantity || 1);
    const total = Number(order.total ?? unitPrice * quantity);

    return (
        <section className="rounded-2xl border border-gray-200 p-5 sm:p-7 lg:col-span-2">
            <h2 className="mb-6 text-lg font-bold">
                Order Items
            </h2>

            <div className="flex items-start gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                    {productImage ? (
                        <img
                            src={productImage}
                            alt={order.productTitle || "Product"}
                            className="h-full w-full object-contain"
                        />
                    ) : (
                        <Package
                            size={30}
                            className="text-gray-400"
                        />
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="break-words text-sm font-semibold">
                        {order.productTitle || "Product"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        ${unitPrice.toFixed(2)} × {quantity}
                    </p>
                </div>

                <p className="shrink-0 text-sm font-semibold">
                    ${total.toFixed(2)}
                </p>
            </div>

            <div className="my-6 border-t border-gray-200" />

            <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span className="font-medium text-emerald-700">
                        Free
                    </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-base font-bold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {order.customer && (
                <div className="mt-6 rounded-xl bg-gray-50 p-4">
                    <h3 className="mb-2 text-sm font-semibold">
                        Delivery Information
                    </h3>

                    <p className="text-sm text-gray-700">
                        {order.customer.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        {order.customer.phone}
                    </p>

                    <p className="mt-1 break-words text-sm text-gray-500">
                        {order.customer.address}
                    </p>
                </div>
            )}

            <Link
                to="/shop"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
                <ShoppingBag size={17} />
                Continue Shopping
            </Link>
        </section>
    );
}
