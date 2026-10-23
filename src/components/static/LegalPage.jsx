import { Link } from "react-router-dom";
import usePageMeta from "../../hooks/usePageMeta";
import PageHeader from "../ui/PageHeader";

/** sections: [{ heading, paragraphs?: string[], list?: string[] }] */
export default function LegalPage({ title, description, updated = "October 23, 2026", sections }) {
    usePageMeta(title, description);
    return (
        <div className="mx-auto max-w-3xl">
            <PageHeader title={title} description={description} />
            <p className="-mt-3 mb-8 text-xs font-medium uppercase tracking-wide text-muted">Last updated: {updated}</p>

            <div className="space-y-8">
                {sections.map((s) => (
                    <section key={s.heading} aria-labelledby={`sec-${s.heading.replace(/\W+/g, "-")}`}>
                        <h2 id={`sec-${s.heading.replace(/\W+/g, "-")}`} className="mb-3 text-xl font-bold">{s.heading}</h2>
                        {s.paragraphs?.map((p) => <p key={p} className="mb-3 leading-7 text-muted">{p}</p>)}
                        {s.list && (
                            <ul className="list-disc space-y-2 pl-5 leading-7 text-muted marker:text-primary">
                                {s.list.map((i) => <li key={i}>{i}</li>)}
                            </ul>
                        )}
                    </section>
                ))}
            </div>

            <p className="mt-10 border-t border-line pt-6 text-sm text-muted">
                Questions about this page? <Link to="/contact" className="font-semibold text-primary hover:underline">Contact us</Link> or read the <Link to="/faq" className="font-semibold text-primary hover:underline">FAQ</Link>.
            </p>
        </div>
    );
}
