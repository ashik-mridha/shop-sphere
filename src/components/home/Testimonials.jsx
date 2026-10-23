import { BadgeCheck, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import StarRating from "../ui/StarRating";
import Skeleton from "../ui/Skeleton";
import { SectionHeader } from "../ui/PageHeader";
import { formatDate } from "../../lib/format";

export default function Testimonials() {
    const { data, loading, error } = useFetch("/reviews/featured");
    const reviews = (data?.data || []).slice(0, 3);
    if (!loading && (error || !reviews.length)) return null;

    return (
        <section aria-labelledby="home-reviews">
            <SectionHeader eyebrow="Reviews" title={<span id="home-reviews">What verified buyers say</span>} description="Only customers who bought a product can review it." />
            <div className="grid gap-4 md:grid-cols-3">
                {loading
                    ? Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-48" />)
                    : reviews.map((r) => (
                        <figure key={r._id} className="flex flex-col rounded-xl border border-line bg-surface p-5">
                            <Quote size={22} className="text-primary" aria-hidden="true" />
                            <StarRating value={r.rating} className="mt-3" />
                            <blockquote className="mt-3 flex-1 text-sm">
                                {r.title && <p className="mb-1 font-semibold">{r.title}</p>}
                                <p className="text-muted">{r.comment}</p>
                            </blockquote>
                            <figcaption className="mt-4 border-t border-line pt-3 text-sm">
                                <span className="font-semibold">{r.userName}</span>
                                <span className="ml-2 inline-flex items-center gap-1 text-xs text-primary"><BadgeCheck size={13} aria-hidden="true" />Verified purchase</span>
                                <span className="mt-0.5 block text-xs text-muted">
                                    on <Link to={`/shop/${r.productId}`} className="hover:underline">{r.productTitle}</Link> · {formatDate(r.createdAt)}
                                </span>
                            </figcaption>
                        </figure>
                    ))}
            </div>
        </section>
    );
}
