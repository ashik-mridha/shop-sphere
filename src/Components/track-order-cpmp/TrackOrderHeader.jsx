
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/orderTracking";

export default function TrackOrderHeader({
    order,
    id,
    status,
    currentStep,
    cancelled,
}) {
    const orderId = String(order._id || id)
        .slice(-8)
        .toUpperCase();

    return (
        <>
            <Link
                to="/user/orders"
                className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-emerald-700"
            >
                <ArrowLeft size={17} />
                Back to My Orders
            </Link>

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-bold sm:text-3xl">
                            Track Order #{orderId}
                        </h1>

                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${cancelled
                                    ? "bg-red-100 text-red-700"
                                    : currentStep === 3
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-blue-100 text-blue-700"
                                }`}
                        >
                            {status}
                        </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                        Placed on {formatDate(order.createdAt)}
                    </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ShoppingBag size={18} />
                    {order.paymentMethod || "Cash on Delivery"}
                </div>
            </div>
        </>
    );
}
