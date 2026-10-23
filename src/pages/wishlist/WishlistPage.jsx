import { Heart, LogIn } from "lucide-react";
import { useLocation } from "react-router-dom";
import usePageMeta from "../../hooks/usePageMeta";
import useFetch from "../../hooks/useFetch";
import useAuth from "../../hooks/useAuth";
import { useWishlist } from "../../context/WishlistContext";
import ProductGrid from "../../components/shop/ProductGrid";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState, { ErrorState } from "../../components/ui/EmptyState";
import { ProductGridSkeleton } from "../../components/ui/Skeleton";
import { LinkButton } from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

export default function WishlistPage({ embedded = false }) {
    usePageMeta("My wishlist", "Products you have saved on ShopSphere.");
    const { isLoggedIn, isPending } = useAuth();
    const location = useLocation();
    const wishlist = useWishlist();
    const { data, loading, error, refetch } = useFetch("/wishlist", { enabled: isLoggedIn });

    if (isPending) return <Spinner label="Loading your wishlist" />;

    if (!isLoggedIn) {
        return (
            <>
                <PageHeader title="Wishlist" />
                <EmptyState
                    icon={LogIn}
                    title="Sign in to see your wishlist"
                    description="Save products with the heart icon and they will be waiting for you on any device."
                    action={<LinkButton to="/login" state={{ from: location }}>Sign in</LinkButton>}
                />
            </>
        );
    }

    // Items removed in this session disappear immediately via the shared wishlist ids.
    const products = (data?.data || []).filter((p) => wishlist.has(String(p._id)));

    return (
        <>
            <PageHeader
                title="My wishlist"
                description={products.length ? `${products.length} saved ${products.length === 1 ? "item" : "items"}` : undefined}
            />
            {error ? (
                <ErrorState message={error.message} onRetry={refetch} />
            ) : loading && !data ? (
                <ProductGridSkeleton count={4} />
            ) : products.length === 0 ? (
                <EmptyState
                    icon={Heart}
                    title="Your wishlist is empty"
                    description={embedded ? "Tap the heart on any product to save it here." : "Tap the heart on any product to save it for later."}
                    action={<LinkButton to="/shop">Browse products</LinkButton>}
                />
            ) : (
                <ProductGrid products={products} />
            )}
        </>
    );
}
