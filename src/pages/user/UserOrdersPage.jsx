import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import Button, { LinkButton } from "../../components/ui/Button";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import EmptyState, { ErrorState } from "../../components/ui/EmptyState";
import { Input, Select } from "../../components/ui/Input";
import PageHeader from "../../components/ui/PageHeader";
import Pagination from "../../components/ui/Pagination";
import { TableSkeleton } from "../../components/ui/Skeleton";
import { OrderStatusBadge, PaymentStatusBadge } from "../../components/ui/StatusBadge";
import { Table, TBody, Td, Th, THead, Tr } from "../../components/ui/Table";
import useDebounce from "../../hooks/useDebounce";
import useFetch from "../../hooks/useFetch";
import usePageMeta from "../../hooks/usePageMeta";
import { api, errorMessage } from "../../lib/api";
import { formatDate, formatMoney, ORDER_STATUS, PAYMENT_STATUS } from "../../lib/format";

const canCancel = (o) => o.status === "pending_payment" && o.paymentStatus === "pending";

export default function UserOrdersPage() {
    usePageMeta("My orders", "View, track and manage your ShopSphere orders.");
    const [page, setPage] = useState(1);
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("all");
    const [paymentStatus, setPaymentStatus] = useState("all");
    const [sort, setSort] = useState("newest");
    const [target, setTarget] = useState(null);
    const [cancelling, setCancelling] = useState(false);
    const dq = useDebounce(q);

    const { data, loading, error, refetch } = useFetch("/orders", { params: { page, limit: 8, q: dq.trim(), status, paymentStatus, sort } });
    const orders = data?.data || [];

    const reset = (setter) => (e) => {
        setter(e.target.value);
        setPage(1);
    };

    async function confirmCancel() {
        setCancelling(true);
        try {
            await api.post(`/orders/${target._id}/cancel`);
            toast.success("Order cancelled");
            setTarget(null);
            refetch();
        } catch (err) {
            toast.error(errorMessage(err));
        } finally {
            setCancelling(false);
        }
    }

    const filtered = q || status !== "all" || paymentStatus !== "all";

    return (
        <div>
            <PageHeader title="My orders" description="Track deliveries and review past purchases." />

            <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Input label="Search" type="search" icon={Search} placeholder="Order number or product" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
                <Select label="Order status" value={status} onChange={reset(setStatus)}>
                    <option value="all">All statuses</option>
                    {Object.entries(ORDER_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </Select>
                <Select label="Payment" value={paymentStatus} onChange={reset(setPaymentStatus)}>
                    <option value="all">Any payment</option>
                    {Object.entries(PAYMENT_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </Select>
                <Select label="Sort by" value={sort} onChange={reset(setSort)}>
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="total-desc">Total: high to low</option>
                    <option value="total-asc">Total: low to high</option>
                </Select>
            </div>

            {error ? (
                <ErrorState message={error.message} onRetry={refetch} />
            ) : loading && !data ? (
                <TableSkeleton cols={6} />
            ) : orders.length === 0 ? (
                <EmptyState
                    icon={ShoppingBag}
                    title={filtered ? "No orders match your filters" : "You haven’t placed an order yet"}
                    description={filtered ? "Try a different search or clear the filters." : "Your orders and their tracking will appear here."}
                    action={!filtered && <LinkButton to="/shop">Browse products</LinkButton>}
                />
            ) : (
                <div className={loading ? "opacity-60 transition-opacity" : ""}>
                    <div className="hidden md:block">
                        <Table>
                            <THead>
                                <tr>
                                    <Th>Order</Th><Th>Date</Th><Th>Items</Th><Th>Total</Th><Th>Status</Th><Th className="text-right">Actions</Th>
                                </tr>
                            </THead>
                            <TBody>
                                {orders.map((o) => (
                                    <Tr key={o._id}>
                                        <Td className="font-semibold">{o.orderNumber}</Td>
                                        <Td className="whitespace-nowrap text-muted">{formatDate(o.createdAt)}</Td>
                                        <Td className="max-w-56 truncate text-muted">{o.items.map((i) => i.title).join(", ")}</Td>
                                        <Td className="font-semibold">{formatMoney(o.total)}</Td>
                                        <Td>
                                            <div className="flex flex-wrap gap-1.5"><OrderStatusBadge status={o.status} /><PaymentStatusBadge status={o.paymentStatus} /></div>
                                        </Td>
                                        <Td className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link to={`/user/orders/${o._id}`} className="inline-flex h-9 items-center rounded-lg border border-line px-3 text-sm font-semibold hover:bg-surface-2">Details</Link>
                                                {canCancel(o) && <Button size="sm" variant="danger-soft" onClick={() => setTarget(o)}>Cancel</Button>}
                                            </div>
                                        </Td>
                                    </Tr>
                                ))}
                            </TBody>
                        </Table>
                    </div>

                    <ul className="space-y-3 md:hidden">
                        {orders.map((o) => (
                            <li key={o._id} className="rounded-xl border border-line bg-surface p-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="font-semibold">{o.orderNumber}</p>
                                        <p className="text-xs text-muted">{formatDate(o.createdAt)}</p>
                                    </div>
                                    <p className="font-bold">{formatMoney(o.total)}</p>
                                </div>
                                <p className="mt-2 line-clamp-2 text-sm text-muted">{o.items.map((i) => `${i.title} × ${i.quantity}`).join(", ")}</p>
                                <div className="mt-3 flex flex-wrap gap-1.5"><OrderStatusBadge status={o.status} /><PaymentStatusBadge status={o.paymentStatus} /></div>
                                <div className="mt-3 flex gap-2">
                                    <LinkButton to={`/user/orders/${o._id}`} variant="outline" size="sm" className="flex-1">Details</LinkButton>
                                    {canCancel(o) && <Button size="sm" variant="danger-soft" onClick={() => setTarget(o)}>Cancel</Button>}
                                </div>
                            </li>
                        ))}
                    </ul>

                    <Pagination className="mt-6" page={data.pagination.page} pages={data.pagination.pages} onChange={setPage} />
                </div>
            )}

            <ConfirmDialog
                open={Boolean(target)}
                title="Cancel this order?"
                message={`Order ${target?.orderNumber || ""} hasn’t been paid yet. Cancelling it will close the checkout session.`}
                confirmLabel="Cancel order"
                danger
                loading={cancelling}
                onConfirm={confirmCancel}
                onCancel={() => setTarget(null)}
            />
        </div>
    );
}
