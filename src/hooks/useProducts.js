import { useEffect, useState } from "react";
import { useGlobalLoading } from "../context/LoadingContext";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export default function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { startLoading, stopLoading } = useGlobalLoading();

    useEffect(() => {
        const controller = new AbortController();
        let isActive = true;

        async function fetchProducts() {
            setLoading(true);
            setError("");

            let loadingStarted = false;

            try {
                startLoading("Loading products...");
                loadingStarted = true;

                const response = await fetch(
                    `${API_URL}/api/products`,
                    {
                        method: "GET",
                        signal: controller.signal,
                        headers: {
                            Accept: "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to load products (${response.status})`
                    );
                }

                const responseData = await response.json();
                const data = Array.isArray(responseData)
                    ? responseData
                    : responseData.products || responseData.data || [];

                if (!Array.isArray(data)) {
                    throw new Error(
                        "Invalid products response: expected an array."
                    );
                }

                if (isActive) {
                    setProducts(data);
                }
            } catch (err) {
                if (err.name !== "AbortError" && isActive) {
                    console.error("Products API error:", err);
                    setError(
                        err.message ||
                        "Something went wrong while loading products."
                    );
                }
            } finally {
                if (loadingStarted) {
                    stopLoading();
                }

                if (isActive) {
                    setLoading(false);
                }
            }
        }

        fetchProducts();

        return () => {
            isActive = false;
            controller.abort();
        };
    }, [startLoading, stopLoading]);

    return {
        products,
        loading,
        error,
    };
}