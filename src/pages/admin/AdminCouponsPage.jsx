import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, Plus, Ticket, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import usePageMeta from "../../hooks/usePageMeta";
import useFetch from "../../hooks/useFetch";
import { api, errorMessage } from "../../lib/api";
import { formatDate, formatMoney } from "../../lib/format";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Checkbox, Input, Select, Textarea } from "../../components/ui/Input";
import { Table, THead, TBody, Tr, Th, Td } from "../../components/ui/Table";
import { TableSkeleton } from "../../components/ui/Skeleton";
import EmptyState, { ErrorState } from "../../components/ui/EmptyState";
import Pagination from "../../components/ui/Pagination";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

const schema = z
    .object({
        code: z.string().trim().min(3, "At least 3 characters").max(30, "Max 30 characters").regex(/^[A-Za-z0-9_-]+$/, "Letters, numbers, - and _ only"),
        type: z.enum(["percent", "fixed"]),
        value: z.number({ error: "Enter a number" }).positive("Must be greater than 0"),
        minSubtotal: z.number({ error: "Enter a number" }).min(0, "Cannot be negative"),
        maxUses: z.number({ error: "Enter a number" }).int("Whole numbers only").min(0, "Cannot be negative"),
        expiresAt: z.string(),
        active: z.boolean(),
        public: z.boolean(),
        description: z.string().trim().max(200, "Max 200 characters"),
    })
    .refine((c) => c.type !== "percent" || c.value <= 100, { message: "Percent cannot exceed 100", path: ["value"] });

const discountLabel = (c) => (c.type === "percent" ? `${c.value}% off` : `${formatMoney(c.value)} off`);

function CouponFormModal({ coupon, onClose, onSaved }) {
    const editing = Boolean(coupon?._id);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            code: coupon?.code || "",
            type: coupon?.type || "percent",
            value: coupon?.value ?? 10,
            minSubtotal: coupon?.minSubtotal ?? 0,
            maxUses: coupon?.maxUses ?? 0,
            expiresAt: coupon?.expiresAt ? String(coupon.expiresAt).slice(0, 10) : "",
            active: coupon?.active ?? true,
            public: coupon?.public ?? false,
            description: coupon?.description || "",
        },
    });

    async function onSubmit(values) {
        const body = {
            ...values,
            code: values.code.toUpperCase(),
            expiresAt: values.expiresAt ? new Date(`${values.expiresAt}T23:59:59`).toISOString() : null,
        };
        try {
            if (editing) await api.patch(`/admin/coupons/${coupon._id}`, body);
            else await api.post("/admin/coupons", body);
            toast.success(editing ? "Coupon updated" : "Coupon created");
            onSaved();
        } catch (err) {
            toast.error(errorMessage(err));
        }
    }

    return (
        <Modal
            open
            onClose={onClose}
            title={editing ? "Edit coupon" : "New coupon"}
            footer={
                <>
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" form="coupon-form" loading={isSubmitting}>{editing ? "Save changes" : "Create coupon"}</Button>
                </>
            }
        >
            <form id="coupon-form" onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 sm:grid-cols-2">
                <Input label="Code" required className="uppercase" error={errors.code?.message} wrapperClassName="sm:col-span-2" {...register("code")} />
                <Select label="Discount type" error={errors.type?.message} {...register("type")}>
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed amount ($)</option>
                </Select>
                <Input label="Value" type="number" step="0.01" min="0" required error={errors.value?.message} {...register("value", { valueAsNumber: true })} />
                <Input label="Minimum subtotal ($)" type="number" step="0.01" min="0" error={errors.minSubtotal?.message} {...register("minSubtotal", { valueAsNumber: true })} />
                <Input label="Max uses" type="number" min="0" step="1" hint="0 = unlimited" error={errors.maxUses?.message} {...register("maxUses", { valueAsNumber: true })} />
                <Input label="Expires on" type="date" hint="Leave empty for no expiry" error={errors.expiresAt?.message} wrapperClassName="sm:col-span-2" {...register("expiresAt")} />
                <Textarea label="Description" rows={2} error={errors.description?.message} wrapperClassName="sm:col-span-2" {...register("description")} />
                <Checkbox label="Active (can be redeemed)" {...register("active")} />
                <Checkbox label="Public (advertised on the storefront)" {...register("public")} />
            </form>
        </Modal>
    );
}

export default function AdminCouponsPage() {
    usePageMeta("Manage coupons", "Create and manage discount codes.");
    const [page, setPage] = useState(1);
    const { data, loading, error, refetch } = useFetch("/admin/coupons", { params: { page, limit: 10 } });
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [busy, setBusy] = useState(false);
    const [togglingId, setTogglingId] = useState(null);

    const coupons = data?.data || [];
    const pagination = data?.pagination;

    async function toggleActive(c) {
        setTogglingId(c._id);
        try {
            await api.patch(`/admin/coupons/${c._id}`, { active: !c.active });
            toast.success(c.active ? "Coupon paused" : "Coupon activated");
            refetch();
        } catch (err) {
            toast.error(errorMessage(err));
        } finally {
            setTogglingId(null);
        }
    }

    async function remove() {
        setBusy(true);
        try {
            await api.del(`/admin/coupons/${deleting._id}`);
            toast.success("Coupon deleted");
            setDeleting(null);
            if (coupons.length === 1 && page > 1) setPage(page - 1);
            else refetch();
        } catch (err) {
            toast.error(errorMessage(err));
        } finally {
            setBusy(false);
        }
    }

    return (
        <>
            <PageHeader
                title="Coupons"
                description="Discount codes shoppers can apply in the cart."
                actions={<Button onClick={() => setEditing({})}><Plus size={16} aria-hidden="true" /> New coupon</Button>}
            />

            {error ? (
                <ErrorState message={error.message} onRetry={refetch} />
            ) : loading && !data ? (
                <TableSkeleton rows={5} cols={6} />
            ) : coupons.length === 0 ? (
                <EmptyState icon={Ticket} title="No coupons yet" description="Create a code to offer a percentage or fixed discount." action={<Button onClick={() => setEditing({})}>New coupon</Button>} />
            ) : (
                <div className={loading ? "opacity-60 transition-opacity" : ""}>
                    <Table>
                        <THead>
                            <tr>
                                <Th>Code</Th>
                                <Th>Discount</Th>
                                <Th>Min. subtotal</Th>
                                <Th>Uses</Th>
                                <Th>Expires</Th>
                                <Th>Status</Th>
                                <Th className="text-right">Actions</Th>
                            </tr>
                        </THead>
                        <TBody>
                            {coupons.map((c) => {
                                const expired = c.expiresAt && new Date(c.expiresAt) < new Date();
                                return (
                                    <Tr key={c._id}>
                                        <Td>
                                            <p className="font-mono font-bold">{c.code}</p>
                                            {c.description && <p className="max-w-52 truncate text-xs text-muted">{c.description}</p>}
                                        </Td>
                                        <Td className="whitespace-nowrap">{discountLabel(c)}</Td>
                                        <Td>{c.minSubtotal ? formatMoney(c.minSubtotal) : "None"}</Td>
                                        <Td className="whitespace-nowrap tabular-nums">{c.usedCount || 0} / {c.maxUses ? c.maxUses : "unlimited"}</Td>
                                        <Td className="whitespace-nowrap">{c.expiresAt ? formatDate(c.expiresAt) : "Never"}</Td>
                                        <Td>
                                            <div className="flex flex-wrap gap-1.5">
                                                <Badge tone={expired ? "danger" : c.active ? "success" : "neutral"}>{expired ? "Expired" : c.active ? "Active" : "Paused"}</Badge>
                                                {c.public && <Badge tone="info">Public</Badge>}
                                            </div>
                                        </Td>
                                        <Td>
                                            <div className="flex items-center justify-end gap-1">
                                                <Button size="sm" variant="outline" loading={togglingId === c._id} onClick={() => toggleActive(c)}>
                                                    {c.active ? "Pause" : "Activate"}
                                                </Button>
                                                <Button size="icon" variant="ghost" aria-label={`Edit ${c.code}`} onClick={() => setEditing(c)}><Pencil size={17} /></Button>
                                                <Button size="icon" variant="ghost" className="text-danger" aria-label={`Delete ${c.code}`} onClick={() => setDeleting(c)}><Trash2 size={17} /></Button>
                                            </div>
                                        </Td>
                                    </Tr>
                                );
                            })}
                        </TBody>
                    </Table>
                    <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} className="mt-5" />
                </div>
            )}

            {editing && (
                <CouponFormModal
                    key={editing._id || "new"}
                    coupon={editing}
                    onClose={() => setEditing(null)}
                    onSaved={() => {
                        setEditing(null);
                        refetch();
                    }}
                />
            )}

            <ConfirmDialog
                open={Boolean(deleting)}
                title="Delete coupon?"
                message={deleting ? `The code ${deleting.code} will stop working immediately.` : ""}
                confirmLabel="Delete"
                danger
                loading={busy}
                onConfirm={remove}
                onCancel={() => setDeleting(null)}
            />
        </>
    );
}
