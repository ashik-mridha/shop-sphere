import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { API_URL } from "./config";

export const authClient = createAuthClient({
    // empty baseURL = same origin (dev proxy); otherwise the API origin from VITE_API_URL
    ...(API_URL && { baseURL: API_URL }),
    plugins: [adminClient()],
    fetchOptions: { credentials: "include" },
});

export const { signIn, signUp, signOut, useSession } = authClient;
export default authClient;
