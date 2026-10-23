import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Clock, Mail, MessageCircleQuestion } from "lucide-react";
import toast from "react-hot-toast";
import usePageMeta from "../../hooks/usePageMeta";
import useAuth from "../../hooks/useAuth";
import { api, errorMessage } from "../../lib/api";
import { SUPPORT_EMAIL } from "../../lib/config";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/Input";

const schema = z.object({
    name: z.string().trim().min(2, "Please enter your name").max(100),
    email: z.string().trim().email("Enter a valid email address").max(200),
    subject: z.string().trim().min(3, "Add a short subject").max(150),
    message: z.string().trim().min(10, "Tell us a little more (at least 10 characters)").max(3000, "Please keep it under 3000 characters"),
});

export default function ContactPage() {
    usePageMeta("Contact us", "Questions about an order, a product or your account? Send us a message and we’ll reply within one business day.");
    const { user } = useAuth();
    const [sent, setSent] = useState("");
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { name: user?.name || "", email: user?.email || "", subject: "", message: "" },
    });

    async function onSubmit(values) {
        try {
            const res = await api.post("/contact", values);
            setSent(res.message);
            reset({ ...values, subject: "", message: "" });
        } catch (error) {
            toast.error(errorMessage(error));
        }
    }

    return (
        <>
            <PageHeader title="Contact us" description="We’re here to help with orders, products and your account." />

            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                <Card>
                    {sent && <p role="status" className="mb-5 rounded-lg bg-primary-soft px-4 py-3 text-sm font-medium text-primary">{sent}</p>}
                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 sm:grid-cols-2">
                        <Input label="Your name" required autoComplete="name" error={errors.name?.message} {...register("name")} />
                        <Input label="Email" type="email" required autoComplete="email" error={errors.email?.message} {...register("email")} />
                        <Input label="Subject" required error={errors.subject?.message} wrapperClassName="sm:col-span-2" hint="For order questions, include your order number." {...register("subject")} />
                        <Textarea label="Message" required rows={6} error={errors.message?.message} wrapperClassName="sm:col-span-2" {...register("message")} />
                        <div className="sm:col-span-2">
                            <Button type="submit" size="lg" loading={isSubmitting}>Send message</Button>
                        </div>
                    </form>
                </Card>

                <div className="space-y-4">
                    <Card>
                        <div className="flex items-start gap-3">
                            <Mail className="mt-0.5 text-primary" size={20} aria-hidden="true" />
                            <div><h2 className="font-bold">Email</h2><a href={`mailto:${SUPPORT_EMAIL}`} className="text-sm text-primary hover:underline break-all">{SUPPORT_EMAIL}</a></div>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-start gap-3">
                            <Clock className="mt-0.5 text-primary" size={20} aria-hidden="true" />
                            <div><h2 className="font-bold">Response time</h2><p className="text-sm text-muted">We usually reply within one business day, Monday to Friday.</p></div>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-start gap-3">
                            <MessageCircleQuestion className="mt-0.5 text-primary" size={20} aria-hidden="true" />
                            <div><h2 className="font-bold">Quick answers</h2><p className="text-sm text-muted">Shipping, returns and payments are covered in our <Link to="/faq" className="font-semibold text-primary hover:underline">FAQ</Link>.</p></div>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}
