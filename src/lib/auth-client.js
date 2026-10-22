
import { createAuthClient } from "better-auth/react";

const baseURL = (
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000"
).replace(/\/+$/, "");

export const authClient = createAuthClient({
    baseURL,

    fetchOptions: {
        credentials: "include",
    },
});

// Authentication methods
export const {
    signIn,
    signUp,
    signOut,
    useSession,
} = authClient;

// Optional: access the complete auth client
export default authClient;
