import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import AuthShell from "../../components/auth/AuthShell";
import GoogleButton from "../../components/auth/GoogleButton";
import PasswordInput from "../../components/auth/PasswordInput";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import useAuth from "../../hooks/useAuth";
import usePageMeta from "../../hooks/usePageMeta";
import { authClient } from "../../lib/auth-client";
import { authErrorMessage } from "../../lib/authErrors";
import { locationPath, resolveDestination } from "../../lib/authRedirect";

const schema = z
    .object({
        name: z.string().trim().min(2, "Enter your full name").max(80),
        email: z.string().trim().email("Enter a valid email address"),
        password: z.string().min(8, "Use at least 8 characters").max(128),
        confirm: z.string(),
    })
    .refine((v) => v.password === v.confirm, { message: "Passwords do not match", path: ["confirm"] });

export default function RegisterPage() {
    usePageMeta("Create account", "Create a free ShopSphere account to order securely, track deliveries and review products you buy.");
    const { user, isLoggedIn, isPending } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [googleBusy, setGoogleBusy] = useState(false);
    const fromPath = locationPath(location.state?.from);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { name: "", email: "", password: "", confirm: "" },
    });

    if (!isPending && isLoggedIn) return <Navigate to={resolveDestination(user.role, fromPath)} replace />;

    async function onSubmit(values) {
        setError("");
        try {
            const res = await authClient.signUp.email({ name: values.name, email: values.email, password: values.password });
            if (res?.error) {
                setError(authErrorMessage(res.error, "We could not create your account. Please try again."));
                return;
            }
            // sign-up signs the user in; the real role comes from the session (new accounts are always "user")
            const session = await authClient.getSession({ query: { disableCookieCache: true } });
            if (!session?.data?.user) {
                toast("Account created. Please sign in.");
                navigate("/login", { replace: true, state: location.state });
                return;
            }
            toast.success("Account created. Welcome to ShopSphere!");
            navigate(resolveDestination(session.data.user.role, fromPath), { replace: true });
        } catch (err) {
            setError(authErrorMessage(err, "We could not reach the server. Please try again."));
        }
    }

    return (
        <AuthShell
            title="Create your account"
            subtitle="Order securely, track deliveries and save your favourites"
            footer={<>Already have an account? <Link to="/login" state={location.state} className="font-semibold text-primary hover:underline">Sign in</Link></>}
        >
            <GoogleButton from={fromPath} disabled={isSubmitting} onError={setError} onBusyChange={setGoogleBusy} />
            <div className="my-5 flex items-center gap-3 text-xs text-muted" aria-hidden="true">
                <span className="h-px flex-1 bg-line" /> or register with email <span className="h-px flex-1 bg-line" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                {error && (
                    <div role="alert" className="rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
                        {error}
                    </div>
                )}
                <Input label="Full name" icon={UserRound} autoComplete="name" placeholder="Your full name" error={errors.name?.message} {...register("name")} />
                <Input label="Email" type="email" icon={Mail} autoComplete="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
                <PasswordInput label="Password" autoComplete="new-password" hint="At least 8 characters" error={errors.password?.message} {...register("password")} />
                <PasswordInput label="Confirm password" autoComplete="new-password" error={errors.confirm?.message} {...register("confirm")} />
                <Button type="submit" size="lg" className="w-full" loading={isSubmitting} disabled={googleBusy}>
                    {isSubmitting ? "Creating account…" : "Create account"}
                </Button>
                <p className="text-center text-xs text-muted">
                    By creating an account you agree to our <Link to="/terms" className="font-semibold text-primary hover:underline">Terms</Link> and{" "}
                    <Link to="/privacy" className="font-semibold text-primary hover:underline">Privacy Policy</Link>.
                </p>
            </form>
        </AuthShell>
    );
}
