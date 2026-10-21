import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // এখানে আপনার ফর্ম সাবমিট লজিক বা API কল যুক্ত করতে পারেন
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });

        setTimeout(() => {
            setSubmitted(false);
        }, 4000);
    };

    return (
        <div className="rounded-3xl border border-[#22332a] bg-[#121816] p-6 sm:p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-2">Send Us a Message</h3>
            <p className="text-xs text-gray-400 mb-6">
                Fill out the form below and we will get back to you within 24 hours.
            </p>

            {submitted && (
                <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-800 bg-[#10B981]/10 p-4 text-sm text-[#10B981]">
                    <CheckCircle2 size={18} />
                    <span>Thank you! Your message has been sent successfully.</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                        Your Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Asik Mirdha"
                        className="w-full rounded-xl border border-[#22332a] bg-[#0d1411] px-4 py-2.5 text-sm text-white placeholder-gray-600 transition focus:border-[#10B981] focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="asik@example.com"
                        className="w-full rounded-xl border border-[#22332a] bg-[#0d1411] px-4 py-2.5 text-sm text-white placeholder-gray-600 transition focus:border-[#10B981] focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                        Subject
                    </label>
                    <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        className="w-full rounded-xl border border-[#22332a] bg-[#0d1411] px-4 py-2.5 text-sm text-white placeholder-gray-600 transition focus:border-[#10B981] focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                        Message
                    </label>
                    <textarea
                        name="message"
                        rows="4"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write your message here..."
                        className="w-full rounded-xl border border-[#22332a] bg-[#0d1411] p-4 text-sm text-white placeholder-gray-600 transition focus:border-[#10B981] focus:outline-none resize-none"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#10B981] py-3 text-sm font-semibold text-white shadow-lg shadow-[#10B981]/20 transition hover:bg-[#0d9668] cursor-pointer"
                >
                    <Send size={16} />
                    Send Message
                </button>
            </form>
        </div>
    );
}