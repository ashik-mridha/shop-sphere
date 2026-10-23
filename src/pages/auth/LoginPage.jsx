import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
import { authErrorMessage, googleErrorMessage } from "../../lib/authErrors";
import { locationPath, resolveDestination } from "../../lib/authRedirect";

const schema = z.object({
    email: z.string().trim().email("Enter a valid email address"),
    password: z.string().min(1, "Enter your password"),
});

export default function LoginPage() {
    usePageMeta("Sign in", "Sign in to your ShopSphere account to track orders, save favourites and check out faster.");
    const { user, isLoggedIn, isPending } = useAuth();
    const [params] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [googleBusy, setGoogleBusy] = useState(false);
    const fromPath = locationPath(location.state?.from);
    const urlError = params.get("error") === "session" ? "We could not finish signing you in. Please try again." : googleErrorMessage(params.get("error"));
    const [error, setError] = useState(urlError || "");

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { email: "", password: "" },
    });

    if (!isPending && isLoggedIn) return <Navigate to={resolveDestination(user.role, fromPath)} replace />;

    async function onSubmit(values) {
        setError("");
        try {
            const res = await authClient.signIn.email({ email: values.email, password: values.password });
            if (res?.error) {
                setError(authErrorMessage(res.error, "We could not sign you in. Check your details and try again."));
                return;
            }
            // the role comes from the server session, not from client state
            const session = await authClient.getSession({ query: { disableCookieCache: true } });
            const role = session?.data?.user?.role || res?.data?.user?.role || "user";
            toast.success("Welcome back!");
            navigate(resolveDestination(role, fromPath), { replace: true });
        } catch (err) {
            setError(authErrorMessage(err, "We could not reach the server. Please try again."));
        }
    }

    return (
        <AuthShell
            title="Welcome back"
            subtitle="Sign in to your ShopSphere account"
            footer={<>New to ShopSphere? <Link to="/register" state={location.state} className="font-semibold text-primary hover:underline">Create an account</Link></>}
        >
            <GoogleButton from={fromPath} disabled={isSubmitting} onError={setError} onBusyChange={setGoogleBusy} />
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
                <Button type="submit" size="lg" className="w-full" loading={isSubmitting} disabled={googleBusy}>
                    {isSubmitting ? "Signing in…" : "Sign in"}
                </Button>
            </form>
        </AuthShell>
    );
}
