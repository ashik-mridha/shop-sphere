
import { ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutHero() {
    return (
        <section className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#22332a] bg-[#121816] text-xs font-medium text-[#10B981]">
                <Sparkles size={14} />
                <span>Redefining Online Shopping Experience</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Welcome to <span className="text-[#10B981]">ShopSphere</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                Your trusted marketplace for premium quality products. We bring together innovation, style, and reliability to give you an effortless shopping journey.
            </p>

            <div className="pt-2 flex justify-center gap-4">
                <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#10B981] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#10B981]/20 transition hover:bg-[#0d9668]"
                >
                    <ShoppingBag size={18} />
                    Explore Shop
                </Link>
            </div>
        </section>
    );
}