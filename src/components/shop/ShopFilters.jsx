import { useState } from "react";
import Button from "../ui/Button";
import { Input, Select, Checkbox } from "../ui/Input";

/** Filter form. `values` come from the URL; `onApply(patch)` writes back to the URL. */
function FiltersForm({ values, categories, brands, bounds, onApply, onClear }) {
    const [min, setMin] = useState(values.minPrice || "");
    const [max, setMax] = useState(values.maxPrice || "");

    function applyPrice(e) {
        e.preventDefault();
        onApply({ minPrice: min, maxPrice: max });
    }

    return (
        <div className="space-y-5">
            <Select label="Category" value={values.category || ""} onChange={(e) => onApply({ category: e.target.value })}>
                <option value="">All categories</option>
                {categories.map((c) => <option key={c._id} value={c.slug}>{c.name} ({c.productCount})</option>)}
            </Select>

            <Select label="Brand" value={values.brand || ""} onChange={(e) => onApply({ brand: e.target.value })}>
                <option value="">All brands</option>
                {brands.map((b) => <option key={b} value={b}>{b}</option>)}
            </Select>

            <form onSubmit={applyPrice}>
                <fieldset>
                    <legend className="mb-1.5 text-sm font-medium">
                        Price {bounds.maxPrice ? <span className="font-normal text-muted">(${bounds.minPrice} – ${bounds.maxPrice})</span> : null}
                    </legend>
                    <div className="flex items-end gap-2">
                        <Input label="Min" type="number" inputMode="decimal" min="0" value={min} onChange={(e) => setMin(e.target.value)} placeholder="0" wrapperClassName="flex-1" />
                        <Input label="Max" type="number" inputMode="decimal" min="0" value={max} onChange={(e) => setMax(e.target.value)} placeholder="Any" wrapperClassName="flex-1" />
                    </div>
                    <Button type="submit" variant="outline" size="sm" className="mt-2 w-full">Apply price</Button>
                </fieldset>
            </form>

            <Select label="Customer rating" value={values.rating || ""} onChange={(e) => onApply({ rating: e.target.value })}>
                <option value="">Any rating</option>
                <option value="4">4 stars & up</option>
                <option value="3">3 stars & up</option>
                <option value="2">2 stars & up</option>
            </Select>

            <div className="space-y-3">
                <Checkbox label="In stock only" checked={values.inStock === "true"} onChange={(e) => onApply({ inStock: e.target.checked ? "true" : "" })} />
                <Checkbox label="On sale" checked={values.onSale === "true"} onChange={(e) => onApply({ onSale: e.target.checked ? "true" : "" })} />
            </div>

            <Button variant="ghost" size="sm" className="w-full" onClick={onClear}>Clear all filters</Button>
        </div>
    );
}

export default function ShopFilters(props) {
    // remount the price inputs whenever the URL values change (e.g. "clear all")
    return <FiltersForm key={`${props.values.minPrice}|${props.values.maxPrice}`} {...props} />;
}
