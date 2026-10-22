
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signIn } from "../../lib/auth-client";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectTo =
    location.state?.from?.pathname || "/user/dashboard";

  async function handleEmailLogin(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email এবং password লিখুন।");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn.email({
        email: email.trim(),
        password,
      });

      if (result?.error) {
        setError(
          result.error.message || "Login ব্যর্থ হয়েছে। তথ্য যাচাই করুন।"
        );
        return;
      }

      // Give the browser a moment to store the session cookie.
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err?.message || "Login করা যায়নি। আবার চেষ্টা করুন।"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setLoading(true);

    try {
      const result = await signIn.social({
        provider: "google",
        callbackURL: `${ window.location.origin } /user/dashboard`,
      });

      if (result?.error) {
        setError(
          result.error.message || "Google login শুরু করা যায়নি।"
        );
        setLoading(false);
      }
      // Successful social sign-in normally redirects the browser.
    } catch (err) {
      setError(err?.message || "Google login ব্যর্থ হয়েছে।");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          Welcome Back
        </h1>

        <p className="mb-6 text-center text-gray-500">
          আপনার ShopSphere account-এ login করুন।
        </p>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="আপনার password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-500">অথবা</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-60"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Account নেই?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:underline"
          >
            Register করুন
          </Link>
        </p>
      </section>
    </main>
  );
}
