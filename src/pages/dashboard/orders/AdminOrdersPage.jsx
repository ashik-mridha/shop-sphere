import { useState, useEffect } from "react";
import {
    Package,
    Search,
    Loader2,
    RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";

const SERVER_URL = "http://localhost:5000";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");

    // Fetch all orders for admin
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${SERVER_URL}/api/orders`, {
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to load orders.");
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : data.orders || []);
        } catch (err) {
            console.error("Fetch orders error:", err);
            toast.error("Could not load orders list.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Update order status handler
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            setUpdatingId(orderId);
            const res = await fetch(`${SERVER_URL}/api/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error("Failed to update status");

            toast.success(`Order status updated to ${newStatus}`);

            // Local state update
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    (order._id || order.id) === orderId
                        ? { ...order, status: newStatus }
                        : order
                )
            );
        } catch (err) {
            console.error("Update status error:", err);
            toast.error("Failed to update order status.");
        } finally {
            setUpdatingId(null);
        }
    };

    // Filter orders based on Search & Status Filter
    const filteredOrders = orders.filter((order) => {
        const orderIdStr = String(order._id || order.id || "").toLowerCase();
        const customerName = String(order.customer?.name || "").toLowerCase();
        const customerPhone = String(order.customer?.phone || "").toLowerCase();
        const query = searchQuery.trim().toLowerCase();

        const matchesSearch =
            orderIdStr.includes(query) ||
            customerName.includes(query) ||
            customerPhone.includes(query);

        const matchesStatus =
            selectedStatus === "all" ||
            String(order.status || "Pending").toLowerCase() === selectedStatus.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    const getStatusBadgeClass = (status) => {
        switch (String(status).toLowerCase()) {
            case "delivered":
                return "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30";
            case "shipped":
                return "bg-blue-500/15 text-blue-400 border-blue-500/30";
            case "processing":
                return "bg-amber-500/15 text-amber-400 border-amber-500/30";
            case "cancelled":
                return "bg-red-500/15 text-red-400 border-red-500/30";
            default:
                return "bg-purple-500/15 text-purple-400 border-purple-500/30";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white sm:text-3xl">Manage Orders</h1>
                    <p className="mt-1 text-sm text-gray-400">
                        View, track, and update customer order statuses.
                    </p>
                </div>

                <button
                    onClick={fetchOrders}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#22332a] bg-[#121816] px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-[#1a2420] hover:text-white"
                >
                    <RefreshCw size={16} className={loading ? "animate-spin text-[#10B981]" : ""} />
                    Refresh
                </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col gap-4 rounded-2xl border border-[#22332a] bg-[#121816] p-4 sm:flex-row sm:items-center sm:justify-between shadow-xl">
                {/* Search Input */}
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by ID, name or phone..."
                        className="w-full rounded-xl border border-[#22332a] bg-[#0d1411] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#10B981] focus:outline-none"
                    />
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`cursor-pointer whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold capitalize transition ${selectedStatus === status
                                    ? "bg-[#10B981] text-white shadow-md shadow-[#10B981]/20"
                                    : "border border-[#22332a] bg-[#0d1411] text-gray-400 hover:text-white"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-hidden rounded-2xl border border-[#22332a] bg-[#121816] shadow-xl">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-[#10B981]" size={36} />
                        <p className="mt-3 text-sm text-gray-400">Loading orders list...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="py-20 text-center">
                        <Package className="mx-auto text-gray-600" size={48} />
                        <p className="mt-3 text-base font-medium text-gray-200">No orders found</p>
                        <p className="mt-1 text-xs text-gray-500">
                            Try clearing your search or filter options.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px] text-left text-sm text-gray-300">
                            <thead className="border-b border-[#22332a] bg-[#0d1411] text-xs uppercase tracking-wider text-gray-400">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Product Details</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#22332a]">
                                {filteredOrders.map((order) => {
                                    const id = order._id || order.id;
                                    const shortId = String(id).slice(-8).toUpperCase();
                                    const isUpdating = updatingId === id;

                                    return (
                                        <tr key={id} className="transition hover:bg-[#1a2420]/40">
                                            {/* Order ID & Date */}
                                            <td className="px-6 py-4 font-medium text-white">
                                                #{shortId}
                                                <span className="block text-[11px] font-normal text-gray-500">
                                                    {order.createdAt
                                                        ? new Date(order.createdAt).toLocaleDateString()
                                                        : "N/A"}
                                                </span>
                                            </td>

                                            {/* Customer Info */}
                                            <td className="px-6 py-4">
                                                <span className="block font-semibold text-gray-200">
                                                    {order.customer?.name || "Guest User"}
                                                </span>
                                                <span className="block text-xs text-gray-400">
                                                    {order.customer?.phone || "No phone"}
                                                </span>
                                                <span className="block max-w-[180px] truncate text-[11px] text-gray-500">
                                                    {order.customer?.address || ""}
                                                </span>
                                            </td>

                                            {/* Product Info */}
                                            <td className="px-6 py-4">
                                                <span className="line-clamp-1 max-w-[200px] font-medium text-white">
                                                    {order.productTitle || "Shop Product"}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    Qty: {order.quantity || 1} × ${order.unitPrice || 0}
                                                </span>
                                            </td>

                                            {/* Total Price */}
                                            <td className="px-6 py-4 font-bold text-[#10B981]">
                                                ${Number(order.total || order.totalPrice || 0).toFixed(2)}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusBadgeClass(
                                                        order.status || "Pending"
                                                    )}`}
                                                >
                                                    {order.status || "Pending"}
                                                </span>
                                            </td>

                                            {/* Status Change Dropdown Action */}
                                            <td className="px-6 py-4 text-right">
                                                {isUpdating ? (
                                                    <Loader2 className="ml-auto animate-spin text-[#10B981]" size={18} />
                                                ) : (
                                                    <select
                                                        value={order.status || "Pending"}
                                                        onChange={(e) => handleStatusChange(id, e.target.value)}
                                                        className="cursor-pointer rounded-xl border border-[#22332a] bg-[#0d1411] px-3 py-1.5 text-xs text-white transition focus:border-[#10B981] focus:outline-none"
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Processing">Processing</option>
                                                        <option value="Shipped">Shipped</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                )}
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