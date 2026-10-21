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
        "w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#10B981] focus:bg-white focus:outline-none transition";

    return (
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
                Add New Product
            </h2>

            <form
                onSubmit={handleAddProduct}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
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
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
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
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
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
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
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
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
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

                <div className="mt-2 flex justify-end gap-2.5 md:col-span-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="cursor-pointer rounded-xl bg-[#10B981] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#0d9668]"
                    >
                        Save Product
                    </button>
                </div>
            </form>
        </div>
    );
}