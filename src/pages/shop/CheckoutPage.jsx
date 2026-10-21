
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

const SERVER_URL = "http://localhost:5000";

export default function CheckoutPage() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();

    const quantityFromUrl = Number(searchParams.get("quantity")) || 1;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [customer, setCustomer] = useState({
        name: "",
        phone: "",
        address: "",
    });

    useEffect(() => {
        async function loadProduct() {
            try {
                const res = await fetch(`${SERVER_URL}/api/products/${id}`);
                if (!res.ok) throw new Error("Product not found");

                const data = await res.json();
                setProduct(data.product ?? data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadProduct();
    }, [id]);

    async function placeOrder(e) {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch(`${SERVER_URL}/api/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: id,
                    quantity: quantityFromUrl,
                    customer,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Could not place order");
            }

            setSuccess(
                `Order placed successfully! Order ID: ${data.orderId}`
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return <p className="p-10 text-center">Loading checkout...</p>;
    }

    if (!product) {
        return (
            <div className="p-10 text-center">
                <p>{error || "Product not found"}</p>
                <Link to="/shop" className="text-emerald-600 underline">
                    Back to shop
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-10 text-gray-900">
            <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow sm:p-8">
                <h1 className="text-2xl font-bold">Complete Your Order</h1>

                <div className="my-6 rounded-xl bg-gray-50 p-4">
                    <h2 className="font-semibold">{product.title}</h2>
                    <p className="mt-1 text-gray-600">
                        Quantity: {quantityFromUrl}
                    </p>
                    <p className="mt-2 text-xl font-bold text-emerald-700">
                        ${(Number(product.price) * quantityFromUrl).toFixed(2)}
                    </p>
                </div>

                {error && (
                    <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">
                        {error}
                    </p>
                )}

                {success ? (
                    <div className="rounded-xl bg-emerald-50 p-5 text-emerald-800">
                        <h2 className="font-bold">Thank you for your order!</h2>
                        <p className="mt-2 break-words">{success}</p>
                        <p className="mt-2 text-gray-800">Copy tha id and track your order</p>
                        <Link
                            to="/shop"
                            className="mt-5 inline-block font-semibold underline"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={placeOrder} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Full Name
                            </label>
                            <input
                                required
                                minLength={2}
                                maxLength={100}
                                value={customer.name}
                                onChange={(e) =>
                                    setCustomer({ ...customer, name: e.target.value })
                                }
                                className="w-full rounded-lg border p-3"
                                placeholder="Your full name"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Phone Number
                            </label>
                            <input
                                required
                                type="tel"
                                maxLength={20}
                                value={customer.phone}
                                onChange={(e) =>
                                    setCustomer({ ...customer, phone: e.target.value })
                                }
                                className="w-full rounded-lg border p-3"
                                placeholder="Your phone number"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Delivery Address
                            </label>
                            <textarea
                                required
                                minLength={5}
                                maxLength={500}
                                rows={3}
                                value={customer.address}
                                onChange={(e) =>
                                    setCustomer({ ...customer, address: e.target.value })
                                }
                                className="w-full rounded-lg border p-3"
                                placeholder="House, road, area, district"
                            />
                        </div>

                        <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                            Payment method: Cash on Delivery
                        </div>

                        <button
                            disabled={submitting}
                            className="w-full rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
                        >
                            {submitting ? "Placing Order..." : "Confirm Order"}
                        </button>
                    </form>
                    
                )}
            </div>
        </div>
    );
}
