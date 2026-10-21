import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function TrackOrderError({ message }) {
    return (
        <div className="mx-auto flex min-h-[40vh] max-w-lg flex-col items-center justify-center rounded-2xl border border-[#22332a] bg-[#121816] p-8 text-center shadow-xl">
            <AlertCircle
                size={48}
                className="mb-4 text-red-500"
            />

            <h2 className="text-xl font-bold text-white">
                Unable to track order
            </h2>

            <p className="mt-2 text-sm text-gray-400">
                {message || "We couldn't find this order."}
            </p>

            <Link
                to="/shop"
                className="mt-6 rounded-xl bg-[#10B981] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0d9668]"
            >
                Continue Shopping
            </Link>
        </div>
    );
}