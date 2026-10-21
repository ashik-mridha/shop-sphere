import { useState, useRef, useEffect } from "react";
import {
    Heart,
    ShoppingCart,
    UserRound,
    ChevronDown,
    Sun,
    Moon,
    LayoutDashboard,
    LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import useCartCount from "../hooks/useCartCount";
import { useTheme } from "../context/ThemeContext";

const DesktopNavbar = ({ navLinks, activeDropdown, setActiveDropdown }) => {
    const { data: session, isPending } = authClient.useSession();
    const { theme, toggleTheme } = useTheme();
    const [profileOpen, setProfileOpen] = useState(false);

    const profileRef = useRef(null);
    const navigate = useNavigate();
    const cartCount = useCartCount();

    // Close profile dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setProfileOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        setProfileOpen(false);
                        navigate("/");
                    },
                },
            });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const userRole = session?.user?.role || "user";

    const dashboardPath =
        userRole === "admin" ? "/admin/dashboard" : "/user/dashboard";

    return (
        <div className="hidden w-full items-center justify-between md:flex">
            {/* Logo */}
            <Link
                to="/"
                aria-label="ShopSphere home"
                className="group flex shrink-0 items-center gap-3 rounded-lg p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]"
            >
                <svg
                    viewBox="0 0 40 40"
                    className="h-9 w-9 text-[#10B981] transition-transform duration-300 group-hover:scale-105"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <ellipse cx="20" cy="8" rx="6" ry="8" />
                    <ellipse
                        cx="11"
                        cy="19"
                        rx="6"
                        ry="8"
                        transform="rotate(-45 11 19)"
                    />
                    <ellipse
                        cx="29"
                        cy="19"
                        rx="6"
                        ry="8"
                        transform="rotate(45 29 19)"
                    />
                    <ellipse cx="15" cy="30" rx="5" ry="7" />
                    <ellipse cx="25" cy="30" rx="5" ry="7" />
                </svg>

                <span className="text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-[#10B981]">
                    ShopSphere
                </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-6 lg:gap-8">
                {navLinks.map((link) => (
                    <div
                        key={link.name}
                        className="relative"
                        onMouseEnter={() =>
                            link.dropdown && setActiveDropdown(link.name)
                        }
                        onMouseLeave={() =>
                            link.dropdown && setActiveDropdown(null)
                        }
                    >
                        <Link
                            to={link.href}
                            className="group relative flex items-center gap-1 rounded-md px-1 py-2 text-[15px] font-medium text-gray-300 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]"
                        >
                            {link.name}

                            {link.dropdown && (
                                <ChevronDown
                                    size={15}
                                    className={`transition-transform ${activeDropdown === link.name
                                            ? "rotate-180 text-[#10B981]"
                                            : ""
                                        }`}
                                />
                            )}

                            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#10B981] transition-all duration-300 group-hover:w-full" />
                        </Link>

                        {link.dropdown && activeDropdown === link.name && (
                            <div className="animate-in fade-in slide-in-from-top-2 absolute left-0 top-full z-50 mt-1 w-64 rounded-xl border border-[#22332a] bg-[#0d1411]/95 p-3 shadow-2xl backdrop-blur-md">
                                <div className="flex flex-col gap-1">
                                    {link.dropdown.map((item) => (
                                        <Link
                                            key={item.title}
                                            to={item.href}
                                            onClick={() =>
                                                setActiveDropdown(null)
                                            }
                                            className="group/item rounded-lg p-2.5 transition-colors hover:bg-[#15241d]"
                                        >
                                            <p className="text-sm font-medium text-gray-200 transition-colors group-hover/item:text-[#10B981]">
                                                {item.title}
                                            </p>

                                            <p className="mt-0.5 text-xs text-gray-400">
                                                {item.desc}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-3 lg:gap-4">
                {/* Theme Toggle */}
                {/* <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    className="rounded-full p-2 text-gray-300 transition hover:bg-[#1a2922] hover:text-[#10B981]"
                >
                    {theme === "dark" ? <Sun size={21} /> : <Moon size={21} />}
                </button> */}

                {/* Wishlist */}
                <Link
                    to="/wishlist"
                    aria-label="Wishlist"
                    className="rounded-full p-2 text-gray-300 transition hover:bg-[#1a2922] hover:text-[#10B981]"
                >
                    <Heart size={22} />
                </Link>

                {/* Cart */}
                <Link
                    to="/cart"
                    aria-label={`Shopping cart, ${cartCount} items`}
                    className="relative rounded-full p-2 text-gray-300 transition hover:bg-[#1a2922] hover:text-[#10B981]"
                >
                    <ShoppingCart size={22} />

                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#10B981] px-1 text-[10px] font-bold text-[#121614]">
                        {cartCount > 99 ? "99+" : cartCount}
                    </span>
                </Link>

                {/* User Profile */}
                <div ref={profileRef} className="relative">
                    {isPending ? (
                        <div className="h-10 w-10 animate-pulse rounded-full bg-[#182620]" />
                    ) : session ? (
                        <>
                            <button
                                type="button"
                                onClick={() =>
                                    setProfileOpen((previous) => !previous)
                                }
                                aria-label="Open profile menu"
                                aria-expanded={profileOpen}
                                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#22332a] bg-[#182620] text-gray-300 transition hover:border-[#10B981]"
                            >
                                {session.user.image ? (
                                    <img
                                        src={session.user.image}
                                        alt="User avatar"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="font-semibold text-[#10B981]">
                                        {session.user.name
                                            ?.charAt(0)
                                            ?.toUpperCase() || "U"}
                                    </span>
                                )}
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border border-[#22332a] bg-[#0d1411]/95 py-2 shadow-2xl backdrop-blur-md">
                                    <div className="border-b border-[#22332a] px-4 py-2">
                                        <p className="truncate text-sm font-medium text-white">
                                            {session.user.name}
                                        </p>

                                        <p className="truncate text-xs capitalize text-gray-400">
                                            {userRole} • {session.user.email}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setProfileOpen(false);
                                            navigate(dashboardPath);
                                        }}
                                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-200 transition hover:bg-[#15241d] hover:text-[#10B981]"
                                    >
                                        <LayoutDashboard size={17} />
                                        Dashboard
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10"
                                    >
                                        <LogOut size={17} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <Link
                            to="/login"
                            aria-label="Login"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#22332a] bg-[#182620] text-gray-300 transition hover:border-[#10B981] hover:text-[#10B981]"
                        >
                            <UserRound size={20} />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DesktopNavbar;