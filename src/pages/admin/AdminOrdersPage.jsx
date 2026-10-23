import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Eye, Search, ShoppingBag } from "lucide-react";
import usePageMeta from "../../hooks/usePageMeta";
import useFetch from "../../hooks/useFetch";
import useDebounce from "../../hooks/useDebounce";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { Input, Select } from "../../components/ui/Input";
import { Table, THead, TBody, Tr, Th, Td, SortTh } from "../../components/ui/Table";
import Pagination from "../../components/ui/Pagination";
import { TableSkeleton } from "../../components/ui/Skeleton";
import EmptyState, { ErrorState } from "../../components/ui/EmptyState";
import { OrderStatusBadge, PaymentStatusBadge } from "../../components/ui/StatusBadge";
import OrderDetailModal from "../../components/admin/OrderDetailModal";
import { formatDate, formatMoney, ORDER_STATUS, PAYMENT_STATUS } from "../../lib/format";

export default function AdminOrdersPage() {
    usePageMeta("Manage orders", "Review, fulfil and refund customer orders.");
    const [params] = useSearchParams();
    const initial = params.get("status");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState(ORDER_STATUS[initial] ? initial : "all");
    const [paymentStatus, setPaymentStatus] = useState("all");
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(null);
    const q = useDebounce(search.trim());

    const { data, loading, error, refetch } = useFetch("/admin/orders", { params: { q, status, paymentStatus, sort, page, limit: 10 } });
    const orders = data?.data || [];
    const pagination = data?.pagination;

    const reset = (setter) => (value) => { setter(value); setPage(1); };

    const sortState = {
        newest: { field: "date", dir: "desc" },
        oldest: { field: "date", dir: "asc" },
        "total-asc": { field: "total", dir: "asc" },
        "total-desc": { field: "total", dir: "desc" },
    }[sort];

    function onSort(field) {
        const next = {
            date: sort === "newest" ? "oldest" : "newest",
            total: sort === "total-desc" ? "total-asc" : "total-desc",
        };
        setSort(next[field]);
        setPage(1);
    }

    return (
        <>
            <PageHeader title="Orders" description={pagination ? `${pagination.total} order${pagination.total === 1 ? "" : "s"}` : "Manage customer orders"} />

            <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
                <Input label="Search" icon={Search} type="search" placeholder="Order number, customer, product…" value={search} onChange={(e) => reset(setSearch)(e.target.value)} />
                <Select label="Order status" value={status} onChange={(e) => reset(setStatus)(e.target.value)}>
                    <option value="all">All statuses</option>
                    {Object.entries(ORDER_STATUS).map(([v, s]) => <option key={v} value={v}>{s.label}</option>)}
                </Select>
                <Select label="Payment" value={paymentStatus} onChange={(e) => reset(setPaymentStatus)(e.target.value)}>
                    <option value="all">All payments</option>
                    {Object.entries(PAYMENT_STATUS).map(([v, s]) => <option key={v} value={v}>{s.label}</option>)}
                </Select>
                <Select label="Sort by" value={sort} onChange={(e) => reset(setSort)(e.target.value)}>
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="total-desc">Total: high to low</option>
                    <option value="total-asc">Total: low to high</option>
                </Select>
            </div>

            {error && !data ? (
                <ErrorState message={error.message} onRetry={refetch} />
            ) : loading && !data ? (
                <TableSkeleton rows={8} cols={7} />
            ) : orders.length === 0 ? (
                <EmptyState icon={ShoppingBag} title="No orders found" description="No orders match these filters yet." />
            ) : (
                <div className={loading ? "opacity-60 transition-opacity" : ""}>
                    <Table>
                        <THead>
                            <Tr>
                                <Th>Order</Th>
                                <Th>Customer</Th>
                                <Th>Items</Th>
                                <SortTh label="Total" field="total" sort={sortState} onSort={onSort} />
                                <Th>Payment</Th>
                                <Th>Status</Th>
                                <SortTh label="Date" field="date" sort={sortState} onSort={onSort} />
                                <Th className="text-right">Details</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {orders.map((o) => (
                                <Tr key={o._id}>
                                    <Td className="whitespace-nowrap font-semibold">{o.orderNumber}</Td>
                                    <Td>
                                        <p className="font-medium">{o.customer?.name}</p>
                                        <p className="text-xs text-muted">{o.customer?.email}</p>
                                    </Td>
                                    <Td>{o.items.reduce((n, i) => n + i.quantity, 0)}</Td>
                                    <Td className="whitespace-nowrap font-semibold">{formatMoney(o.total)}</Td>
                                    <Td><PaymentStatusBadge status={o.paymentStatus} /></Td>
                                    <Td><OrderStatusBadge status={o.status} /></Td>
                                    <Td className="whitespace-nowrap text-muted">{formatDate(o.createdAt)}</Td>
                                    <Td className="text-right">
                                        <Button variant="ghost" size="icon" aria-label={`View order ${o.orderNumber}`} onClick={() => setSelected(o)}><Eye size={18} /></Button>
                                    </Td>
                                </Tr>
                            ))}
                        </TBody>
                    </Table>
                    <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} className="mt-5" />
                </div>
            )}

            {selected && (
                <OrderDetailModal
                    key={selected._id}
                    order={selected}
                    onClose={() => setSelected(null)}
                    onChanged={refetch}
                />
            )}
        </>
    );
}
