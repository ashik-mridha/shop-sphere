import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ allowedRole }) {
    const { data: session, isPending } = authClient.useSession();
    const location = useLocation();

    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0a0f0d]">
                {/* routs protect */}
                <Loader2 className="animate-spin text-[#10B981]" size={40} />
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRole && session.user?.role !== allowedRole) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}