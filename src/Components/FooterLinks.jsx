import React from "react";
import { ShieldCheck, Truck, Headphones, RotateCcw } from "lucide-react";

const FooterLinks = () => {
    const features = [
        { icon: <Truck size={20} className="text-[#10B981]" />, title: "Free Shipping", desc: "On all orders over $100" },
        { icon: <ShieldCheck size={20} className="text-[#10B981]" />, title: "Secure Payment", desc: "100% protected checkout" },
        { icon: <RotateCcw size={20} className="text-[#10B981]" />, title: "Easy Returns", desc: "30-day money-back guarantee" },
        { icon: <Headphones size={20} className="text-[#10B981]" />, title: "24/7 Support", desc: "Dedicated expert assistance" },
    ];

    const footerNavs = {
        shop: [
            { name: "New Arrivals", href: "/shop/new" },
            { name: "Best Sellers", href: "/shop/best-sellers" },
            { name: "Electronics & Tech", href: "/categories/electronics" },
            { name: "Apparel & Fashion", href: "/categories/fashion" },
            { name: "Sale & Offers", href: "/shop/sale" },
        ],
        company: [
            { name: "About Us", href: "/about" },
            { name: "Careers", href: "/careers" },
            { name: "Press & Media", href: "/press" },
            { name: "Sustainability", href: "/sustainability" },
            { name: "Contact Us", href: "/contact" },
        ],
        support: [
            { name: "Help Center", href: "/help" },
            { name: "Track Order", href: "/track-order" },
            { name: "Returns & Exchanges", href: "/returns" },
            { name: "Shipping Info", href: "/shipping" },
            { name: "Privacy Policy", href: "/privacy" },
        ],
    };

    return (
        <div className="py-16 px-5 sm:px-8 lg:px-12 bg-[#121614]">
            <div className="mx-auto max-w-[1440px]">

                {/* Feature Badges Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-[#1f2924]">
                    {features.map((feat, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-[#0d1411] border border-[#1f2924]/60">
                            <div className="p-3 rounded-lg bg-[#15241d]">{feat.icon}</div>
                            <div>
                                <h4 className="text-sm font-semibold text-white">{feat.title}</h4>
                                <p className="text-xs text-gray-400">{feat.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pt-12">

                    {/* Brand Info */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <svg viewBox="0 0 40 40" className="h-8 w-8 text-[#10B981]" fill="currentColor">
                                <ellipse cx="20" cy="8" rx="6" ry="8" />
                                <ellipse cx="11" cy="19" rx="6" ry="8" transform="rotate(-45 11 19)" />
                                <ellipse cx="29" cy="19" rx="6" ry="8" transform="rotate(45 29 19)" />
                                <ellipse cx="15" cy="30" rx="5" ry="7" />
                                <ellipse cx="25" cy="30" rx="5" ry="7" />
                            </svg>
                            <span className="text-2xl font-bold text-white tracking-tight">ShopSphere</span>
                        </div>
                        <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
                            Crafting a premium e-commerce shopping experience with a matte black and deep forest green aesthetic. Built for modern lifestyle and tech lovers.
                        </p>
                        <div className="text-xs text-gray-500 mt-2">
                            © {new Date().getFullYear()} ShopSphere Inc. All rights reserved.
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Shop Categories</h4>
                        <ul className="flex flex-col gap-2.5">
                            {footerNavs.shop.map((item) => (
                                <li key={item.name}>
                                    <a href={item.href} className="text-sm text-gray-400 hover:text-[#10B981] transition-colors">
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">About Company</h4>
                        <ul className="flex flex-col gap-2.5">
                            {footerNavs.company.map((item) => (
                                <li key={item.name}>
                                    <a href={item.href} className="text-sm text-gray-400 hover:text-[#10B981] transition-colors">
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Customer Support</h4>
                        <ul className="flex flex-col gap-2.5">
                            {footerNavs.support.map((item) => (
                                <li key={item.name}>
                                    <a href={item.href} className="text-sm text-gray-400 hover:text-[#10B981] transition-colors">
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FooterLinks;