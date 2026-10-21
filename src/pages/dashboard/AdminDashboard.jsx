import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    Users,
    Package,
    ShoppingCart,
    DollarSign,
    TrendingUp,
    Clock,
    Loader2,
    ArrowRight
} from "lucide-react";

const SERVER_URL = import.meta.env.VITE_API_URL

export default function AdminDashboard() {
    const [productsCount, setProductsCount] = useState(0);
    const [usersCount, setUsersCount] = useState(0);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchDashboardData() {
            try {
                setLoading(true);

                // ১. Total Products count fetch
                const resProducts = await fetch(`${SERVER_URL}/api/products`, {
                    signal: controller.signal,
                    credentials: "include",
                }).catch(() => null);

                if (resProducts && resProducts.ok) {
                    const productsData = await resProducts.json();
                    const productList = Array.isArray(productsData) ? productsData : productsData.products || [];
                    setProductsCount(productList.length);
                }

                // ২. Total Orders fetch
                const resOrders = await fetch(`${SERVER_URL}/api/orders`, {
                    signal: controller.signal,
                    credentials: "include",
                }).catch(() => null);

                let orderList = [];
                if (resOrders && resOrders.ok) {
                    const ordersData = await resOrders.json();
                    orderList = Array.isArray(ordersData) ? ordersData : ordersData.orders || [];
                    setOrders(orderList);
                }

                // ৩. Total Users fetch
                const resUsers = await fetch(`${SERVER_URL}/api/users`, {
                    signal: controller.signal,
                    credentials: "include",
                }).catch(() => null);

                if (resUsers && resUsers.ok) {
                    const usersData = await resUsers.json();
                    const userList = Array.isArray(usersData) ? usersData : usersData.users || [];
                    setUsersCount(userList.length);
                } else {
                    const uniqueCustomers = new Set(
                        orderList.map((o) => o.customer?.phone || o.customer?.name || o.userEmail).filter(Boolean)
                    );
                    setUsersCount(uniqueCustomers.size);
                }
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Dashboard data fetch error:", err);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchDashboardData();

        return () => controller.abort();
    }, []);

    // ডাইনামিক টোটাল রেভিনিউ হিসাব
    const totalRevenue = useMemo(() => {
        return orders.reduce((sum, o) => {
            const val = Number(o.total || o.totalPrice || o.amount || 0);
            return sum + (Number.isFinite(val) ? val : 0);
        }, 0);
    }, [orders]);

    // Sales Overview bar height calculation
    const weeklySales = useMemo(() => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const today = new Date();

        const dayLabels = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            dayLabels.push({
                dayName: days[d.getDay()],
                dateStr: d.toDateString(),
                totalSales: 0,
            });
        }

        orders.forEach((order) => {
            if (order.createdAt) {
                const orderDate = new Date(order.createdAt).toDateString();
                const matchedDay = dayLabels.find((dl) => dl.dateStr === orderDate);
                if (matchedDay) {
                    const val = Number(order.total || order.totalPrice || order.amount || 0);
                    matchedDay.totalSales += Number.isFinite(val) ? val : 0;
                }
            }
        });

        const maxSales = Math.max(...dayLabels.map((d) => d.totalSales), 1);

        return dayLabels.map((d) => ({
            day: d.dayName,
            sales: d.totalSales,
            height: d.totalSales > 0 ? Math.max(Math.round((d.totalSales / maxSales) * 100), 15) : 10,
        }));
    }, [orders]);

    // Dynamic Stats Cards Array
    const stats = [
        {
            title: "Total Revenue",
            value: `$${totalRevenue.toFixed(2)}`,
            change: "+12.5%",
            icon: DollarSign,
            color: "bg-emerald-100 text-emerald-700",
        },
        {
            title: "Total Orders",
            value: orders.length,
            change: "+8.2%",
            icon: ShoppingCart,
            color: "bg-blue-100 text-blue-700",
        },
        {
            title: "Total Products",
            value: productsCount,
            change: "+4.3%",
            icon: Package,
            color: "bg-purple-100 text-purple-700",
        },
        {
            title: "Total Users",
            value: usersCount,
            change: "+15.8%",
            icon: Users,
            color: "bg-orange-100 text-orange-700",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold sm:text-3xl">Dashboard Overview</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Monitor your store performance and recent activity in real-time.
                </p>
            </div>

            {/* Stats Cards Section */}
            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map(({ title, value, change, icon: Icon, color }) => (
                    <div
                        key={title}
                        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">{title}</span>
                            <span className={`rounded-xl p-3 ${color}`}>
                                <Icon size={22} />
                            </span>
                        </div>

                        <h2 className="mt-5 text-2xl font-bold">
                            {loading ? <Loader2 className="animate-spin text-gray-400" size={24} /> : value}
                        </h2>
                        <p className="mt-2 flex items-center gap-1 text-xs text-emerald-700">
                            <TrendingUp size={14} />
                            {change} <span className="text-gray-500">from last month</span>
                        </p>
                    </div>
                ))}
            </section>

            {/* Sales Graph & Activity Section */}
            <section className="grid gap-6 xl:grid-cols-3">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 xl:col-span-2">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold">Sales Overview</h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Weekly store performance data
                            </p>
                        </div>
                        <TrendingUp className="text-emerald-700" />
                    </div>

                    <div className="flex h-56 items-end justify-around gap-3 border-b border-gray-100 pb-2">
                        {weeklySales.map((item, index) => (
                            <div
                                key={index}
                                className="group relative flex h-full flex-1 items-end"
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 transition group-hover:opacity-100 pointer-events-none rounded bg-gray-800 px-2 py-1 text-[10px] text-white whitespace-nowrap">
                                    ${item.sales.toFixed(2)}
                                </div>
                                <div
                                    className="w-full rounded-t-lg bg-emerald-700 transition-all duration-500 hover:bg-emerald-500"
                                    style={{ height: `${item.height}%` }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 flex justify-around text-xs text-gray-500">
                        {weeklySales.map((item, idx) => (
                            <span key={idx}>{item.day}</span>
                        ))}
                    </div>
                </div>

                {/* System Activity Card */}
                <div className="rounded-2xl bg-emerald-900 p-6 text-white">
                    <Clock className="mb-5" size={28} />
                    <h2 className="text-xl font-bold">Store Activity</h2>
                    <p className="mt-2 text-sm text-emerald-100">
                        Your admin dashboard is connected with MongoDB backend.
                    </p>
                    <div className="mt-6 rounded-xl bg-white/10 p-4">
                        <p className="text-sm text-emerald-100">System Status</p>
                        <p className="mt-1 font-semibold text-emerald-300">● Live & Synchronized</p>
                    </div>
                </div>
            </section>

            {/* Recent Orders Section */}
            <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
                <div className="flex items-center justify-between border-b p-5 sm:p-6">
                    <div>
                        <h2 className="text-lg font-bold">Recent Orders</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Latest customer orders placed on store
                        </p>
                    </div>

                    {/* 🔥 View All Orders Button */}
                    <Link
                        to="/admin/orders"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 hover:text-emerald-800"
                    >
                        View All
                        <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="animate-spin text-emerald-700" size={32} />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="py-12 text-center text-sm text-gray-500">
                            No recent orders in database.
                        </div>
                    ) : (
                        <table className="w-full min-w-[600px] text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.slice(0, 5).map((order) => {
                                    const id = order._id || order.id;
                                    const shortId = id ? String(id).slice(-6).toUpperCase() : "N/A";
                                    const customerName = order.customer?.name || order.userEmail || "Customer";
                                    const orderAmount = Number(order.total || order.totalPrice || order.amount || 0);

                                    return (
                                        <tr key={id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4 font-medium">
                                                #{shortId}
                                            </td>
                                            <td className="px-6 py-4">{customerName}</td>
                                            <td className="px-6 py-4">${orderAmount.toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 capitalize">
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