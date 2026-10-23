import { Link } from "react-router-dom";
import { AlertTriangle, DollarSign, MessageSquareText, Package, ShoppingBag, Truck, Users } from "lucide-react";
import usePageMeta from "../../hooks/usePageMeta";
import useFetch from "../../hooks/useFetch";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Skeleton from "../../components/ui/Skeleton";
import { ErrorState } from "../../components/ui/EmptyState";
import { Table, THead, TBody, Tr, Th, Td } from "../../components/ui/Table";
import { OrderStatusBadge, PaymentStatusBadge } from "../../components/ui/StatusBadge";
import LazyImage from "../../components/ui/LazyImage";
import LineChart from "../../components/charts/LineChart";
import BarChart from "../../components/charts/BarChart";
import DonutChart from "../../components/charts/DonutChart";
import { formatDate, formatMoney, formatNumber, ORDER_STATUS, titleCase } from "../../lib/format";

const STATUS_COLORS = {
    pending_payment: "var(--accent)",
    processing: "var(--muted)",
    shipped: "var(--primary)",
    delivered: "var(--fg)",
    cancelled: "var(--danger)",
};

const compactMoney = (n) => (n >= 1000 ? `$${Math.round(n / 100) / 10}k` : `$${Math.round(n)}`);

function StatCard({ icon: Icon, label, value }) {
    return (
        <Card className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon size={22} aria-hidden="true" />
            </span>
            <div className="min-w-0">
                <p className="text-sm text-muted">{label}</p>
                <p className="truncate text-2xl font-bold">{value}</p>
            </div>
        </Card>
    );
}

function Attention({ to, icon: Icon, count, label }) {
    const hot = count > 0;
    return (
        <Link
            to={to}
            className={`flex items-center gap-3 rounded-xl border p-4 transition-colors hover:bg-surface-2 ${hot ? "border-accent/40 bg-accent-soft" : "border-line bg-surface"}`}
        >
            <Icon size={20} aria-hidden="true" className={hot ? "text-accent" : "text-muted"} />
            <span className="text-sm">
                <strong className="mr-1 text-lg">{formatNumber(count)}</strong>
                {label}
            </span>
        </Link>
    );
}

function Loading() {
    return (
        <div className="space-y-6" role="status" aria-label="Loading dashboard">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}
            </div>
            <Skeleton className="h-72" />
            <div className="grid gap-6 lg:grid-cols-2"><Skeleton className="h-64" /><Skeleton className="h-64" /></div>
        </div>
    );
}

export default function AdminOverviewPage() {
    usePageMeta("Admin overview", "Revenue, orders and store activity at a glance.");
    const { data, loading, error, refetch } = useFetch("/admin/stats");

    if (loading && !data) return <><PageHeader title="Overview" /><Loading /></>;
    if (error && !data) return <><PageHeader title="Overview" /><ErrorState message={error.message} onRetry={refetch} /></>;

    const s = data.data;
    const c = s.cards;
    const revenueSeries = s.revenueByDay.map((d) => ({
        label: d.date.slice(5).replace("-", "/"),
        fullLabel: formatDate(d.date),
        value: d.revenue,
    }));
    const hasRevenue = revenueSeries.some((d) => d.value > 0);
    const categorySeries = s.salesByCategory.map((x) => ({ label: titleCase(x.category), value: x.revenue }));
    const statusSeries = s.ordersByStatus.map((x) => ({
        label: ORDER_STATUS[x.status]?.label || x.status,
        value: x.count,
        color: STATUS_COLORS[x.status] || "var(--muted)",
    }));

    return (
        <>
            <PageHeader title="Overview" description="How the store is performing right now." />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard icon={DollarSign} label="Revenue (paid orders)" value={formatMoney(c.revenue)} />
                <StatCard icon={ShoppingBag} label="Paid orders" value={formatNumber(c.paidOrders)} />
                <StatCard icon={Users} label="Registered users" value={formatNumber(c.users)} />
                <StatCard icon={Package} label="Products" value={formatNumber(c.products)} />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Attention to="/admin/orders?status=processing" icon={Truck} count={c.toFulfil} label="orders to fulfil" />
                <Attention to="/admin/products" icon={AlertTriangle} count={c.lowStock} label="low-stock products" />
                <Attention to="/admin/messages" icon={MessageSquareText} count={c.newMessages} label="new messages" />
            </div>

            <Card className="mt-6">
                <h2 className="mb-4 text-lg font-bold">Revenue, last 30 days</h2>
                {hasRevenue ? (
                    <LineChart data={revenueSeries} ariaLabel="Daily revenue for the last 30 days" formatValue={formatMoney} formatTick={compactMoney} />
                ) : (
                    <p className="py-10 text-center text-sm text-muted">No paid orders in the last 30 days.</p>
                )}
            </Card>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                    <h2 className="mb-4 text-lg font-bold">Sales by category</h2>
                    {categorySeries.length ? (
                        <BarChart data={categorySeries} ariaLabel="Revenue by product category" formatValue={formatMoney} formatTick={compactMoney} />
                    ) : (
                        <p className="py-10 text-center text-sm text-muted">No sales yet.</p>
                    )}
                </Card>
                <Card>
                    <h2 className="mb-4 text-lg font-bold">Orders by status</h2>
                    {statusSeries.length ? (
                        <DonutChart data={statusSeries} ariaLabel="Number of orders per status" centerLabel="orders" />
                    ) : (
                        <p className="py-10 text-center text-sm text-muted">No orders yet.</p>
                    )}
                </Card>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                <Card>
                    <h2 className="mb-4 text-lg font-bold">Top products</h2>
                    {s.topProducts.length ? (
                        <ol className="space-y-3">
                            {s.topProducts.map((p, i) => (
                                <li key={p._id} className="flex items-center gap-3">
                                    <span className="w-4 text-sm font-bold text-muted">{i + 1}</span>
                                    <LazyImage src={p.image} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold">{p.title}</p>
                                        <p className="text-xs text-muted">{formatNumber(p.units)} sold</p>
                                    </div>
                                    <span className="text-sm font-bold">{formatMoney(p.revenue)}</span>
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <p className="py-6 text-center text-sm text-muted">No sales yet.</p>
                    )}
                </Card>

                <div>
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-lg font-bold">Recent orders</h2>
                        <Link to="/admin/orders" className="text-sm font-semibold text-primary hover:underline">View all</Link>
                    </div>
                    <Table>
                        <THead>
                            <Tr><Th>Order</Th><Th>Customer</Th><Th>Total</Th><Th>Payment</Th><Th>Status</Th><Th>Date</Th></Tr>
                        </THead>
                        <TBody>
                            {s.recentOrders.map((o) => (
                                <Tr key={o._id}>
                                    <Td className="font-semibold">{o.orderNumber}</Td>
                                    <Td>{o.customer?.name}</Td>
                                    <Td>{formatMoney(o.total)}</Td>
                                    <Td><PaymentStatusBadge status={o.paymentStatus} /></Td>
                                    <Td><OrderStatusBadge status={o.status} /></Td>
                                    <Td className="whitespace-nowrap text-muted">{formatDate(o.createdAt)}</Td>
                                </Tr>
                            ))}
                        </TBody>
                    </Table>
                </div>
            </div>
        </>
    );
}
