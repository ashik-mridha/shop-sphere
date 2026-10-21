
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutCTA() {
    return (
        <section className="rounded-3xl border border-[#22332a] bg-gradient-to-r from-[#121816] via-[#16221d] to-[#121816] p-8 sm:p-12 text-center space-y-6">
            <div className="max-w-2xl mx-auto space-y-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    Ready to Upgrade Your Shopping Experience?
                </h2>
                <p className="text-sm text-gray-400">
                    Browse our dynamic catalog and find the best deals curated just for you.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                    to="/shop"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#10B981] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#10B981]/20 transition hover:bg-[#0d9668]"
                >
                    Start Shopping
                    <ArrowRight size={18} />
                </Link>

                <Link
                    to="/contact"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#22332a] bg-[#121816] px-8 py-3.5 text-sm font-semibold text-gray-300 transition hover:border-[#10B981] hover:text-white"
                >
                    Contact Support
                </Link>
            </div>
        </section>
    );
}