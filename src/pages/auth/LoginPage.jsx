import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";
import AuthShell from "../../components/auth/AuthShell";
import GoogleButton from "../../components/auth/GoogleButton";
import PasswordInput from "../../components/auth/PasswordInput";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import useAuth from "../../hooks/useAuth";
import usePageMeta from "../../hooks/usePageMeta";
import { authClient } from "../../lib/auth-client";

const schema = z.object({
    email: z.string().trim().email("Enter a valid email address"),
    password: z.string().min(1, "Enter your password"),
});

export default function LoginPage() {
    usePageMeta("Sign in", "Sign in to your ShopSphere account to track orders, save favourites and check out faster.");
    const { isLoggedIn, isPending, dashboardPath } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const from = location.state?.from;
    const fromPath = from?.pathname ? `${from.pathname}${from.search || ""}` : null;

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { email: "", password: "" },
    });

    if (!isPending && isLoggedIn) return <Navigate to={fromPath || dashboardPath} replace />;

    async function onSubmit(values) {
        setError("");
        try {
            const res = await authClient.signIn.email({ email: values.email, password: values.password });
            if (res?.error) {
                setError(res.error.message || "We couldn’t sign you in. Check your details and try again.");
                return;
            }
            const session = await authClient.getSession();
            const isAdmin = String(session?.data?.user?.role || "").toLowerCase() === "admin";
            toast.success("Welcome back!");
            navigate(fromPath || (isAdmin ? "/admin/dashboard" : "/user/dashboard"), { replace: true });
        } catch (err) {
            setError(err?.message || "We couldn’t reach the server. Please try again.");
        }
    }

    return (
        <AuthShell
            title="Welcome back"
            subtitle="Sign in to your ShopSphere account"
            footer={<>New to ShopSphere? <Link to="/register" state={location.state} className="font-semibold text-primary hover:underline">Create an account</Link></>}
        >
            <GoogleButton target={fromPath || dashboardPath} disabled={isSubmitting} onError={setError} />
            <div className="my-5 flex items-center gap-3 text-xs text-muted" aria-hidden="true">
                <span className="h-px flex-1 bg-line" /> or sign in with email <span className="h-px flex-1 bg-line" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                {error && (
                    <div role="alert" className="rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
                        {error}
                    </div>
                )}
                <Input label="Email" type="email" icon={Mail} autoComplete="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
                <PasswordInput label="Password" autoComplete="current-password" placeholder="Your password" error={errors.password?.message} {...register("password")} />
                <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
                    {isSubmitting ? "Signing in…" : "Sign in"}
                </Button>
            </form>
        </AuthShell>
    );
}
