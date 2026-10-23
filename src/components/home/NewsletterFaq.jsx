import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { Input } from "../ui/Input";
import useFetch from "../../hooks/useFetch";
import { api, errorMessage } from "../../lib/api";
import { SectionHeader } from "../ui/PageHeader";

export function NewsletterSection() {
    const [email, setEmail] = useState("");
    const [busy, setBusy] = useState(false);

    async function submit(e) {
        e.preventDefault();
        setBusy(true);
        try {
            const res = await api.post("/newsletter", { email });
            toast.success(res.message);
            setEmail("");
        } catch (error) {
            toast.error(errorMessage(error));
        } finally {
            setBusy(false);
        }
    }

    return (
        <section aria-labelledby="home-newsletter" className="rounded-2xl bg-primary px-5 py-10 text-primary-fg sm:px-10">
            <div className="mx-auto grid max-w-4xl items-center gap-6 md:grid-cols-2">
                <div>
                    <h2 id="home-newsletter" className="text-2xl font-extrabold sm:text-3xl">Be first to hear about new arrivals and offers</h2>
                    <p className="mt-2 text-sm opacity-90">One short email when something worth knowing happens. No spam, ever.</p>
                </div>
                <form onSubmit={submit} className="flex flex-col gap-3 rounded-xl bg-surface p-4 text-fg sm:flex-row sm:items-end">
                    <div className="flex-1">
                        <Input
                            label="Email address"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                    </div>
                    <Button type="submit" variant="primary" size="md" loading={busy}>Subscribe</Button>
                </form>
            </div>
        </section>
    );
}

export function FaqPreview() {
    const { data } = useFetch("/faqs");
    const faqs = (data?.data || []).slice(0, 5);
    if (!faqs.length) return null;

    return (
        <section aria-labelledby="home-faq" className="mx-auto w-full max-w-3xl">
            <SectionHeader eyebrow="Help" title={<span id="home-faq">Frequently asked questions</span>} />
            <div className="divide-y divide-line rounded-xl border border-line bg-surface">
                {faqs.map((f) => (
                    <details key={f._id} className="group px-5 py-4">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold">
                            {f.question}
                            <ChevronDown size={18} aria-hidden="true" className="shrink-0 text-muted transition-transform group-open:rotate-180" />
                        </summary>
                        <p className="mt-2 text-sm text-muted">{f.answer}</p>
                    </details>
                ))}
            </div>
            <p className="mt-4 text-center text-sm">
                <Link to="/faq" className="font-semibold text-primary hover:underline">Read all questions</Link>
            </p>
        </section>
    );
}
