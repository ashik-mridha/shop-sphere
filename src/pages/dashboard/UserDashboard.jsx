import { useState, useEffect } from "react";
import { Package, Heart, ShoppingBag, UserRound, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { authClient } from "../../lib/auth-client"; // আপনার প্রজেক্টের সঠিক পাথ অনুযায়ী দিন

export default function UserDashboard() {
    const { data: session, isPending: sessionPending } = authClient.useSession();

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    const SERVER_URL = "http://localhost:5000";

    // ব্যাকএন্ড থেকে ইউজারের অর্ডার বা ডাইনামিক ডাটা ফেচ করার জন্য
    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                setLoadingOrders(true);
                const res = await fetch(`${SERVER_URL}/api/orders`);
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (err) {
                console.error("Failed to fetch orders:", err);
            } finally {
                setLoadingOrders(false);
            }
        };

        fetchUserOrders();
    }, []);

    
    const cards = [
        {
            title: "Total Orders",
            value: orders.length > 0 ? String(orders.length).padStart(2, "0") : "00",
            icon: Package,
            color: "bg-blue-100 text-blue-700",
        },
        {
            title: "Wishlist Items",
            value: "08", // ডাইনামিক উইশলিস্ট কাউন্ট এখানে বসাতে পারেন
            icon: Heart,
            color: "bg-pink-100 text-pink-700",
        },
        {
            title: "Cart Items",
            value: "03", // ডাইনামিক কার্ট কাউন্ট এখানে বসাতে পারেন
            icon: ShoppingBag,
            color: "bg-emerald-100 text-emerald-700",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold sm:text-3xl">My Dashboard</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Manage your account, orders and wishlist.
                </p>
            </div>

            {/* Welcome Banner with Dynamic User Info */}
            <section className="rounded-2xl bg-emerald-900 p-6 text-white sm:p-8">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 overflow-hidden">
                        {session?.user?.image ? (
                            <img
                                src={session.user.image}
                                alt="Profile"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <UserRound size={32} />
                        )}
                    </div>
                    <div>
                        <p className="text-sm text-emerald-100">Welcome back,</p>
                        <h2 className="text-2xl font-bold">
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
                        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">{title}</span>
                            <span className={`rounded-xl p-3 ${color}`}>
                                <Icon size={22} />
                            </span>
                        </div>
                        <p className="mt-5 text-3xl font-bold">{value}</p>
                    </div>
                ))}
            </section>

            {/* Recent Orders Section */}
            <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
                <div className="flex items-center justify-between border-b p-5 sm:p-6">
                    <div>
                        <h2 className="text-lg font-bold">Recent Orders</h2>
                        <p className="mt-1 text-sm text-gray-500">Your latest purchases</p>
                    </div>
                    <Link
                        to="/user/orders"
                        className="flex items-center gap-2 text-sm font-medium text-emerald-800 hover:underline"
                    >
                        View all <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    {loadingOrders ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="animate-spin text-emerald-600" size={28} />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="py-12 text-center text-sm text-gray-500">
                            No recent orders found.
                        </div>
                    ) : (
                        <table className="w-full min-w-[520px] text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order._id || order.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 font-medium">
                                            #{order._id ? order._id.slice(-6).toUpperCase() : order.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.date ? order.date : new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">${order.amount || order.totalPrice}</td>
                                        <td className="px-6 py-4">
                                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700 font-medium">
                                                {order.status || "Processing"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
        </div>
    );
}