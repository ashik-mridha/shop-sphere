import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const SERVER_URL = import.meta.env.VITE_API_URL

export default function useTrackOrder() {
    const { id: paramId } = useParams();
    const [searchParams] = useSearchParams();
    const queryId = searchParams.get("id");

    // URL-এর ID অথবা Query Search-এর ID নেওয়া হলো
    const orderId = paramId || queryId;

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(Boolean(orderId));
    const [error, setError] = useState(orderId ? "" : "Order ID is missing.");

    useEffect(() => {
        if (!orderId) {
            setLoading(false);
            setError("Order ID is missing.");
            return;
        }

        const controller = new AbortController();

        async function fetchOrder() {
            try {
                setLoading(true);
                setError("");

                const res = await fetch(`${SERVER_URL}/api/orders/${orderId}`, {
                    signal: controller.signal,
                    credentials: "include",
                });

                if (!res.ok) {
                    throw new Error(
                        res.status === 404
                            ? "Order not found"
                            : "Failed to fetch tracking info"
                    );
                }

                const data = await res.json();
                setOrder(data.order || data);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Failed to load order tracking");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchOrder();

        return () => controller.abort();
    }, [orderId]);

    return { order, loading, error, orderId };
}