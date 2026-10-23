import { useState } from "react";
import { Pencil, Plus, Search, Trash2, PackageSearch } from "lucide-react";
import toast from "react-hot-toast";
import usePageMeta from "../../hooks/usePageMeta";
import useFetch from "../../hooks/useFetch";
import useDebounce from "../../hooks/useDebounce";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Input, Select } from "../../components/ui/Input";
import { Table, THead, TBody, Tr, Th, Td, SortTh } from "../../components/ui/Table";
import Pagination from "../../components/ui/Pagination";
import { TableSkeleton } from "../../components/ui/Skeleton";
import EmptyState, { ErrorState } from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import LazyImage from "../../components/ui/LazyImage";
import ProductForm from "../../components/admin/ProductForm";
import { api, errorMessage } from "../../lib/api";
import { formatMoney, titleCase } from "../../lib/format";

const SORT_OPTIONS = [
    ["newest", "Newest first"], ["title", "Title A–Z"], ["price-asc", "Price: low to high"], ["price-desc", "Price: high to low"],
    ["stock-asc", "Stock: low to high"], ["stock-desc", "Stock: high to low"], ["popular", "Best selling"], ["rating", "Top rated"],
];

// Sortable headers toggle between these API sorts
const HEADER_SORTS = { title: ["title", "title"], price: ["price-asc", "price-desc"], stock: ["stock-asc", "stock-desc"] };

export default function AdminProductsPage() {
    usePageMeta("Manage products", "Add, edit and remove products.");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);
    const [form, setForm] = useState(null); // null | { product }
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const q = useDebounce(search.trim());

    const { data: cats } = useFetch("/categories");
    const categories = cats?.data || [];
    const { data, loading, error, refetch } = useFetch("/admin/products", { params: { q, category, status, sort, page, limit: 10 } });
    const products = data?.data || [];
    const pagination = data?.pagination;

    const reset = (setter) => (value) => { setter(value); setPage(1); };

    const sortState = (() => {
        for (const [field, [asc, desc]] of Object.entries(HEADER_SORTS)) {
            if (sort === asc) return { field, dir: "asc" };
            if (sort === desc) return { field, dir: "desc" };
        }
        return null;
    })();

    function onSort(field) {
        const [asc, desc] = HEADER_SORTS[field];
        setSort(sortState?.field === field && sortState.dir === "asc" ? desc : asc);
        setPage(1);
    }

    async function confirmDelete() {
        setDeleting(true);
        try {
            await api.del(`/admin/products/${toDelete._id}`);
            toast.success("Product deleted");
            setToDelete(null);
            refetch();
        } catch (err) {
            toast.error(errorMessage(err));
        } finally {
            setDeleting(false);
        }
    }

    return (
        <>
            <PageHeader
                title="Products"
                description={pagination ? `${pagination.total} product${pagination.total === 1 ? "" : "s"}` : "Manage your catalogue"}
                actions={<Button onClick={() => setForm({ product: null })}><Plus size={16} aria-hidden="true" /> Add product</Button>}
            />

            <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
                <Input label="Search" icon={Search} type="search" placeholder="Title, brand, SKU…" value={search} onChange={(e) => reset(setSearch)(e.target.value)} />
                <Select label="Category" value={category} onChange={(e) => reset(setCategory)(e.target.value)}>
                    <option value="">All categories</option>
                    {categories.map((c) => <option key={c._id} value={c.slug}>{c.name}</option>)}
                </Select>
                <Select label="Status" value={status} onChange={(e) => reset(setStatus)(e.target.value)}>
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                </Select>
                <Select label="Sort by" value={sort} onChange={(e) => reset(setSort)(e.target.value)}>
                    {SORT_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </Select>
            </div>

            {error && !data ? (
                <ErrorState message={error.message} onRetry={refetch} />
            ) : loading && !data ? (
                <TableSkeleton rows={8} cols={6} />
            ) : products.length === 0 ? (
                <EmptyState
                    icon={PackageSearch}
                    title="No products found"
                    description={q || category || status !== "all" ? "Try changing or clearing the filters." : "Add your first product to start selling."}
                    action={<Button onClick={() => setForm({ product: null })}>Add product</Button>}
                />
            ) : (
                <div className={loading ? "opacity-60 transition-opacity" : ""}>
                    <Table>
                        <THead>
                            <Tr>
                                <Th>Image</Th>
                                <SortTh label="Product" field="title" sort={sortState} onSort={onSort} />
                                <Th>Category</Th>
                                <SortTh label="Price" field="price" sort={sortState} onSort={onSort} />
                                <SortTh label="Stock" field="stock" sort={sortState} onSort={onSort} />
                                <Th>Status</Th>
                                <Th className="text-right">Actions</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {products.map((p) => (
                                <Tr key={p._id}>
                                    <Td><LazyImage src={p.image} alt={p.title} className="h-12 w-12 rounded-lg border border-line object-cover" /></Td>
                                    <Td className="max-w-64">
                                        <p className="truncate font-semibold">{p.title}</p>
                                        <p className="text-xs text-muted">{p.sku || "No SKU"}{p.brand ? ` · ${p.brand}` : ""}</p>
                                    </Td>
                                    <Td>{titleCase(p.category)}</Td>
                                    <Td className="whitespace-nowrap">
                                        <span className="font-semibold">{formatMoney(p.price)}</span>
                                        {p.discountPercent > 0 && (
                                            <span className="ml-2 text-xs text-muted"><s>{formatMoney(p.compareAtPrice)}</s> <Badge tone="warning">-{p.discountPercent}%</Badge></span>
                                        )}
                                    </Td>
                                    <Td>
                                        {p.stock <= 0 ? <Badge tone="danger">Out of stock</Badge> : p.stock <= 5 ? <Badge tone="warning">Low · {p.stock}</Badge> : p.stock}
                                    </Td>
                                    <Td><Badge tone={p.status === "draft" ? "neutral" : "success"}>{p.status === "draft" ? "Draft" : "Active"}</Badge></Td>
                                    <Td>
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" aria-label={`Edit ${p.title}`} onClick={() => setForm({ product: p })}><Pencil size={17} /></Button>
                                            <Button variant="ghost" size="icon" aria-label={`Delete ${p.title}`} className="text-danger" onClick={() => setToDelete(p)}><Trash2 size={17} /></Button>
                                        </div>
                                    </Td>
                                </Tr>
                            ))}
                        </TBody>
                    </Table>
                    <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} className="mt-5" />
                </div>
            )}

            {form && (
                <ProductForm
                    product={form.product}
                    categories={categories}
                    onClose={() => setForm(null)}
                    onSaved={() => { setForm(null); refetch(); }}
                />
            )}

            <ConfirmDialog
                open={Boolean(toDelete)}
                danger
                loading={deleting}
                title="Delete product?"
                message={toDelete ? `“${toDelete.title}” and its reviews will be permanently removed. This cannot be undone.` : ""}
                confirmLabel="Delete"
                onConfirm={confirmDelete}
                onCancel={() => setToDelete(null)}
            />
        </>
    );
}
