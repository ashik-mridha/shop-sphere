import { Trash2, Minus, Plus } from "lucide-react";

const CartItem = ({ item, onUpdate, onRemove }) => {
    return (
        <div className="flex gap-4 rounded-xl border border-gray-600 p-4">
            <img
                src={item.image}
                alt={item.title || "Product image"}
                className="h-48 w-full object-contain"
                onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/no-image.png";
                }}
            />

            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="mt-1 font-bold">${item.price}</p>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 rounded-lg border px-2 py-1">
                        <button
                            onClick={() => onUpdate(item, -1)}
                            aria-label="Decrease quantity"
                        >
                            <Minus size={16} />
                        </button>

                        <span>{item.quantity}</span>

                        <button
                            onClick={() => onUpdate(item, 1)}
                            aria-label="Increase quantity"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    <button
                        onClick={() => onRemove(item)}
                        className="text-red-500"
                        aria-label="Remove item"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;