import ProductCard from "./ProductCard";

/** 2 columns on phones, 3 on tablets, 4 per row on desktop. */
export default function ProductGrid({ products }) {
    return (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
    );
}
