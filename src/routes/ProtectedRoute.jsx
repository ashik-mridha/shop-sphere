import { Navigate, Outlet, useLocation } from "react-router-dom";
import Spinner from "../components/ui/Spinner";
import useAuth from "../hooks/useAuth";

/** allowedRole: "user" | "admin" (omit = any signed-in user). A wrong role is sent to its own dashboard. */
export default function ProtectedRoute({ allowedRole }) {
    const { user, isPending, isLoggedIn, isAdmin } = useAuth();
    const location = useLocation();

    if (isPending) return <div className="flex min-h-screen items-center justify-center"><Spinner label="Checking your session" /></div>;
    if (!isLoggedIn) return <Navigate to="/login" state={{ from: location }} replace />;
    if (user.banned) return <Navigate to="/login" replace />;

    if (allowedRole) {
        const role = isAdmin ? "admin" : "user";
        if (role !== allowedRole) return <Navigate to={isAdmin ? "/admin/dashboard" : "/user/dashboard"} replace />;
    }
    return <Outlet />;
}
