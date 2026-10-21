import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Package,
    Search,
    Loader2,
    RefreshCw,
    ExternalLink,
    ShoppingBag
} from "lucide-react";
import toast from "react-hot-toast";

const SERVER_URL = "http://localhost:5000";

export default function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");

    // Fetch user orders
    const fetchMyOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${SERVER_URL}/api/orders`, {
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to fetch orders.");
            const data = await res.json();
            const orderList = Array.isArray(data) ? data : data.orders || [];
            setOrders(orderList);
        } catch (err) {
            console.error("Fetch my orders error:", err);
            toast.error("Could not load your orders.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyOrders();
    }, []);

    // Status Badge Class
    const getStatusBadgeClass = (status) => {
        switch (String(status).toLowerCase()) {
            case "delivered":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "shipped":
                return "bg-blue-50 text-blue-700 border-blue-200";
            case "processing":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "cancelled":
                return "bg-red-50 text-red-700 border-red-200";
            default:
                return "bg-purple-50 text-purple-700 border-purple-200";
        }
    };

    // Filter orders
    const filteredOrders = orders.filter((order) => {
        const orderIdStr = String(order._id || order.id || "").toLowerCase();
        const productTitle = String(order.productTitle || "").toLowerCase();
        const query = searchQuery.trim().toLowerCase();

        const matchesSearch =
            orderIdStr.includes(query) || productTitle.includes(query);

        const matchesStatus =
            selectedStatus === "all" ||
            String(order.status || "Pending").toLowerCase() === selectedStatus.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold sm:text-3xl text-gray-900">My Orders</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        View your order history and track active deliveries.
                    </p>
                </div>

                <button
                    onClick={fetchMyOrders}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 shadow-sm"
                >
                    <RefreshCw size={16} className={loading ? "animate-spin text-emerald-600" : ""} />
                    Refresh
                </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                {/* Search Input */}
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by Order ID or Product..."
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-600 focus:bg-white focus:outline-none"
                    />
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`cursor-pointer whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition ${selectedStatus === status
                                    ? "bg-emerald-700 text-white shadow-sm"
                                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table / Cards */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-emerald-700" size={36} />
                        <p className="mt-3 text-sm text-gray-500">Loading your orders...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="py-20 text-center">
                        <Package className="mx-auto text-gray-400" size={48} />
                        <p className="mt-3 text-base font-medium text-gray-800">No orders found</p>
                        <p className="mt-1 text-xs text-gray-500">
                            You haven't placed any orders yet or no match found.
                        </p>
                        <Link
                            to="/shop"
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                        >
                            <ShoppingBag size={18} />
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px] text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map((order) => {
                                    const id = order._id || order.id;
                                    const shortId = String(id).slice(-8).toUpperCase();
                                    const total = Number(order.total || order.totalPrice || order.amount || 0);

                                    return (
                                        <tr key={id} className="transition hover:bg-gray-50/60">
                                            {/* Order ID */}
                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                #{shortId}
                                            </td>

                                            {/* Product Info */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {order.productImage ? (
                                                        <img
                                                            src={order.productImage}
                                                            alt={order.productTitle || "Product"}
                                                            className="h-10 w-10 rounded-lg object-cover border border-gray-100"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 font-bold">
                                                            <Package size={20} />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="line-clamp-1 max-w-[200px] font-medium text-gray-900">
                                                            {order.productTitle || "Shop Product"}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Qty: {order.quantity || 1}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="px-6 py-4 text-xs text-gray-500">
                                                {order.createdAt
                                                    ? new Date(order.createdAt).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })
                                                    : "N/A"}
                                            </td>

                                            {/* Total */}
                                            <td className="px-6 py-4 font-bold text-emerald-700">
                                                ${total.toFixed(2)}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusBadgeClass(
                                                        order.status || "Pending"
                                                    )}`}
                                                >
                                                    {order.status || "Pending"}
                                                </span>
                                            </td>

                                            {/* Track Order Action Button */}
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    to={`/track-order/${id}`}
                                                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                                                >
                                                    Track Order
                                                    <ExternalLink size={14} />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}