import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Checkbox, Input, Select, Textarea } from "../ui/Input";
import LazyImage from "../ui/LazyImage";
import { api, errorMessage } from "../../lib/api";

const imageUrl = z
    .string()
    .trim()
    .min(1, "Enter an image URL")
    .max(1000)
    .refine((v) => v.startsWith("https://"), "Use a full https:// image URL");

const optionalNumber = (v) => (v === "" || v == null || Number.isNaN(Number(v)) ? null : Number(v));

const schema = z.object({
    title: z.string().trim().min(2, "At least 2 characters").max(160),
    description: z.string().trim().min(10, "At least 10 characters").max(5000),
    price: z.number({ error: "Enter a price" }).min(0, "Cannot be negative").max(1000000),
    compareAtPrice: z.number().min(0).nullable(),
    category: z.string().min(1, "Choose a category"),
    brand: z.string().trim().max(80),
    image: imageUrl,
    extraImages: z.array(z.object({ url: z.string().trim().max(1000).refine((v) => v === "" || v.startsWith("https://"), "Use a full https:// image URL") })),
    stock: z.number({ error: "Enter the stock level" }).int("Whole numbers only").min(0).max(1000000),
    sku: z.string().trim().max(60),
    specs: z.array(z.object({ label: z.string().trim().max(60), value: z.string().trim().max(200) })),
    colors: z.string().max(300),
    sizes: z.string().max(300),
    featured: z.boolean(),
    isNew: z.boolean(),
    status: z.enum(["active", "draft", "archived"]),
});

const toList = (text) => [...new Set(text.split(",").map((s) => s.trim()).filter(Boolean))];

function defaults(product) {
    const extras = (product?.images || []).filter((u) => u !== product?.image);
    return {
        title: product?.title || "",
        description: product?.description || "",
        price: product?.price ?? undefined,
        compareAtPrice: product?.compareAtPrice ?? null,
        category: product?.category || "",
        brand: product?.brand || "",
        image: product?.image || "",
        extraImages: extras.map((url) => ({ url })),
        stock: product?.stock ?? 0,
        sku: product?.sku || "",
        specs: product?.specs?.length ? product.specs : [],
        colors: (product?.colors || []).join(", "),
        sizes: (product?.sizes || []).join(", "),
        featured: Boolean(product?.featured),
        isNew: Boolean(product?.isNew),
        status: ["draft", "archived"].includes(product?.status) ? product.status : "active",
    };
}

/** Rendered only while open, so every open starts from fresh defaults. */
export default function ProductForm({ product, categories, onClose, onSaved }) {
    const [saving, setSaving] = useState(false);
    const editing = Boolean(product);
    const {
        register, handleSubmit, control, setError,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema), defaultValues: defaults(product) });
    const extra = useFieldArray({ control, name: "extraImages" });
    const specs = useFieldArray({ control, name: "specs" });

    const price = useWatch({ control, name: "price" });
    const compare = useWatch({ control, name: "compareAtPrice" });
    const mainImage = useWatch({ control, name: "image" });
    const discount = compare > price && price >= 0 ? Math.round(((compare - price) / compare) * 100) : 0;

    async function onSubmit(values) {
        const images = [...new Set([values.image, ...values.extraImages.map((i) => i.url).filter(Boolean)])];
        const body = {
            title: values.title,
            description: values.description,
            price: values.price,
            compareAtPrice: values.compareAtPrice,
            category: values.category,
            brand: values.brand,
            image: values.image,
            images,
            // alt text and credits belong to a specific URL: keep them for URLs that stay, blank for new ones
            imageAlts: images.map((u) => product?.imageAlts?.[product.images?.indexOf(u)] || ""),
            imageCredits: images.map((u) => product?.imageCredits?.[product.images?.indexOf(u)] || null),
            stock: values.stock,
            sku: values.sku,
            specs: values.specs.filter((s) => s.label && s.value),
            colors: toList(values.colors),
            sizes: toList(values.sizes),
            featured: values.featured,
            isNew: values.isNew,
            status: values.status,
        };
        setSaving(true);
        try {
            if (editing) await api.patch(`/admin/products/${product._id}`, body);
            else await api.post("/admin/products", body);
            toast.success(editing ? "Product updated" : "Product created");
            onSaved();
        } catch (error) {
            setError("root", { message: errorMessage(error) });
            toast.error(errorMessage(error));
        } finally {
            setSaving(false);
        }
    }

    return (
        <Modal
            open
            onClose={saving ? undefined : onClose}
            title={editing ? "Edit product" : "Add product"}
            size="lg"
            footer={
                <>
                    <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
                    <Button type="submit" form="product-form" loading={saving}>{editing ? "Save changes" : "Create product"}</Button>
                </>
            }
        >
            <form id="product-form" onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 sm:grid-cols-2">
                {errors.root && (
                    <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm font-medium text-danger sm:col-span-2">{errors.root.message}</p>
                )}

                <Input label="Title" required wrapperClassName="sm:col-span-2" error={errors.title?.message} {...register("title")} />
                <Textarea label="Description" required rows={4} wrapperClassName="sm:col-span-2" error={errors.description?.message} {...register("description")} />

                <Input
                    label="Price (USD)" required type="number" step="0.01" min="0" inputMode="decimal"
                    error={errors.price?.message}
                    {...register("price", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
                />
                <Input
                    label="Compare-at price (optional)" type="number" step="0.01" min="0" inputMode="decimal"
                    hint={discount ? `Shown as ${discount}% off` : "Set above the price to show a discount"}
                    error={errors.compareAtPrice?.message}
                    {...register("compareAtPrice", { setValueAs: optionalNumber })}
                />

                <Select label="Category" required error={errors.category?.message} {...register("category")}>
                    <option value="">Select a category</option>
                    {categories.map((c) => <option key={c._id} value={c.slug}>{c.name}</option>)}
                </Select>
                <Input label="Brand" error={errors.brand?.message} {...register("brand")} />

                <Input
                    label="Stock" required type="number" min="0" step="1" inputMode="numeric"
                    error={errors.stock?.message}
                    {...register("stock", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
                />
                <Input label="SKU" error={errors.sku?.message} {...register("sku")} />

                <div className="sm:col-span-2">
                    <div className="flex items-start gap-4">
                        <Input label="Main image URL" required wrapperClassName="flex-1" placeholder="https://images.unsplash.com/…" error={errors.image?.message} {...register("image")} />
                        <LazyImage src={mainImage} alt="Main image preview" className="mt-7 h-16 w-16 shrink-0 rounded-lg border border-line object-cover" />
                    </div>
                </div>

                <fieldset className="sm:col-span-2">
                    <legend className="mb-2 text-sm font-medium">Extra gallery images</legend>
                    <div className="space-y-2">
                        {extra.fields.map((f, i) => (
                            <div key={f.id} className="flex items-center gap-2">
                                <input
                                    aria-label={`Gallery image ${i + 1} URL`}
                                    placeholder="https://images.unsplash.com/…"
                                    className="h-11 min-w-0 flex-1 rounded-lg border border-line bg-surface px-3.5 text-sm focus:border-primary focus:outline-none"
                                    {...register(`extraImages.${i}.url`)}
                                />
                                <Button variant="ghost" size="icon" aria-label={`Remove gallery image ${i + 1}`} onClick={() => extra.remove(i)}><Trash2 size={18} /></Button>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" className="mt-2" disabled={extra.fields.length >= 9} onClick={() => extra.append({ url: "" })}>
                        <Plus size={16} aria-hidden="true" /> Add image
                    </Button>
                </fieldset>

                <fieldset className="sm:col-span-2">
                    <legend className="mb-2 text-sm font-medium">Specifications</legend>
                    <div className="space-y-2">
                        {specs.fields.map((f, i) => (
                            <div key={f.id} className="flex items-center gap-2">
                                <input aria-label={`Specification ${i + 1} name`} placeholder="Name (e.g. Battery)" className="h-11 w-2/5 min-w-0 rounded-lg border border-line bg-surface px-3.5 text-sm focus:border-primary focus:outline-none" {...register(`specs.${i}.label`)} />
                                <input aria-label={`Specification ${i + 1} value`} placeholder="Value (e.g. 40 hours)" className="h-11 min-w-0 flex-1 rounded-lg border border-line bg-surface px-3.5 text-sm focus:border-primary focus:outline-none" {...register(`specs.${i}.value`)} />
                                <Button variant="ghost" size="icon" aria-label={`Remove specification ${i + 1}`} onClick={() => specs.remove(i)}><Trash2 size={18} /></Button>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" className="mt-2" disabled={specs.fields.length >= 20} onClick={() => specs.append({ label: "", value: "" })}>
                        <Plus size={16} aria-hidden="true" /> Add specification
                    </Button>
                </fieldset>

                <Input label="Colours" hint="Comma separated, e.g. Black, Olive" error={errors.colors?.message} {...register("colors")} />
                <Input label="Sizes" hint="Comma separated, e.g. S, M, L" error={errors.sizes?.message} {...register("sizes")} />

                <Select label="Status" error={errors.status?.message} {...register("status")}>
                    <option value="active">Active (visible in the shop)</option>
                    <option value="draft">Draft (hidden)</option>
                    <option value="archived">Archived (hidden, kept for old orders)</option>
                </Select>
                <div className="flex flex-wrap items-end gap-x-6 gap-y-2 pb-2">
                    <Checkbox label="Featured on home page" {...register("featured")} />
                    <Checkbox label="Mark as new" {...register("isNew")} />
                </div>
            </form>
        </Modal>
    );
}
