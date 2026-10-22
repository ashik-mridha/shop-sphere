import { createAuthClient } from "better-auth/react";

// Production এবং Localhost ডাইনামিক বেস ইউআরএল ফিক্স
const getBaseURL = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // Vercel Production Environment Check
    if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
        return "https://shop-sphere-server.vercel.app"; // আপনার ব্যাকএন্ডের সঠিক লাইভ URL দিন
    }

    return "http://localhost:5000";
};

const baseURL = getBaseURL().replace(/\/+$/, "");

export const authClient = createAuthClient({
    baseURL,
    fetchOptions: {
        credentials: "include",
    },
});

export const {
    signIn,
    signUp,
    signOut,
    useSession,
} = authClient;

export default authClient;