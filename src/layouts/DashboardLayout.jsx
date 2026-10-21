import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    Heart,
    UserRound,
    Settings,
    LogOut,
    Store,
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({ role = "user" }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const isAdmin = role === "admin";

    const links = isAdmin
        ? [
            { name: "Overview", path: "/admin/dashboard", icon: LayoutDashboard },
            { name: "Products", path: "/admin/products", icon: Package },
            { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
            { name: "Users", path: "/admin/users", icon: Users },
            { name: "Settings", path: "/admin/settings", icon: Settings },
        ]
        : [
            { name: "Overview", path: "/user/dashboard", icon: LayoutDashboard },
            { name: "My Orders", path: "/user/orders", icon: ShoppingBag },
            { name: "Wishlist", path: "/user/wishlist", icon: Heart },
            { name: "My Profile", path: "/user/profile", icon: UserRound }
        ];

    function handleLogout() {
        navigate("/login");
    }

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            {menuOpen && (
                <button
                    aria-label="Close sidebar"
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col
        bg-white shadow-lg transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
            >
                <div className="flex h-20 items-center justify-between border-b px-6">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-xl font-bold text-emerald-800"
                    >
                        <Store size={26} />
                        ShopSphere
                    </button>

                    <button
                        className="lg:hidden"
                        onClick={() => setMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        <X />
                    </button>
                </div>

                <div className="border-b px-6 py-5">
                    <p className="text-xs uppercase tracking-widest text-gray-500">
                        Dashboard
                    </p>
                    <p className="mt-1 font-semibold">
                        {isAdmin ? "Administrator" : "My Account"}
                    </p>
                    <span
                        className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${isAdmin
                            ? "bg-purple-100 text-purple-700"
                            : "bg-emerald-100 text-emerald-700"
                            }`}
                    >
                        {isAdmin ? "Admin Panel" : "Customer Panel"}
                    </span>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto p-4">
                    {links.map(({ name, path, icon: Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive
                                    ? "bg-emerald-800 text-white shadow"
                                    : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-800"
                                }`
                            }
                        >
                            <Icon size={19} />
                            {name}
                        </NavLink>
                    ))}
                </nav>

                <div className="border-t p-4">
                    <button
                        onClick={() => navigate("/")}
                        className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-gray-100"
                    >
                        <Store size={19} />
                        Visit Store
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                    >
                        <LogOut size={19} />
                        Logout
                    </button>
                </div>
            </aside>

            <div className="min-h-screen lg:pl-64">
                <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b bg-white px-4 sm:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMenuOpen(true)}
                            className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
                            aria-label="Open menu"
                        >
                            <Menu />
                        </button>
                        <div>
                            <p className="font-semibold">
                                {isAdmin ? "Admin Dashboard" : "User Dashboard"}
                            </p>
                            <p className="text-xs text-gray-500">
                                Welcome to ShopSphere
                            </p>
                        </div>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800">
                        {isAdmin ? "A" : "U"}
                    </div>
                </header>

                <main className="p-4 sm:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}