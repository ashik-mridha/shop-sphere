import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Heart, LayoutDashboard, LogIn, LogOut, Menu, Search, ShoppingCart, UserRound, X } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import Dropdown from "../ui/Dropdown";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import { useWishlist } from "../../context/WishlistContext";

const links = [
    { to: "/", label: "Home", end: true },
    { to: "/shop", label: "Shop" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
];

const navClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${isActive ? "bg-primary-soft text-primary" : "text-fg hover:bg-surface-2"}`;

function CountBadge({ count }) {
    if (!count) return null;
    return (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-fg">
            {count > 99 ? "99+" : count}
        </span>
    );
}

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const { user, isLoggedIn, dashboardPath, logout } = useAuth();
    const { count: cartCount } = useCart();
    const wishlist = useWishlist();

    function submitSearch(e) {
        e.preventDefault();
        const q = query.trim();
        setMenuOpen(false);
        navigate(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
    }

    const searchForm = (idSuffix) => (
        <form onSubmit={submitSearch} role="search" className="relative w-full">
            <label htmlFor={`site-search-${idSuffix}`} className="sr-only">Search products</label>
            <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
                id={`site-search-${idSuffix}`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="h-10 w-full rounded-lg border border-line bg-surface-2 pl-10 pr-3 text-sm placeholder:text-muted focus:border-primary focus:outline-none"
            />
        </form>
    );

    return (
        <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
            <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-fg">
                Skip to content
            </a>
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
                <Logo />

                <nav aria-label="Main" className="ml-4 hidden items-center gap-1 lg:flex">
                    {links.map((l) => <NavLink key={l.to} to={l.to} end={l.end} className={navClass}>{l.label}</NavLink>)}
                </nav>

                <div className="mx-4 hidden max-w-sm flex-1 md:block">{searchForm("desktop")}</div>

                <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
                    <ThemeToggle />

                    <Link to="/wishlist" aria-label={`Wishlist${wishlist.count ? `, ${wishlist.count} items` : ""}`} className="relative hidden h-10 w-10 items-center justify-center rounded-lg hover:bg-surface-2 sm:flex">
                        <Heart size={20} />
                        <CountBadge count={wishlist.count} />
                    </Link>

                    <Link to="/cart" aria-label={`Cart${cartCount ? `, ${cartCount} items` : ""}`} className="relative flex h-10 w-10 items-center justify-center rounded-lg hover:bg-surface-2">
                        <ShoppingCart size={20} />
                        <CountBadge count={cartCount} />
                    </Link>

                    {isLoggedIn ? (
                        <Dropdown
                            label="Account menu"
                            trigger={({ buttonProps }) => (
                                <button {...buttonProps} className="ml-1 flex h-10 items-center gap-2 rounded-lg pl-1 pr-2 hover:bg-surface-2">
                                    {user.image ? (
                                        <img src={user.image} alt="" className="h-8 w-8 rounded-full object-cover" />
                                    ) : (
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-fg">
                                            {(user.name || user.email || "U").charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                    <span className="hidden max-w-24 truncate text-sm font-semibold md:block">{user.name?.split(" ")[0]}</span>
                                </button>
                            )}
                            items={[
                                { label: "Dashboard", icon: LayoutDashboard, onClick: () => navigate(dashboardPath) },
                                { label: "My profile", icon: UserRound, onClick: () => navigate(dashboardPath.startsWith("/admin") ? "/admin/profile" : "/user/profile") },
                                { label: "Sign out", icon: LogOut, danger: true, onClick: logout },
                            ]}
                        />
                    ) : (
                        <Link to="/login" className="ml-1 hidden h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg hover:bg-primary-hover sm:inline-flex">
                            <LogIn size={16} aria-hidden="true" /> Sign in
                        </Link>
                    )}

                    <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-surface-2 lg:hidden"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                        onClick={() => setMenuOpen((o) => !o)}
                    >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div id="mobile-menu" className="border-t border-line bg-surface px-4 pb-5 pt-3 lg:hidden">
                    <div className="md:hidden">{searchForm("mobile")}</div>
                    <nav aria-label="Mobile" className="mt-3 grid gap-1 md:mt-0">
                        {links.map((l) => (
                            <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setMenuOpen(false)} className={navClass}>{l.label}</NavLink>
                        ))}
                        <NavLink to="/track-order" onClick={() => setMenuOpen(false)} className={navClass}>Track order</NavLink>
                        <NavLink to="/faq" onClick={() => setMenuOpen(false)} className={navClass}>FAQ</NavLink>
                        {!isLoggedIn && (
                            <NavLink to="/login" onClick={() => setMenuOpen(false)} className={navClass}>Sign in / Register</NavLink>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
