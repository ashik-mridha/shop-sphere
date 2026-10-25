import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, Plus, Search, Tag, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import usePageMeta from "../../hooks/usePageMeta";
import useFetch from "../../hooks/useFetch";
import { api, errorMessage } from "../../lib/api";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { Input, Select, Textarea } from "../../components/ui/Input";
import { Table, THead, TBody, Tr, Th, Td } from "../../components/ui/Table";
import { TableSkeleton } from "../../components/ui/Skeleton";
import EmptyState, { ErrorState } from "../../components/ui/EmptyState";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import LazyImage from "../../components/ui/LazyImage";

const schema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(60, "Max 60 characters"),
    description: z.string().trim().max(300, "Max 300 characters"),
    image: z.string().trim().max(1000, "Max 1000 characters").refine((v) => v === "" || v.startsWith("https://"), "Use a full https:// image URL"),
});

function CategoryFormModal({ category, onClose, onSaved }) {
    const editing = Boolean(category?._id);
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { name: category?.name || "", description: category?.description || "", image: category?.image || "" },
    });
    const image = useWatch({ control, name: "image" });

    async function onSubmit(values) {
        try {
            if (editing) await api.patch(`/admin/categories/${category._id}`, values);
            else await api.post("/admin/categories", values);
            toast.success(editing ? "Category updated" : "Category created");
            onSaved();
        } catch (err) {
            toast.error(errorMessage(err));
        }
    }

    return (
        <Modal
            open
            onClose={onClose}
            title={editing ? "Edit category" : "New category"}
            footer={
                <>
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" form="category-form" loading={isSubmitting}>{editing ? "Save changes" : "Create category"}</Button>
                </>
            }
        >
            <form id="category-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <Input label="Name" required error={errors.name?.message} {...register("name")} />
                <Textarea label="Description" rows={3} error={errors.description?.message} {...register("description")} />
                <Input
                    label="Image URL"
                    hint="A full https:// image URL"
                    error={errors.image?.message}
                    {...register("image")}
                />
                {image?.trim() && (
                    <LazyImage src={image.trim()} alt="Category preview" className="h-32 w-full rounded-lg border border-line object-cover" />
                )}
            </form>
        </Modal>
    );
}

export default function AdminCategoriesPage() {
    usePageMeta("Manage categories", "Create, edit and remove product categories.");
    const { data, loading, error, refetch } = useFetch("/categories");
    const [q, setQ] = useState("");
    const [sort, setSort] = useState("name");
    const [editing, setEditing] = useState(null); // category object or {} for new
    const [deleting, setDeleting] = useState(null);
    const [busy, setBusy] = useState(false);

    const categories = useMemo(() => {
        const term = q.trim().toLowerCase();
        const list = (data?.data || []).filter((c) => !term || c.name.toLowerCase().includes(term) || c.slug.includes(term));
        return list.sort((a, b) => (sort === "count" ? b.productCount - a.productCount : a.name.localeCompare(b.name)));
    }, [data, q, sort]);

    async function remove() {
        setBusy(true);
        try {
            await api.del(`/admin/categories/${deleting._id}`);
            toast.success("Category deleted");
            setDeleting(null);
            refetch();
        } catch (err) {
            toast.error(errorMessage(err));
            setDeleting(null);
        } finally {
            setBusy(false);
        }
    }

    return (
        <>
            <PageHeader
                title="Categories"
                description="Group products so shoppers can find them."
                actions={<Button onClick={() => setEditing({})}><Plus size={16} aria-hidden="true" /> New category</Button>}
            />

            <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <Input label="Search" icon={Search} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Category name" />
                <Select label="Sort by" value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="name">Name (A–Z)</option>
                    <option value="count">Most products</option>
                </Select>
            </div>

            {error ? (
                <ErrorState message={error.message} onRetry={refetch} />
            ) : loading && !data ? (
                <TableSkeleton rows={6} cols={4} />
            ) : categories.length === 0 ? (
                <EmptyState
                    icon={Tag}
                    title={q ? "No matching categories" : "No categories yet"}
                    description={q ? "Try a different search." : "Create your first category to start organising products."}
                    action={!q && <Button onClick={() => setEditing({})}>New category</Button>}
                />
            ) : (
                <Table>
                    <THead>
                        <tr>
                            <Th>Category</Th>
                            <Th>Slug</Th>
                            <Th className="text-right">Products</Th>
                            <Th>Description</Th>
                            <Th className="text-right">Actions</Th>
                        </tr>
                    </THead>
                    <TBody>
                        {categories.map((c) => (
                            <Tr key={c._id}>
                                <Td>
                                    <div className="flex items-center gap-3">
                                        <LazyImage src={c.image} alt={`${c.name} category`} className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                                        <span className="font-semibold">{c.name}</span>
                                    </div>
                                </Td>
                                <Td className="text-muted">{c.slug}</Td>
                                <Td className="text-right tabular-nums">{c.productCount}</Td>
                                <Td className="max-w-xs"><span className="line-clamp-2 text-muted">{c.description || "—"}</span></Td>
                                <Td>
                                    <div className="flex justify-end gap-1">
                                        <Button size="icon" variant="ghost" aria-label={`Edit ${c.name}`} onClick={() => setEditing(c)}><Pencil size={17} /></Button>
                                        <Button size="icon" variant="ghost" className="text-danger" aria-label={`Delete ${c.name}`} onClick={() => setDeleting(c)}><Trash2 size={17} /></Button>
                                    </div>
                                </Td>
                            </Tr>
                        ))}
                    </TBody>
                </Table>
            )}

            {editing && (
                <CategoryFormModal
                    key={editing._id || "new"}
                    category={editing}
                    onClose={() => setEditing(null)}
                    onSaved={() => {
                        setEditing(null);
                        refetch();
                    }}
                />
            )}

            <ConfirmDialog
                open={Boolean(deleting)}
                title="Delete category?"
                message={deleting ? `“${deleting.name}” will be removed. Categories that still contain products cannot be deleted.` : ""}
                confirmLabel="Delete"
                danger
                loading={busy}
                onConfirm={remove}
                onCancel={() => setDeleting(null)}
            />
        </>
    );
}
