
import { STEPS } from "../../utils/orderTracking";

export default function OrderProgress({
    currentStep,
    cancelled,
}) {
    return (
        <section className="my-12">
            {cancelled ? (
                <div className="rounded-xl bg-red-50 p-5 text-center text-red-700">
                    This order has been cancelled.
                </div>
            ) : (
                <div className="grid grid-cols-4">
                    {STEPS.map((step, index) => {
                        const completed = index <= currentStep;
                        const Icon = step.icon;

                        return (
                            <div
                                key={step.label}
                                className="relative text-center"
                            >
                                {index > 0 && (
                                    <div
                                        className={`absolute right-1/2 top-4 h-0.5 w-full ${index <= currentStep
                                                ? "bg-emerald-600"
                                                : "bg-gray-200"
                                            }`}
                                    />
                                )}

                                <div
                                    className={`relative mx-auto flex h-8 w-8 items-center justify-center rounded-full ${completed
                                            ? "bg-emerald-600 text-white"
                                            : "bg-gray-200 text-gray-500"
                                        }`}
                                >
                                    <Icon size={16} />
                                </div>

                                <p
                                    className={`mt-3 text-xs font-semibold sm:text-sm ${completed
                                            ? "text-gray-900"
                                            : "text-gray-400"
                                        }`}
                                >
                                    {step.label}
                                </p>

                                <p className="mt-1 hidden text-xs text-gray-500 sm:block">
                                    {completed
                                        ? "Completed"
                                        : "Pending"}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
