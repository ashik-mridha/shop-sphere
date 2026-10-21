import { Trash2, Edit2, Check, X, Package } from "lucide-react";

export default function ManageProductsTable({
    products,
    loading,
    editingId,
    setEditingId,
    editedPrice,
    setEditedPrice,
    handleUpdatePrice,
    handleDeleteProduct,
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4 text-base font-bold text-gray-900">
                Manage Products ({products.length})
            </div>

            {loading ? (
                <div className="p-12 text-center text-gray-500">
                    Loading products...
                </div>
            ) : products.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                    No products found. Add some!
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {products.map((item) => (
                                <tr
                                    key={item._id}
                                    className="transition hover:bg-gray-50/80"
                                >
                                    <td className="px-6 py-4">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.title || "Product image"}
                                                className="h-12 w-12 rounded-xl object-cover border border-gray-200"
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = "/no-image.png";
                                                }}
                                            />
                                        ) : (
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-[#10B981]">
                                                <Package size={20} />
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 font-semibold text-gray-900">
                                        {item.title}
                                    </td>

                                    <td className="px-6 py-4 text-gray-500">
                                        {item.category || "N/A"}
                                    </td>

                                    <td className="px-6 py-4 font-bold text-[#10B981]">
                                        {editingId === item._id ? (
                                            <div className="flex items-center gap-1">
                                                $
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={editedPrice}
                                                    onChange={(e) => setEditedPrice(e.target.value)}
                                                    className="w-24 rounded-xl border border-gray-300 bg-white px-2.5 py-1 text-sm text-gray-900 focus:border-[#10B981] focus:outline-none"
                                                />
                                            </div>
                                        ) : (
                                            `$${Number(item.price || 0).toFixed(2)}`
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {editingId === item._id ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdatePrice(item._id)}
                                                        className="cursor-pointer rounded-xl bg-[#10B981] p-2 text-white shadow-sm transition hover:bg-[#0d9668]"
                                                        title="Save Price"
                                                    >
                                                        <Check size={16} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingId(null);
                                                            setEditedPrice("");
                                                        }}
                                                        className="cursor-pointer rounded-xl border border-gray-200 bg-white p-2 text-gray-600 transition hover:bg-gray-100"
                                                        title="Cancel"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingId(item._id);
                                                        setEditedPrice(String(item.price ?? ""));
                                                    }}
                                                    className="cursor-pointer rounded-xl border border-blue-200 bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                                                    title="Edit Price"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => handleDeleteProduct(item._id)}
                                                className="cursor-pointer rounded-xl border border-red-200 bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                                                title="Delete Product"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}