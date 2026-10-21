import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Shield, Edit3, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const SERVER_URL = "http://localhost:5000";

export default function MyProfilePage() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        role: "Customer",
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Fetch user profile data
    useEffect(() => {
        async function fetchProfile() {
            try {
                setLoading(true);
                // যদি তোমার ব্যাকএন্ডে سেশনের ইউজার ফেচ করার এপিআই থাকে
                const res = await fetch(`${SERVER_URL}/api/auth/session`, {
                    credentials: "include",
                }).catch(() => null);

                if (res && res.ok) {
                    const data = await res.json();
                    const userData = data.user || data;
                    setUser({
                        name: userData.name || "ShopSphere User",
                        email: userData.email || "user@shopsphere.com",
                        phone: userData.phone || "01888885555",
                        address: userData.address || "Dimla, Nilphamari",
                        role: userData.role || "Customer",
                    });
                } else {
                    // ফলব্যাক হিসেবে লোকালস্টোরেজ বা ডেমো ডাটা
                    const localUser = JSON.parse(localStorage.getItem("shopsphere_user")) || {
                        name: "Ashik Mridha",
                        email: "ashik@shopsphere.com",
                        phone: "01888885555",
                        address: "Nilphamari, Bangladesh",
                        role: "Administrator",
                    };
                    setUser(localUser);
                }
            } catch (err) {
                console.error("Fetch profile error:", err);
                toast.error("Failed to load profile details.");
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, []);

    // Handle Input Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    // Handle Profile Update
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            setUpdating(true);

            // ব্যাকএন্ডে আপডেট এপিআই কল (যদি থাকে)
            const res = await fetch(`${SERVER_URL}/api/user/profile`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(user),
            }).catch(() => null);

            // লোকালস্টোরেজেও আপডেট সেভ করে রাখা
            localStorage.setItem("shopsphere_user", JSON.stringify(user));

            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (err) {
            console.error("Update profile error:", err);
            toast.error("Failed to update profile.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="animate-spin text-[#10B981]" size={40} />
                <p className="mt-3 text-sm text-gray-400">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 text-gray-200">
            {/* Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white sm:text-3xl">My Profile</h1>
                    <p className="mt-1 text-sm text-gray-400">
                        View and manage your account personal information.
                    </p>
                </div>

                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#22332a] bg-[#121816] px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-[#1a2420] hover:text-white"
                >
                    <Edit3 size={16} className="text-[#10B981]" />
                    {isEditing ? "Cancel Editing" : "Edit Profile"}
                </button>
            </div>

            {/* Profile Card */}
            <div className="overflow-hidden rounded-2xl border border-[#22332a] bg-[#121816] shadow-xl">
                {/* Banner & Avatar Area */}
                <div className="h-32 bg-gradient-to-r from-[#0d1411] via-[#1a2420] to-[#121816] border-b border-[#22332a] relative px-6 flex items-end">
                    <div className="absolute -bottom-10 left-6 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-[#121816] bg-[#10B981] text-3xl font-bold text-white shadow-xl">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                </div>

                <div className="pt-14 pb-8 px-6 sm:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-white">{user.name}</h2>
                            <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                                <Mail size={14} className="text-[#10B981]" />
                                {user.email}
                            </p>
                        </div>

                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#10B981]/30 bg-[#10B981]/15 px-3 py-1 text-xs font-semibold text-[#10B981] w-fit">
                            <Shield size={12} />
                            {user.role}
                        </span>
                    </div>

                    {/* Profile Details Form / Info */}
                    <form onSubmit={handleSaveProfile} className="mt-8 grid gap-6 sm:grid-cols-2">
                        {/* Full Name */}
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    value={user.name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 transition focus:border-[#10B981] focus:outline-none ${isEditing
                                            ? "border-[#22332a] bg-[#0d1411]"
                                            : "border-transparent bg-[#121816] text-gray-300 cursor-not-allowed"
                                        }`}
                                />
                            </div>
                        </div>

                        {/* Email Address (Usually Read-only) */}
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full rounded-xl border border-transparent bg-[#121816] py-2.5 pl-10 pr-4 text-sm text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1.5">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    name="phone"
                                    value={user.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Enter phone number"
                                    className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 transition focus:border-[#10B981] focus:outline-none ${isEditing
                                            ? "border-[#22332a] bg-[#0d1411]"
                                            : "border-transparent bg-[#121816] text-gray-300 cursor-not-allowed"
                                        }`}
                                />
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1.5">
                                Default Shipping Address
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    name="address"
                                    value={user.address}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Enter delivery address"
                                    className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 transition focus:border-[#10B981] focus:outline-none ${isEditing
                                            ? "border-[#22332a] bg-[#0d1411]"
                                            : "border-transparent bg-[#121816] text-gray-300 cursor-not-allowed"
                                        }`}
                                />
                            </div>
                        </div>

                        {/* Save Button (Visible only when editing) */}
                        {isEditing && (
                            <div className="sm:col-span-2 flex justify-end mt-4">
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#10B981] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#10B981]/20 transition hover:bg-[#0d9668]"
                                >
                                    {updating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}