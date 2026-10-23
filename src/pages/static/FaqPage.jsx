import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import usePageMeta from "../../hooks/usePageMeta";
import useFetch from "../../hooks/useFetch";
import PageHeader from "../../components/ui/PageHeader";
import Skeleton from "../../components/ui/Skeleton";
import { ErrorState } from "../../components/ui/EmptyState";

export default function FaqPage() {
    usePageMeta("FAQ", "Answers about orders, payment, shipping, returns and your ShopSphere account.");
    const { data, loading, error, refetch } = useFetch("/faqs");
    const faqs = data?.data || [];
    const groups = faqs.reduce((acc, f) => {
        (acc[f.group] ||= []).push(f);
        return acc;
    }, {});

    return (
        <div className="mx-auto max-w-3xl">
            <PageHeader title="Frequently asked questions" description="Quick answers to the things customers ask us most." />

            {loading && !data && <div className="space-y-3" role="status" aria-label="Loading FAQ">{[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>}
            {error && <ErrorState message={error.message} onRetry={refetch} />}

            <div className="space-y-8">
                {Object.entries(groups).map(([group, items]) => (
                    <section key={group}>
                        <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">{group}</h2>
                        <div className="divide-y divide-line rounded-xl border border-line bg-surface">
                            {items.map((f) => (
                                <details key={f._id} className="group px-5">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-semibold [&::-webkit-details-marker]:hidden">
                                        {f.question}
                                        <ChevronDown size={18} aria-hidden="true" className="shrink-0 text-muted transition-transform group-open:rotate-180" />
                                    </summary>
                                    <p className="pb-5 leading-7 text-muted">{f.answer}</p>
                                </details>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            <div className="mt-10 rounded-xl bg-primary-soft p-6 text-center">
                <p className="font-bold">Still need help?</p>
                <p className="mt-1 text-sm text-muted">Our team usually replies within one business day.</p>
                <Link to="/contact" className="mt-4 inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-fg hover:bg-primary-hover">Contact support</Link>
            </div>
        </div>
    );
}
