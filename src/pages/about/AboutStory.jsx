
import { CheckCircle2, Users } from "lucide-react";

export default function AboutStory() {
    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center rounded-3xl border border-[#22332a] bg-[#121816] p-6 sm:p-10 lg:p-12 overflow-hidden relative">
            <div className="space-y-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#10B981]">
                    Our Journey
                </span>

                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    Built on Quality, Driven by Customer Trust
                </h2>

                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                    ShopSphere was created with a clear goal in mind: to simplify e-commerce without compromising quality or authenticity. We noticed shoppers often struggled with inconsistent product quality and delayed support.
                </p>

                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                    That's why we carefully curate every item on our store and partner only with trusted suppliers. Whether you're upgrading your daily tech, fashion, or home accessories, ShopSphere guarantees a smooth and secure experience every step of the way.
                </p>

                <ul className="space-y-3 pt-2">
                    {[
                        "Strict Quality Assurance on every product",
                        "Transparent pricing with no hidden charges",
                        "Easy 7-day hassle-free return policy",
                    ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                            <CheckCircle2 size={18} className="text-[#10B981] shrink-0" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-[#22332a] bg-[#0d1411] p-8 flex flex-col justify-center items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-[#10B981]/10 text-[#10B981]">
                    <Users size={48} />
                </div>
                <h3 className="text-xl font-bold text-white">Customer First Approach</h3>
                <p className="text-xs sm:text-sm text-gray-400 max-w-sm">
                    Over 50,000+ satisfied customers rely on us daily for their shopping needs. Your satisfaction is our top priority.
                </p>
            </div>
        </section>
    );
}