
import { ShoppingBag, Home,  } from "lucide-react";

const NotFoundContent = () => {
    return (
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20 max-w-2xl mx-auto">

            {/* Glowing Backdrop Circle */}
            <div className="absolute -z-10 h-72 w-72 rounded-full bg-[#10B981]/10 blur-3xl" />

            {/* Glowing 404 Large Text */}
            <div className="relative mb-6">
                <span className="text-8xl sm:text-9xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-[#15eca4] via-[#0c3b29] to-[#121614] select-none">
                    404
                </span>
                <span className="absolute inset-0 text-8xl sm:text-9xl font-black tracking-widest text-[#10B981]/20 blur-xl select-none">
                    404
                </span>
            </div>

            {/* Badge */}
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0db37b] bg-[#10B981]/10 border border-[#10B981]/20 px-3.5 py-1.5 rounded-full mb-4">
                Page Not Found
            </span>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Oops! Looks like you're lost.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-gray-400 mt-3 leading-relaxed max-w-lg">
                The page or product you are looking for might have been removed, had its name changed, or is temporarily unavailable in ShopSphere.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto">
                <a
                    href="/"
                    className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-[#10B981] px-6 py-3.5 text-sm font-semibold text-[#121614] transition-all duration-300 hover:bg-[#0ea5e9] hover:text-white shadow-lg shadow-[#10B981]/20 active:scale-95"
                >
                    <Home size={18} />
                    <span>Back to Home</span>
                </a>

                <a
                    href="/shop"
                    className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl border border-[#22332a] bg-[#15241d] px-6 py-3.5 text-sm font-medium text-gray-200 transition-all duration-300 hover:border-[#10B981] hover:text-[#10B981] active:scale-95"
                >
                    <ShoppingBag size={18} />
                    <span>Continue Shopping</span>
                </a>
            </div>
        </div>
    );
};

export default NotFoundContent;