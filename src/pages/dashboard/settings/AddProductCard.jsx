
export default function AddProductCard({
    newProduct,
    setNewProduct,
    handleAddProduct,
    onClose,
}) {
    const updateField = (field, value) => {
        setNewProduct((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const inputClass =
        "w-full rounded-lg border border-[#22332a] bg-[#0d1411] px-3 py-2 text-sm text-white focus:border-[#10B981] focus:outline-none";

    return (
        <div className="mb-8 rounded-xl border border-[#22332a] bg-[#121614] p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-[#10B981]">
                Add New Product
            </h2>

            <form
                onSubmit={handleAddProduct}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
                <div>
                    <label className="mb-1 block text-sm text-gray-400">
                        Product Title
                    </label>
                    <input
                        type="text"
                        required
                        value={newProduct.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        className={inputClass}
                        placeholder="Wireless Headphones"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm text-gray-400">
                        Price ($)
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={newProduct.price}
                        onChange={(e) => updateField("price", e.target.value)}
                        className={inputClass}
                        placeholder="99.99"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm text-gray-400">
                        Category
                    </label>
                    <input
                        type="text"
                        required
                        value={newProduct.category}
                        onChange={(e) => updateField("category", e.target.value)}
                        className={inputClass}
                        placeholder="Electronics"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm text-gray-400">
                        Image URL
                    </label>
                    <input
                        type="url"
                        value={newProduct.image}
                        onChange={(e) => updateField("image", e.target.value)}
                        className={inputClass}
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="mb-1 block text-sm text-gray-400">
                        Description
                    </label>
                    <textarea
                        rows={3}
                        value={newProduct.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        className={inputClass}
                        placeholder="Product details..."
                    />
                </div>

                <div className="mt-2 flex justify-end gap-2 md:col-span-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg bg-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-600"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="rounded-lg bg-[#10B981] px-4 py-2 text-sm font-medium text-white hover:bg-[#0d9668]"
                    >
                        Save Product
                    </button>
                </div>
            </form>
        </div>
    );
}
