import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import usePageMeta from "../hooks/usePageMeta";
import { LinkButton } from "../components/ui/Button";

export default function NotFoundPage() {
    usePageMeta("Page not found", "The page you are looking for does not exist.");
    return (
        <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center text-center">
            <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Compass size={30} aria-hidden="true" />
            </span>
            <p className="text-sm font-bold uppercase tracking-widest text-primary">Error 404</p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">We couldn’t find that page</h1>
            <p className="mt-3 text-muted">The link may be broken or the page may have moved. Try one of these instead.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
                <LinkButton to="/">Back to home</LinkButton>
                <LinkButton to="/shop" variant="outline">Browse the shop</LinkButton>
            </div>
            <p className="mt-6 text-sm text-muted">
                Need help? <Link to="/contact" className="font-semibold text-primary hover:underline">Contact support</Link>
            </p>
        </div>
    );
}
