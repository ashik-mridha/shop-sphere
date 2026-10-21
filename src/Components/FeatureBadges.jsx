import React from "react";
import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

const FeatureBadges = () => {
    const features = [
        {
            icon: Truck,
            title: "Free Shipping",
            subtitle: "On all orders over $50",
        },
        {
            icon: RotateCcw,
            title: "Easy Returns",
            subtitle: "30 days return policy",
        },
        {
            icon: ShieldCheck,
            title: "Secure Payment",
            subtitle: "100% protected checkout",
        },
        {
            icon: Headphones,
            title: "24/7 Support",
            subtitle: "We're here to help",
        },
    ];

    return (
        <section className="bg-[#121614] py-8 px-5 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-[1440px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group flex items-center gap-4 rounded-2xl border border-[#1f2924] bg-[#0d1411] p-5 shadow-lg transition-all duration-300 hover:border-[#10B981]/50 hover:bg-[#15241d]/60"
                            >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#15241d] text-[#10B981] transition-transform duration-300 group-hover:scale-110">
                                    <Icon size={22} strokeWidth={2} />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-bold text-white transition-colors duration-200 group-hover:text-[#10B981]">
                                        {feature.title}
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {feature.subtitle}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeatureBadges;