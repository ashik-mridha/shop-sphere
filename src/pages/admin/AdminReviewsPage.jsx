import { useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, Eye, EyeOff, Search, Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import usePageMeta from "../../hooks/usePageMeta";
import useFetch from "../../hooks/useFetch";
import useDebounce from "../../hooks/useDebounce";
import { api, errorMessage } from "../../lib/api";
import { formatDate } from "../../lib/format";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import StarRating from "../../components/ui/StarRating";
import { Input, Select } from "../../components/ui/Input";
import { TableSkeleton } from "../../components/ui/Skeleton";
import EmptyState, { ErrorState } from "../../components/ui/EmptyState";
import Pagination from "../../components/ui/Pagination";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function AdminReviewsPage() {
    usePageMeta("Moderate reviews", "Hide, approve or delete customer reviews.");
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("all");
    const [rating, setRating] = useState("all");
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);
    const [deleting, setDeleting] = useState(null);
    const [busyId, setBusyId] = useState(null);
    const debouncedQ = useDebounce(q);

    const { data, loading, error, refetch } = useFetch("/admin/reviews", {
        params: { q: debouncedQ, status, rating, sort, page, limit: 10 },
    });
    const reviews = data?.data || [];
    const pagination = data?.pagination;

    const reset = (setter) => (e) => {
        setter(e.target.value);
        setPage(1);
    };

    async function setReviewStatus(r) {
        const next = r.status === "approved" ? "hidden" : "approved";
        setBusyId(r._id);
        try {
            await api.patch(`/admin/reviews/${r._id}`, { status: next });
            toast.success(next === "hidden" ? "Review hidden from the storefront" : "Review approved");
            refetch();
        } catch (err) {
            toast.error(errorMessage(err));
        } finally {
            setBusyId(null);
        }
    }

    async function remove() {
        setBusyId(deleting._id);
        try {
            await api.del(`/admin/reviews/${deleting._id}`);
            toast.success("Review deleted");
            setDeleting(null);
            if (reviews.length === 1 && page > 1) setPage(page - 1);
            else refetch();
        } catch (err) {
            toast.error(errorMessage(err));
        } finally {
            setBusyId(null);
        }
    }

    return (
        <>
            <PageHeader title="Reviews" description={pagination ? `${pagination.total} review${pagination.total === 1 ? "" : "s"}` : "Moderate customer feedback"} />

            <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Input label="Search" icon={Search} type="search" value={q} onChange={reset(setQ)} placeholder="Review, reviewer or product" />
                <Select label="Status" value={status} onChange={reset(setStatus)}>
                    <option value="all">All statuses</option>
                    <option value="approved">Approved</option>
                    <option value="hidden">Hidden</option>
                </Select>
                <Select label="Rating" value={rating} onChange={reset(setRating)}>
                    <option value="all">All ratings</option>
                    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>)}
                </Select>
                <Select label="Sort by" value={sort} onChange={reset(setSort)}>
                    <option value="newest">Newest first</option>
                    <option value="rating">Highest rating</option>
                </Select>
            </div>

            {error ? (
                <ErrorState message={error.message} onRetry={refetch} />
            ) : loading && !data ? (
                <TableSkeleton rows={5} cols={3} />
            ) : reviews.length === 0 ? (
                <EmptyState icon={Star} title="No reviews found" description="Reviews appear here once verified buyers submit them." />
            ) : (
                <div className={loading ? "opacity-60 transition-opacity" : ""}>
                    <ul className="space-y-3">
                        {reviews.map((r) => (
                            <li key={r._id}>
                                <Card className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <StarRating value={r.rating} size={16} />
                                            <Badge tone={r.status === "approved" ? "success" : "neutral"}>{r.status === "approved" ? "Approved" : "Hidden"}</Badge>
                                            {r.verifiedPurchase && <Badge tone="primary"><BadgeCheck size={12} aria-hidden="true" /> Verified purchase</Badge>}
                                        </div>
                                        {r.title && <p className="mt-2 font-semibold">{r.title}</p>}
                                        <p className="mt-1 break-words text-sm text-fg/90">{r.comment}</p>
                                        <p className="mt-2 text-xs text-muted">
                                            {r.userName} · {formatDate(r.createdAt)} · on{" "}
                                            <Link to={`/shop/${r.productId}`} className="font-semibold text-primary hover:underline">{r.productTitle}</Link>
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 gap-2">
                                        <Button size="sm" variant="outline" loading={busyId === r._id && !deleting} onClick={() => setReviewStatus(r)}>
                                            {r.status === "approved" ? <><EyeOff size={15} aria-hidden="true" /> Hide</> : <><Eye size={15} aria-hidden="true" /> Approve</>}
                                        </Button>
                                        <Button size="sm" variant="danger-soft" onClick={() => setDeleting(r)}>
                                            <Trash2 size={15} aria-hidden="true" /> Delete
                                        </Button>
                                    </div>
                                </Card>
                            </li>
                        ))}
                    </ul>
                    <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} className="mt-5" />
                </div>
            )}

            <ConfirmDialog
                open={Boolean(deleting)}
                title="Delete review?"
                message="This permanently removes the review and updates the product’s rating."
                confirmLabel="Delete"
                danger
                loading={Boolean(deleting) && busyId === deleting?._id}
                onConfirm={remove}
                onCancel={() => setDeleting(null)}
            />
        </>
    );
}
