
import { Trash2, Edit2, Check, X } from "lucide-react";

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
        <div className="overflow-hidden rounded-xl border border-[#22332a] bg-[#121614] shadow-lg">
            <div className="border-b border-[#22332a] p-4 text-lg font-semibold text-white">
                Manage Products ({products.length})
            </div>

            {loading ? (
                <div className="p-8 text-center text-gray-400">
                    Loading products...
                </div>
            ) : products.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                    No products found. Add some!
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="border-b border-[#22332a] bg-[#0d1411] text-xs uppercase text-gray-400">
                            <tr>
                                <th className="p-4">Image</th>
                                <th className="p-4">Title</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#22332a]">
                            {products.map((item) => (
                                <tr
                                    key={item._id}
                                    className="transition hover:bg-[#182620]/50"
                                >
                                    <td className="p-4">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.title || "Product image"}
                                                className="h-48 w-full object-contain"
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = "/no-image.png";
                                                }}
                                            />

                                        ) : (
                                            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#0d1411] text-xs text-gray-500">
                                                No Img
                                            </div>
                                        )}
                                    </td>

                                    <td className="p-4 font-medium text-white">
                                        {item.title}
                                    </td>

                                    <td className="p-4 text-gray-400">
                                        {item.category || "N/A"}
                                    </td>

                                    <td className="p-4 font-semibold text-[#10B981]">
                                        {editingId === item._id ? (
                                            <div className="flex items-center gap-1">
                                                $
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={editedPrice}
                                                    onChange={(e) => setEditedPrice(e.target.value)}
                                                    className="w-24 rounded border border-[#10B981] bg-[#0d1411] px-2 py-1 text-white"
                                                />
                                            </div>
                                        ) : (
                                            `$${item.price}`
                                        )}
                                    </td>

                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {editingId === item._id ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdatePrice(item._id)}
                                                        className="rounded bg-[#10B981] p-1.5 text-white hover:bg-[#0d9668]"
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
                                                        className="rounded bg-gray-700 p-1.5 text-white hover:bg-gray-600"
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
                                                    className="rounded p-1.5 text-blue-400 hover:bg-[#1a2922]"
                                                    title="Edit Price"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => handleDeleteProduct(item._id)}
                                                className="rounded p-1.5 text-red-400 hover:bg-[#1a2922]"
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
