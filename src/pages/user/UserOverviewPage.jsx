import { Link } from "react-router-dom";
import { Heart, MapPin, PackageSearch, ShoppingBag, UserRound, Wallet } from "lucide-react";
import Card from "../../components/ui/Card";
import EmptyState, { ErrorState } from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import { LinkButton } from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { OrderStatusBadge, PaymentStatusBadge } from "../../components/ui/StatusBadge";
import useAuth from "../../hooks/useAuth";
import useFetch from "../../hooks/useFetch";
import usePageMeta from "../../hooks/usePageMeta";
import { useWishlist } from "../../context/WishlistContext";
import { formatDate, formatMoney } from "../../lib/format";

function Stat({ icon: Icon, label, value, to, loading }) {
    return (
        <Link to={to} className="rounded-xl border border-line bg-surface p-5 transition-shadow hover:shadow-md">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Icon size={20} aria-hidden="true" />
            </span>
            <p className="mt-4 text-sm text-muted">{label}</p>
            {loading ? <Skeleton className="mt-1 h-8 w-20" /> : <p className="mt-0.5 text-2xl font-bold">{value}</p>}
        </Link>
    );
}

export default function UserOverviewPage() {
    usePageMeta("My account", "Your ShopSphere account overview: recent orders, saved items and addresses.");
    const { user } = useAuth();
    const wishlist = useWishlist();
    const orders = useFetch("/orders", { params: { limit: 50 } });
    const addresses = useFetch("/addresses");

    const list = orders.data?.data || [];
    const totalOrders = orders.data?.pagination?.total ?? 0;
    const spent = list.filter((o) => o.paymentStatus === "paid").reduce((sum, o) => sum + o.total, 0);
    const recent = list.slice(0, 4);

    return (
        <div>
            <PageHeader
                title={`Hello, ${user?.name?.split(" ")[0] || "there"}`}
                description="Here’s what’s happening with your account."
                actions={<LinkButton to="/shop" variant="outline" size="sm">Continue shopping</LinkButton>}
            />

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                <Stat icon={ShoppingBag} label="Orders" value={totalOrders} to="/user/orders" loading={orders.loading} />
                <Stat icon={Wallet} label="Total spent" value={formatMoney(spent)} to="/user/orders" loading={orders.loading} />
                <Stat icon={Heart} label="Wishlist items" value={wishlist.count} to="/user/wishlist" />
                <Stat icon={MapPin} label="Saved addresses" value={addresses.data?.data?.length ?? 0} to="/user/addresses" loading={addresses.loading} />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
                <section aria-labelledby="recent-orders">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 id="recent-orders" className="text-lg font-bold">Recent orders</h2>
                        {totalOrders > 0 && <Link to="/user/orders" className="text-sm font-semibold text-primary hover:underline">View all</Link>}
                    </div>

                    {orders.error ? (
                        <ErrorState message={orders.error.message} onRetry={orders.refetch} />
                    ) : orders.loading && !orders.data ? (
                        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-24" />)}</div>
                    ) : recent.length === 0 ? (
                        <EmptyState
                            icon={ShoppingBag}
                            title="No orders yet"
                            description="When you place an order it will show up here with live tracking."
                            action={<LinkButton to="/shop">Start shopping</LinkButton>}
                        />
                    ) : (
                        <ul className="space-y-3">
                            {recent.map((o) => (
                                <li key={o._id}>
                                    <Link to={`/user/orders/${o._id}`} className="block rounded-xl border border-line bg-surface p-4 transition-shadow hover:shadow-md">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <p className="font-semibold">{o.orderNumber}</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                <OrderStatusBadge status={o.status} />
                                                <PaymentStatusBadge status={o.paymentStatus} />
                                            </div>
                                        </div>
                                        <p className="mt-1 truncate text-sm text-muted">
                                            {o.items.map((i) => `${i.title} × ${i.quantity}`).join(", ")}
                                        </p>
                                        <p className="mt-2 text-sm text-muted">
                                            {formatDate(o.createdAt)} · <span className="font-semibold text-fg">{formatMoney(o.total)}</span>
                                        </p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <aside aria-label="Quick links">
                    <h2 className="mb-3 text-lg font-bold">Quick links</h2>
                    <Card padded={false} className="divide-y divide-line">
                        {[
                            [ShoppingBag, "Continue shopping", "/shop"],
                            [PackageSearch, "Track an order", "/track-order"],
                            [UserRound, "Edit profile", "/user/profile"],
                            [MapPin, "Manage addresses", "/user/addresses"],
                        ].map(([Icon, label, to]) => (
                            <Link key={to} to={to} className="flex items-center gap-3 px-4 py-3.5 text-sm font-semibold hover:bg-surface-2">
                                <Icon size={18} className="text-primary" aria-hidden="true" /> {label}
                            </Link>
                        ))}
                    </Card>
                </aside>
            </div>
        </div>
    );
}
