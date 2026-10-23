import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import toast from "react-hot-toast";
import useFetch from "../../hooks/useFetch";
import useAuth from "../../hooks/useAuth";
import { api, errorMessage } from "../../lib/api";
import { formatDate } from "../../lib/format";
import Button from "../ui/Button";
import { Input, Textarea } from "../ui/Input";
import Pagination from "../ui/Pagination";
import StarRating, { RatingInput } from "../ui/StarRating";
import Skeleton from "../ui/Skeleton";

const REASONS = {
    not_purchased: "Only customers who have bought this product can review it. Reviews from buyers are marked as verified.",
    already_reviewed: "You have already reviewed this product. Thank you for sharing your experience.",
};

function ReviewForm({ productId, onDone }) {
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState("");
    const [comment, setComment] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    async function submit(e) {
        e.preventDefault();
        if (!rating) return setError("Please choose a star rating.");
        if (comment.trim().length < 10) return setError("Please write at least 10 characters.");
        setError("");
        setBusy(true);
        try {
            const res = await api.post(`/products/${productId}/reviews`, { rating, title, comment });
            toast.success(res.message);
            onDone();
        } catch (err) {
            setError(errorMessage(err));
        } finally {
            setBusy(false);
        }
    }

    return (
        <form onSubmit={submit} className="space-y-4 rounded-xl border border-line bg-surface p-5">
            <h3 className="text-lg font-bold">Write a review</h3>
            <RatingInput value={rating} onChange={setRating} />
            <Input label="Headline (optional)" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
            <Textarea label="Your review" required value={comment} onChange={(e) => setComment(e.target.value)} maxLength={2000} hint="What did you like or dislike? How do you use it?" />
            {error && <p role="alert" className="text-sm font-medium text-danger">{error}</p>}
            <Button type="submit" loading={busy}>Submit review</Button>
        </form>
    );
}

export default function ReviewsSection({ productId, rating, reviewCount, onChanged }) {
    const [page, setPage] = useState(1);
    const { isPending } = useAuth();
    const location = useLocation();
    const reviews = useFetch(`/products/${productId}/reviews`, { params: { page, limit: 6 } });
    const eligibility = useFetch(`/products/${productId}/reviews/eligibility`, { enabled: !isPending });
    const el = eligibility.data?.data;
    const list = reviews.data?.data || [];
    const dist = reviews.data?.distribution || {};
    const pagination = reviews.data?.pagination;

    function reload() {
        reviews.refetch();
        eligibility.refetch();
        onChanged?.();
    }

    return (
        <section aria-labelledby="reviews-heading" className="mt-14">
            <h2 id="reviews-heading" className="text-2xl font-bold">Customer reviews</h2>

            <div className="mt-6 grid gap-8 lg:grid-cols-[320px_1fr]">
                <div className="space-y-6">
                    <div className="rounded-xl border border-line bg-surface p-5">
                        {reviewCount > 0 ? (
                            <>
                                <p className="text-4xl font-extrabold">{rating.toFixed(1)}<span className="text-lg font-semibold text-muted"> / 5</span></p>
                                <StarRating value={rating} size={20} className="mt-1" />
                                <p className="mt-1 text-sm text-muted">Based on {reviewCount} verified {reviewCount === 1 ? "review" : "reviews"}</p>
                                <ul className="mt-4 space-y-2" aria-label="Rating breakdown">
                                    {[5, 4, 3, 2, 1].map((n) => {
                                        const count = dist[n] || 0;
                                        return (
                                            <li key={n} className="flex items-center gap-3 text-sm">
                                                <span className="w-12 shrink-0 text-muted">{n} star</span>
                                                <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                                                    <span className="block h-full rounded-full bg-accent" style={{ width: `${reviewCount ? (count / reviewCount) * 100 : 0}%` }} />
                                                </span>
                                                <span className="w-6 text-right text-muted">{count}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </>
                        ) : (
                            <p className="text-sm text-muted">No reviews yet. Be the first to review this product after you buy it.</p>
                        )}
                    </div>

                    {el?.canReview ? (
                        <ReviewForm productId={productId} onDone={reload} />
                    ) : el ? (
                        <p className="rounded-xl border border-line bg-surface p-5 text-sm text-muted">
                            {el.reason === "login" ? (
                                <>
                                    <Link to="/login" state={{ from: location }} className="font-semibold text-primary hover:underline">Sign in</Link> to review products you have bought.
                                </>
                            ) : (
                                REASONS[el.reason]
                            )}
                        </p>
                    ) : null}
                </div>

                <div>
                    {reviews.loading && !list.length ? (
                        <div className="space-y-4">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-28" />)}</div>
                    ) : reviews.error ? (
                        <p role="alert" className="text-sm text-danger">Reviews could not be loaded. {reviews.error.message}</p>
                    ) : list.length === 0 ? (
                        <p className="text-sm text-muted">Nothing here yet.</p>
                    ) : (
                        <>
                            <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
                                {list.map((r) => (
                                    <li key={r._id} className="p-5">
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                            <StarRating value={r.rating} />
                                            {r.title && <h3 className="font-semibold">{r.title}</h3>}
                                        </div>
                                        <p className="mt-2 text-sm">{r.comment}</p>
                                        <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
                                            <span className="font-semibold text-fg">{r.userName}</span>
                                            {r.verifiedPurchase && <span className="inline-flex items-center gap-1 text-primary"><BadgeCheck size={13} aria-hidden="true" />Verified purchase</span>}
                                            <span>{formatDate(r.createdAt)}</span>
                                        </p>
                                    </li>
                                ))}
                            </ul>
                            <Pagination className="mt-6" page={pagination?.page || 1} pages={pagination?.pages || 1} onChange={setPage} />
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
