

const STATS = [
    { id: 1, label: "Happy Customers", value: "50K+" },
    { id: 2, label: "Quality Products", value: "10K+" },
    { id: 3, label: "Customer Rating", value: "4.9/5" },
    { id: 4, label: "Delivery Support", value: "24/7" },
];

export default function AboutStats() {
    return (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {STATS.map((stat) => (
                <div
                    key={stat.id}
                    className="rounded-2xl border border-[#22332a] bg-[#121816] p-6 text-center hover:border-[#10B981]/50 transition-all duration-300"
                >
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-[#10B981]">
                        {stat.value}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-gray-400 font-medium">
                        {stat.label}
                    </p>
                </div>
            ))}
        </section>
    );
}