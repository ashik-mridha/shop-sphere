import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ allowedRole }) {
    const { data: session, isPending } = authClient.useSession();
    const location = useLocation();

    // ১. সেশন লোড হওয়া পর্যন্ত ওয়েট করা
    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0a0f0d]">
                <Loader2 className="animate-spin text-[#10B981]" size={40} />
            </div>
        );
    }

    // ২. সেশন না থাকলে সরাসরি লগইন পেজে রিডাইরেক্ট
    if (!session || !session.user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // ৩. ইউজারের রোল ফরম্যাট সেফ করা (Case-insensitive conversion)
    const userRole = String(session.user.role || "user").toLowerCase();
    const requiredRole = allowedRole ? String(allowedRole).toLowerCase() : null;

    // ৪. রোল অমিল হলে সঠিক ড্যাশবোর্ডে রিডাইরেক্ট
    if (requiredRole && userRole !== requiredRole) {
        // যদি সে Admin হয় কিন্তু User পেজে ঢুকতে চায় -> Admin Dashboard-এ যাবে
        if (userRole === "admin") {
            return <Navigate to="/admin/dashboard" replace />;
        }
        // যদি সে সাধারণ User হয় কিন্তু Admin পেজে ঢুকতে চায় -> User Dashboard-এ যাবে
        return <Navigate to="/user/dashboard" replace />;
    }

    return <Outlet />;
}