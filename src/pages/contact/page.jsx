
import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#0a0f0d] px-4 py-12 text-gray-100 sm:px-6 lg:px-12">
            <div className="mx-auto max-w-7xl">
                {/* Header Title */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                        Contact <span className="text-[#10B981]">Us</span>
                    </h1>
                    <p className="text-sm text-gray-400">
                        We are always here to help. Reach out to us for any queries or support.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <ContactInfo />
                    <ContactForm />
                </div>
            </div>
        </main>
    );
}