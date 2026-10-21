import  { useState, useEffect, useRef } from "react";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import MobileBottomNav from "./MobileBottomNav";

const Navbar = () => {
    // Theme State (Light/Dark with localStorage)
    const [theme, setTheme] = useState(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("shopsphere_theme");
            if (savedTheme) return savedTheme;
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
        return "light";
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("shopsphere_theme", theme);
    }, [theme]);

    const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

    // Interactive Search State
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchRef = useRef(null);

    const navLinks = [
        { name: "Home", href: "/" },
        {
            name: "Shop",
            href: "/shop",
        },
        
        { name: "Track Order", href: "/track-order" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    const [activeDropdown, setActiveDropdown] = useState(null);

    return (
        <>
            {/* Top Fixed Header */}
            <header className="sticky top-0 z-40 w-full border-b transition-colors duration-300 bg-[#121614] border-[#1f2924] text-gray-100">
                <nav className="mx-auto flex h-[72px] sm:h-[82px] max-w-[1440px] items-center px-5 sm:px-8 lg:px-12">
                    {/* Desktop Navigation */}
                    <DesktopNavbar
                        navLinks={navLinks}
                        activeDropdown={activeDropdown}
                        setActiveDropdown={setActiveDropdown}
                        isSearchOpen={isSearchOpen}
                        setIsSearchOpen={setIsSearchOpen}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        searchRef={searchRef}
                        theme={theme}
                        toggleTheme={toggleTheme}
                    />

                    {/* Mobile Top Header */}
                    <MobileNavbar
                        isSearchOpen={isSearchOpen}
                        setIsSearchOpen={setIsSearchOpen}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        theme={theme}
                        toggleTheme={toggleTheme}
                    />
                </nav>
            </header>

            {/* Mobile Bottom Navigation Bar (Image-এর মত ঠিক নিচে দেখাবে) */}
            <MobileBottomNav currentPath="/" />
        </>
    );
};

export default Navbar;