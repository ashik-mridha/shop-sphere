
import { Check, Clock } from "lucide-react";
import { formatDate } from "../../utils/orderTracking";

export default function TrackingTimeline({
    order,
    currentStep,
}) {
    const timeline = [
        {
            label: "Order Confirmed",
            description: "We've received your order.",
            date: order.createdAt,
        },
        {
            label: "Processing",
            description: "Your order is being prepared.",
            date: order.processingAt,
        },
        {
            label: "Shipped",
            description: "Your package is on its way.",
            date: order.shippedAt,
        },
        {
            label: "Delivered",
            description: "Your order has been delivered successfully!",
            date: order.deliveredAt,
        },
    ];

    return (
        <section className="rounded-2xl border border-gray-200 p-5 sm:p-7 lg:col-span-3">
            <h2 className="mb-7 text-lg font-bold">
                Tracking Details
            </h2>

            <div className="space-y-0">
                {timeline.map((event, index) => {
                    const completed = index <= currentStep;
                    const isLast = index === timeline.length - 1;

                    return (
                        <div
                            key={event.label}
                            className="relative flex gap-4 pb-8 last:pb-0"
                        >
                            {!isLast && (
                                <div
                                    className={`absolute left-[9px] top-5 h-full w-px ${index < currentStep
                                            ? "bg-emerald-400"
                                            : "bg-gray-200"
                                        }`}
                                />
                            )}

                            <div
                                className={`relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${completed
                                        ? "bg-emerald-600 text-white"
                                        : "border-2 border-gray-300 bg-white text-gray-400"
                                    }`}
                            >
                                {completed && <Check size={12} />}
                            </div>

                            <div className="-mt-0.5">
                                <h3
                                    className={`text-sm font-semibold ${completed
                                            ? "text-emerald-700"
                                            : "text-gray-400"
                                        }`}
                                >
                                    {event.label}
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    {event.description}
                                </p>

                                {event.date && (
                                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                                        <Clock size={12} />
                                        {formatDate(event.date)}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
