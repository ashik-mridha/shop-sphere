import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import useTrackOrder from "../../hooks/useTrackOrder";
import TrackOrderLoading from "../../Components/track-order-cpmp/TrackOrderLoading";
import TrackOrderError from "../../Components/track-order-cpmp/TrackOrderError";
import TrackOrderHeader from "../../Components/track-order-cpmp/TrackOrderHeader";
import OrderProgress from "../../Components/track-order-cpmp/OrderProgress";
import TrackingTimeline from "../../Components/track-order-cpmp/TrackingTimeline";
import OrderSummary from "../../Components/track-order-cpmp/OrderSummary";
import { getStepIndex } from "../../utils/orderTracking";

export default function TrackOrderPage() {
    const { order, loading, error, orderId } = useTrackOrder();
    const [searchInput, setSearchInput] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            navigate(`/track-order/${searchInput.trim()}`);
        }
    };

    return (
        <main className="min-h-screen bg-[#0a0f0d] px-4 py-10 text-gray-100 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-8">

                {/* Search Box - যদি URL এ Order ID না থাকে অথবা নতুন করে সার্চ করতে চায় */}
                <div className="rounded-2xl border border-[#22332a] bg-[#121816] p-6 shadow-xl">
                    <h2 className="text-lg font-semibold text-white mb-2">Track Your Package</h2>
                    <p className="text-xs text-gray-400 mb-4">
                        Enter your Order ID below to check current shipment status.
                    </p>
                    <form onSubmit={handleSearch} className="flex gap-3 max-w-md">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Enter Order ID (e.g. 64b...)"
                                className="w-full rounded-xl border border-[#22332a] bg-[#0d1411] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#10B981] focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="rounded-xl bg-[#10B981] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0d9668] cursor-pointer"
                        >
                            Track
                        </button>
                    </form>
                </div>

                {/* Content States */}
                {loading ? (
                    <TrackOrderLoading />
                ) : error || !order ? (
                    <TrackOrderError message={error || "We couldn't find this order."} />
                ) : (
                    <>
                        {/* Status Calculations */}
                        {(() => {
                            const status = order.status || "Pending";
                            const currentStep = getStepIndex ? getStepIndex(status) : 0;
                            const cancelled = currentStep === -1;

                            return (
                                <>
                                    <TrackOrderHeader
                                        order={order}
                                        id={orderId}
                                        status={status}
                                        currentStep={currentStep}
                                        cancelled={cancelled}
                                    />

                                    <OrderProgress
                                        currentStep={currentStep}
                                        cancelled={cancelled}
                                    />

                                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
                                        <TrackingTimeline
                                            order={order}
                                            currentStep={currentStep}
                                        />
                                        <OrderSummary order={order} />
                                    </div>
                                </>
                            );
                        })()}
                    </>
                )}
            </div>
        </main>
    );
}