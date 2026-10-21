
import { ShieldCheck, Truck, Award, Headphones } from "lucide-react";

const FEATURES = [
    {
        id: 1,
        icon: ShieldCheck,
        title: "100% Secure Shopping",
        description: "We ensure end-to-end encrypted transactions so your personal and payment info stays safe.",
    },
    {
        id: 2,
        icon: Truck,
        title: "Fast & Reliable Shipping",
        description: "Swift doorstep delivery with real-time tracking so you never have to guess your order status.",
    },
    {
        id: 3,
        icon: Award,
        title: "Authentic Products Only",
        description: "Directly sourced from verified manufacturers to guarantee genuine premium quality.",
    },
    {
        id: 4,
        icon: Headphones,
        title: "Dedicated 24/7 Support",
        description: "Our friendly support team is always available to help you with queries, returns, or refunds.",
    },
];

export default function AboutFeatures() {
    return (
        <section className="space-y-10">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#10B981]">
                    Why ShopSphere
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    Why Thousands of Shoppers Trust Us
                </h2>
                <p className="text-sm text-gray-400">
                    We focus on delivering high standards across every interaction.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {FEATURES.map((feature) => {
                    const Icon = feature.icon;
                    return (
                        <div
                            key={feature.id}
                            className="rounded-2xl border border-[#22332a] bg-[#121816] p-6 space-y-4 hover:border-[#10B981]/60 transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center text-[#10B981] group-hover:bg-[#10B981] group-hover:text-white transition-colors duration-300">
                                <Icon size={24} />
                            </div>
                            <h3 className="text-lg font-semibold text-white">
                                {feature.title}
                            </h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}