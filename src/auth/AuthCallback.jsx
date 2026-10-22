import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "../lib/auth-client";

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAndRedirect = async () => {
            try {
                // সেশন থেকে ইউজার এবং রোল ডাটা চেক করা
                const sessionResult = await authClient.getSession();
                const user = sessionResult?.data?.user;

                if (user) {
                    const role = String(user.role || "").toLowerCase();
                    toast.success("Welcome back!");

                    if (role === "admin") {
                        navigate("/admin/dashboard", { replace: true });
                    } else {
                        navigate("/user/dashboard", { replace: true });
                    }
                } else {
                    toast.error("Session verification failed. Please login.");
                    navigate("/login", { replace: true });
                }
            } catch (err) {
                console.error("Auth callback verification failed:", err);
                toast.error("Something went wrong. Please sign in again.");
                navigate("/login", { replace: true });
            }
        };

        verifyAndRedirect();
    }, [navigate]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f0d] text-white">
            <Loader2 className="h-10 w-10 animate-spin text-[#10B981]" />
            <p className="mt-4 text-gray-400">Verifying role & redirecting to dashboard...</p>
        </div>
    );
}