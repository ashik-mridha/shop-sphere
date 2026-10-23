import { useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";

/** Thin wrapper over Better Auth's session hook. */
export default function useAuth() {
    const { data: session, isPending, refetch } = authClient.useSession();
    const navigate = useNavigate();
    const user = session?.user ?? null;
    const role = String(user?.role || "user").toLowerCase();

    async function logout() {
        await authClient.signOut();
        navigate("/", { replace: true });
    }

    return {
        user,
        isPending,
        isLoggedIn: Boolean(user),
        isAdmin: role === "admin",
        dashboardPath: role === "admin" ? "/admin/dashboard" : "/user/dashboard",
        refreshSession: refetch,
        logout,
    };
}
