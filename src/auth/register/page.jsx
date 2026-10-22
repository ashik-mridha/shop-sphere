import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "../../lib/auth-client";
import { useGlobalLoading } from "../../context/LoadingContext";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");

    const { startLoading, stopLoading } = useGlobalLoading();

    // Role অনুযায়ী হার্ড রিডাইরেক্ট (Window Location)
    const redirectByRole = (user) => {
        const userRole = String(user?.role || "").toLowerCase();

        if (userRole === "admin") {
            window.location.href = "/admin/dashboard";
        } else {
            window.location.href = "/user/dashboard";
        }
    };

    // Email/Password Registration Handler
    const handleRegister = async (e) => {
        e.preventDefault();

        if (loading || googleLoading) return;

        setLoading(true);
        setError("");

        const taskId = startLoading("Creating your account...");

        try {
            const response = await authClient.signUp.email({
                name: name.trim(),
                email: email.trim(),
                password,
            });

            if (response?.error) {
                const message =
                    response.error.message ||
                    "Registration failed. Please try again.";

                setError(message);
                toast.error(message);
                return;
            }

            toast.success("Account created successfully!");

            // সেশন ডাটা সাথে সাথে ফেচ করা
            const sessionResult = await authClient.getSession();
            const user = sessionResult?.data?.user || response?.data?.user;

            if (user) {
                // সেশন ও রোল পাওয়া গেলে ড্যাশবোর্ডে রিডাইরেক্ট
                redirectByRole(user);
            } else {
                // সেশন তৈরি না হয়ে থাকলে সরাসরি লগইন পেজে পাঠাবে
                window.location.href = "/login";
            }
        } catch (err) {
            console.error("Registration failed:", err);

            const message =
                err?.message ||
                "Something went wrong. Please try again.";

            setError(message);
            toast.error(message);
        } finally {
            stopLoading(taskId);
            setLoading(false);
        }
    };

    // Google OAuth Register Handler
    const handleGoogleRegister = async () => {
        // আপনার স্টেট নামের সাথে মিলিয়ে এখানে googleLoading ব্যবহার করা হয়েছে
        if (loading || googleLoading) return;

        setGoogleLoading(true);
        setError("");

        const taskId = startLoading("Connecting to Google...");

        try {
            await authClient.signIn.social({
                provider: "google",
                // সরাসরি ফ্রন্টএন্ডের ড্যাশবোর্ড বা আপনার পছন্দমতো রিডাইরেক্ট পাথ
                callbackURL: "/user/dashboard",
                errorCallbackURL: "/login",
            });
        } catch (err) {
            console.error("Google login failed:", err);
            const message = err?.message || "Google login failed. Please try again.";
            setError(message);
            toast.error(message);
            stopLoading(taskId);
            setGoogleLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#0a0f0d] px-4 py-10">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white">
                        Create Account
                    </h1>
                    <p className="mt-2 text-gray-400">
                        Join ShopSphere today
                    </p>
                </div>

                <div className="rounded-2xl border border-[#22332a] bg-[#121816] p-8 shadow-xl">
                    {/* Google Register Button */}
                    <button
                        onClick={handleGoogleRegister}
                        type="button"
                        disabled={loading || googleLoading}
                        className="mb-6 flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-white py-3 font-medium text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {googleLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <GoogleIcon />
                        )}

                        {googleLoading
                            ? "Connecting..."
                            : "Continue with Google"}
                    </button>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#22332a]" />
                        </div>

                        <div className="relative flex justify-center text-sm">
                            <span className="bg-[#121816] px-3 text-gray-500">
                                or register with email
                            </span>
                        </div>
                    </div>

                    {/* Email/Password Register Form */}
                    <form onSubmit={handleRegister} className="space-y-5">
                        {error && (
                            <div
                                role="alert"
                                className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                            >
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="mb-1.5 block text-sm text-gray-400">
                                Full Name
                            </label>
                            <div className="relative">
                                <User
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoComplete="name"
                                    required
                                    disabled={loading || googleLoading}
                                    className="w-full rounded-xl border border-[#22332a] bg-[#0d1411] py-3 pl-10 pr-4 text-white placeholder-gray-500 transition focus:border-[#10B981] focus:outline-none disabled:opacity-60"
                                    placeholder="Your name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm text-gray-400">
                                Email
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    size={18}
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                    disabled={loading || googleLoading}
                                    className="w-full rounded-xl border border-[#22332a] bg-[#0d1411] py-3 pl-10 pr-4 text-white placeholder-gray-500 transition focus:border-[#10B981] focus:outline-none disabled:opacity-60"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm text-gray-400">
                                Password
                            </label>
                            <div className="relative">
                                <Lock
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    size={18}
                                />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    minLength={8}
                                    required
                                    disabled={loading || googleLoading}
                                    className="w-full rounded-xl border border-[#22332a] bg-[#0d1411] py-3 pl-10 pr-4 text-white placeholder-gray-500 transition focus:border-[#10B981] focus:outline-none disabled:opacity-60"
                                    placeholder="Minimum 8 characters"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Password must be at least 8 characters.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || googleLoading}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#10B981] py-3 font-semibold text-white transition hover:bg-[#0d9668] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading && (
                                <Loader2 className="animate-spin" size={20} />
                            )}
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-400">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-[#10B981] hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}

function GoogleIcon() {
    return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
        </svg>
    );
}