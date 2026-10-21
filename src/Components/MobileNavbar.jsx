import { Sun, Moon, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { useTheme } from "../context/ThemeContext";

const MobileNavbar = () => {
    const { data: session, isPending } = authClient.useSession();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="flex h-full w-full items-center justify-between md:hidden">
            {/* Logo */}
            <Link
                to="/"
                aria-label="ShopSphere home"
                className="flex items-center gap-2"
            >
                <svg
                    viewBox="0 0 40 40"
                    className="h-8 w-8 text-[#10B981]"
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

                <span className="text-xl font-bold tracking-tight text-white">
                    ShopSphere
                </span>
            </Link>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                {/* <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    className="rounded-full p-2 text-gray-300 transition hover:bg-[#1a2922] hover:text-[#10B981]"
                >
                    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button> */}

                {/* Show Login only when logged out */}
                {!isPending && !session && (
                    <Link
                        to="/login"
                        aria-label="Login"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#10B981] px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                    >
                        <LogIn size={17} />
                        <span>Login</span>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default MobileNavbar;