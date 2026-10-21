
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const CONTACT_DETAILS = [
    {
        id: 1,
        icon: MapPin,
        title: "Our Location",
        details: "123 ShopSphere Avenue, Suite 4B, New York, NY 10001",
    },
    {
        id: 2,
        icon: Phone,
        title: "Phone Number",
        details: "+1 (555) 234-5678",
    },
    {
        id: 3,
        icon: Mail,
        title: "Email Address",
        details: "ashikmridha43@gmail.com",
    },
    {
        id: 4,
        icon: Clock,
        title: "Working Hours",
        details: "Mon - Fri: 9:00 AM - 8:00 PM",
    },
];

export default function ContactInfo() {
    return (
        <div className="space-y-6">
            <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#10B981]">
                    Get in Touch
                </span>
                <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-white">
                    We'd Love to Hear From You
                </h2>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                    Have a question about our products, orders, or shipping? Feel free to reach out to our dedicated support team using any of the channels below.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CONTACT_DETAILS.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.id}
                            className="rounded-2xl border border-[#22332a] bg-[#121816] p-5 space-y-3 hover:border-[#10B981]/50 transition-all duration-300"
                        >
                            <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center text-[#10B981]">
                                <Icon size={20} />
                            </div>
                            <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">{item.details}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}