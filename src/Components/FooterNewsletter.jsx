import React, { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";

const FooterNewsletter = () => {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail("");
            setTimeout(() => setSubscribed(false), 4000);
        }
    };

    return (
        <div className="border-b border-[#1f2924] py-12 px-5 sm:px-8 lg:px-12 bg-[#0d1411]">
            <div className="mx-auto max-w-[1440px] flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="text-center lg:text-left">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#10B981] bg-[#10B981]/10 px-3 py-1 rounded-full">
                        Stay Connected
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mt-3">
                        Join the ShopSphere Club
                    </h3>
                    <p className="text-sm text-gray-400 mt-1 max-w-md">
                        Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex w-full max-w-md items-center gap-2">
                    <div className="relative flex-1">
                        <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address..."
                            className="w-full rounded-xl border border-[#22332a] bg-[#121614] py-3 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-500 transition focus:border-[#10B981] focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                        />
                    </div>
                    <button
                        type="submit"
                        className="flex items-center gap-2 rounded-xl bg-[#10B981] px-5 py-3 text-sm font-semibold text-[#121614] transition-all duration-200 hover:bg-[#0ea5e9] hover:text-white shadow-lg shadow-[#10B981]/20 shrink-0"
                    >
                        <span>Subscribe</span>
                        <ArrowRight size={16} />
                    </button>
                </form>
            </div>
            {subscribed && (
                <p className="text-center text-xs text-[#10B981] mt-3 animate-fade-in">
                    🎉 Thank you for subscribing to ShopSphere!
                </p>
            )}
        </div>
    );
};

export default FooterNewsletter;