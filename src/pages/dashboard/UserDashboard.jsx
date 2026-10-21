import { useState, useEffect } from "react";
import { Package, Heart, ShoppingBag, UserRound, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { authClient } from "../../lib/auth-client"; // তোমার প্রজেক্টের সঠিক পাথ অনুযায়ী যাচাই করো

export default function UserDashboard() {
    const { data: session, isPending: sessionPending } = authClient.useSession();

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    const SERVER_URL = import.meta.env.VITE_API_URL;

    // ব্যাকএন্ড থেকে ইউজারের অর্ডার ফেচ করার জন্য
    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                setLoadingOrders(true);
                const res = await fetch(`${SERVER_URL}/api/orders`, {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    const orderList = Array.isArray(data) ? data : data.orders || [];
                    setOrders(orderList);
                }
            } catch (err) {
                console.error("Failed to fetch orders:", err);
            } finally {
                setLoadingOrders(false);
            }
        };

        fetchUserOrders();
    }, [SERVER_URL]);

    const cards = [
        {
            title: "Total Orders",
            value: orders.length > 0 ? String(orders.length).padStart(2, "0") : "00",
            icon: Package,
            color: "bg-blue-50 text-blue-600 border border-blue-100",
        },
        {
            title: "Wishlist Items",
            value: "08", // ডাইনামিক উইশলিস্ট কাউন্ট এখানে বসাতে পারো
            icon: Heart,
            color: "bg-pink-50 text-pink-600 border border-pink-100",
        },
        {
            title: "Cart Items",
            value: "03", // ডাইনামিক কার্ট কাউন্ট এখানে বসাতে পারো
            icon: ShoppingBag,
            color: "bg-emerald-50 text-[#10B981] border border-emerald-100",
        },
    ];

    // Status Badge Styling Function
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

    return (
        <div className="space-y-8 text-gray-800">
            {/* Header Section */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">My Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage your account, track orders, and view wishlist items.
                </p>
            </div>

            {/* Welcome Banner */}
            <section className="rounded-2xl bg-[#10B981] p-6 text-white shadow-md sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 border border-white/30 overflow-hidden shadow-inner">
                        {session?.user?.image ? (
                            <img
                                src={session.user.image}
                                alt="Profile"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <UserRound size={32} className="text-white" />
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-emerald-100">Welcome back,</p>
                        <h2 className="text-2xl font-bold sm:text-3xl">
                            {sessionPending ? "Loading..." : session?.user?.name || "ShopSphere Customer"}
                        </h2>
                        <p className="mt-1 text-sm text-emerald-100">
                            {session?.user?.email || "Thank you for shopping with us!"}
                        </p>
                    </div>
                </div>
            </section>

            {/* Metric Cards */}
            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {cards.map(({ title, value, icon: Icon, color }) => (
                    <div
                        key={title}
                        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">{title}</span>
                            <span className={`rounded-xl p-3 ${color}`}>
                                <Icon size={22} />
                            </span>
                        </div>
                        <p className="mt-4 text-3xl font-extrabold text-gray-900">{value}</p>
                    </div>
                ))}
            </section>

            {/* Recent Orders Section */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-200 p-5 sm:p-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                        <p className="mt-0.5 text-xs text-gray-500">Your latest purchases and status</p>
                    </div>
                    <Link
                        to="/user/orders"
                        className="flex items-center gap-1.5 text-sm font-semibold text-[#10B981] transition hover:text-[#0d9668]"
                    >
                        View all <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    {loadingOrders ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="animate-spin text-[#10B981]" size={32} />
                            <p className="mt-2 text-xs text-gray-500">Loading your orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="py-12 text-center text-sm text-gray-500">
                            No recent orders found.
                        </div>
                    ) : (
                        <table className="w-full min-w-[550px] text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.slice(0, 5).map((order) => {
                                    const id = order._id || order.id;
                                    const shortId = String(id).slice(-8).toUpperCase();
                                    const total = Number(order.total || order.totalPrice || order.amount || 0);

                                    return (
                                        <tr key={id} className="transition hover:bg-gray-50/80">
                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                #{shortId}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-500">
                                                {order.createdAt
                                                    ? new Date(order.createdAt).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })
                                                    : order.date || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-[#10B981]">
                                                ${total.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusBadgeClass(
                                                        order.status || "Pending"
                                                    )}`}
                                                >
                                                    {order.status || "Pending"}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
        </div>
    );
}