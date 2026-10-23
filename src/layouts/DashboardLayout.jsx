import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
    Heart, LayoutDashboard, LogOut, MapPin, Menu, MessageSquareText, Package, ShoppingBag, Star, Store, Tag, Ticket, UserRound, Users, X,
} from "lucide-react";
import Logo from "../components/layout/Logo";
import ThemeToggle from "../components/layout/ThemeToggle";
import Badge from "../components/ui/Badge";
import useAuth from "../hooks/useAuth";

const adminLinks = [
    { name: "Overview", to: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", to: "/admin/products", icon: Package },
    { name: "Orders", to: "/admin/orders", icon: ShoppingBag },
    { name: "Users", to: "/admin/users", icon: Users },
    { name: "Categories", to: "/admin/categories", icon: Tag },
    { name: "Coupons", to: "/admin/coupons", icon: Ticket },
    { name: "Reviews", to: "/admin/reviews", icon: Star },
    { name: "Messages", to: "/admin/messages", icon: MessageSquareText },
    { name: "My profile", to: "/admin/profile", icon: UserRound },
];

const userLinks = [
    { name: "Overview", to: "/user/dashboard", icon: LayoutDashboard },
    { name: "My orders", to: "/user/orders", icon: ShoppingBag },
    { name: "Wishlist", to: "/user/wishlist", icon: Heart },
    { name: "Addresses", to: "/user/addresses", icon: MapPin },
    { name: "Profile", to: "/user/profile", icon: UserRound },
];

export default function DashboardLayout({ role = "user" }) {
    const [open, setOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const isAdmin = role === "admin";
    const links = isAdmin ? adminLinks : userLinks;
    const current = links.find((l) => location.pathname === l.to || location.pathname.startsWith(`${l.to}/`));

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors ${isActive ? "bg-primary text-primary-fg" : "text-muted hover:bg-surface-2 hover:text-fg"}`;

    return (
        <div className="min-h-screen bg-bg">
            {open && <button type="button" aria-label="Close sidebar" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/50 lg:hidden" />}

            <aside
                aria-label="Dashboard navigation"
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-surface transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex h-16 items-center justify-between border-b border-line px-5">
                    <Logo />
                    <button type="button" className="rounded-lg p-1.5 hover:bg-surface-2 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
                        <X size={20} />
                    </button>
                </div>

                <div className="border-b border-line px-5 py-4">
                    <p className="truncate text-sm font-semibold">{user?.name}</p>
                    <p className="truncate text-xs text-muted">{user?.email}</p>
                    <Badge tone={isAdmin ? "warning" : "primary"} className="mt-2">{isAdmin ? "Administrator" : "Customer"}</Badge>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                    {links.map(({ name, to, icon: Icon }) => (
                        <NavLink key={to} to={to} onClick={() => setOpen(false)} className={linkClass}>
                            <Icon size={18} aria-hidden="true" />
                            {name}
                        </NavLink>
                    ))}
                </nav>

                <div className="space-y-1 border-t border-line p-3">
                    <Link to="/" className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-muted hover:bg-surface-2 hover:text-fg">
                        <Store size={18} aria-hidden="true" /> Visit store
                    </Link>
                    <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-danger hover:bg-danger-soft">
                        <LogOut size={18} aria-hidden="true" /> Sign out
                    </button>
                </div>
            </aside>

            <div className="lg:pl-64">
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-line bg-surface/90 px-4 backdrop-blur sm:px-6">
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-surface-2 lg:hidden" aria-label="Open menu" aria-expanded={open}>
                            <Menu size={22} />
                        </button>
                        <p className="font-bold">{current?.name || (isAdmin ? "Admin" : "My account")}</p>
                    </div>
                    <ThemeToggle />
                </header>

                <main id="main" className="mx-auto w-full max-w-7xl p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
