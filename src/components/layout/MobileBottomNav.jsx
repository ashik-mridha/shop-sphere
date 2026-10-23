import { NavLink } from "react-router-dom";
import { Heart, Home, ShoppingBag, ShoppingCart, UserRound } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import { useWishlist } from "../../context/WishlistContext";

export default function MobileBottomNav() {
    const { isLoggedIn, dashboardPath } = useAuth();
    const { count } = useCart();
    const wishlist = useWishlist();

    const items = [
        { to: "/", label: "Home", icon: Home, end: true },
        { to: "/shop", label: "Shop", icon: ShoppingBag },
        { to: "/cart", label: "Cart", icon: ShoppingCart, badge: count },
        { to: "/wishlist", label: "Wishlist", icon: Heart, badge: wishlist.count },
        { to: isLoggedIn ? dashboardPath : "/login", label: isLoggedIn ? "Account" : "Sign in", icon: UserRound },
    ];

    return (
        <nav aria-label="Quick navigation" className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur md:hidden">
            <ul className="grid grid-cols-5">
                {items.map(({ to, label, icon: Icon, end, badge }) => (
                    <li key={label}>
                        <NavLink
                            to={to}
                            end={end}
                            className={({ isActive }) => `relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold ${isActive ? "text-primary" : "text-muted"}`}
                        >
                            <span className="relative">
                                <Icon size={21} aria-hidden="true" />
                                {badge > 0 && (
                                    <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-fg">
                                        {badge > 99 ? "99+" : badge}
                                    </span>
                                )}
                            </span>
                            {label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
