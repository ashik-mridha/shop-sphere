import { Navigate } from "react-router-dom";
import Spinner from "../../components/ui/Spinner";
import useAuth from "../../hooks/useAuth";
import usePageMeta from "../../hooks/usePageMeta";
import { recallDestination, resolveDestination } from "../../lib/authRedirect";

/** Neutral landing route after Google: waits for the session, then sends the user where their role belongs. */
export default function AuthRedirectPage() {
    usePageMeta("Signing you in");
    const { user, isPending } = useAuth();

    if (isPending) return <div className="flex min-h-screen items-center justify-center"><Spinner label="Signing you in" /></div>;
    if (!user) return <Navigate to="/login?error=session" replace />;
    return <Navigate to={resolveDestination(user.role, recallDestination())} replace />;
}
