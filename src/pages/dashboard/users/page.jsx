
import { useCallback, useEffect, useState } from "react";
import {
    Users,
    Search,
    RefreshCw,
    ShieldCheck,
    UserRound,
    Mail,
    CalendarDays,
    AlertCircle,
} from "lucide-react";

const API_URL = "http://localhost:5000";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const params = new URLSearchParams({
                search,
                role,
            });

            const response = await fetch(
                `${API_URL}/api/admin/users?${params.toString()}`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error(
                        "Please log in again to access user management."
                    );
                }

                if (response.status === 403) {
                    throw new Error(
                        "Access denied. An administrator account is required."
                    );
                }

                throw new Error(
                    data.message || "Failed to load users."
                );
            }

            setUsers(Array.isArray(data.users) ? data.users : []);
        } catch (err) {
            setUsers([]);
            setError(
                err.message ||
                "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    }, [search, role]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <div className="min-h-screen bg-gray-100 p-4 text-gray-900 sm:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
                            <Users className="text-emerald-600" />
                            Users Management
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Manage registered users and review account details.
                        </p>
                    </div>

                    <button
                        onClick={fetchUsers}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                    >
                        <RefreshCw
                            size={16}
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh List
                    </button>
                </div>

                <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:max-w-md">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search by name or email..."
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {[
                            { label: "ALL", value: "all" },
                            { label: "ADMIN", value: "admin" },
                            { label: "USER", value: "user" },
                        ].map((item) => (
                            <button
                                key={item.value}
                                onClick={() => setRole(item.value)}
                                className={`rounded-full px-4 py-2 text-xs font-bold transition ${role === item.value
                                        ? "bg-emerald-500 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        <AlertCircle
                            size={20}
                            className="mt-0.5 shrink-0"
                        />
                        <div className="flex-1">
                            <p className="font-semibold">
                                Unable to load users
                            </p>
                            <p className="mt-1">{error}</p>
                        </div>

                        <button
                            onClick={fetchUsers}
                            className="font-semibold underline"
                        >
                            Retry
                        </button>
                    </div>
                )}

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    {loading ? (
                        <div className="flex min-h-56 flex-col items-center justify-center gap-3 text-gray-500">
                            <RefreshCw
                                size={30}
                                className="animate-spin text-emerald-600"
                            />
                            <p className="text-sm">Loading users...</p>
                        </div>
                    ) : error ? (
                        <div className="p-12 text-center text-sm text-gray-500">
                            Fix the error above and retry.
                        </div>
                    ) : users.length === 0 ? (
                        <div className="flex min-h-56 flex-col items-center justify-center p-8 text-center">
                            <Users
                                size={38}
                                className="mb-3 text-gray-300"
                            />
                            <h2 className="font-semibold">
                                No users found
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Try another search term or role filter.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="border-b border-gray-100 px-5 py-4">
                                <p className="text-sm text-gray-500">
                                    Showing{" "}
                                    <span className="font-semibold text-gray-900">
                                        {users.length}
                                    </span>{" "}
                                    users
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[700px] text-left text-sm">
                                    <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                                        <tr>
                                            <th className="px-5 py-4">User</th>
                                            <th className="px-5 py-4">Email</th>
                                            <th className="px-5 py-4">Role</th>
                                            <th className="px-5 py-4">Verified</th>
                                            <th className="px-5 py-4">Joined</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {users.map((user) => (
                                            <tr
                                                key={user._id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {user.image ? (
                                                            <img
                                                                src={user.image}
                                                                alt=""
                                                                className="h-10 w-10 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                                                <UserRound size={20} />
                                                            </div>
                                                        )}

                                                        <span className="font-semibold">
                                                            {user.name || "Unnamed user"}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 text-gray-600">
                                                    <span className="inline-flex items-center gap-2">
                                                        <Mail size={15} />
                                                        {user.email}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${user.role === "admin"
                                                                ? "bg-purple-100 text-purple-700"
                                                                : "bg-emerald-100 text-emerald-700"
                                                            }`}
                                                    >
                                                        {user.role === "admin" && (
                                                            <ShieldCheck size={13} />
                                                        )}
                                                        {user.role || "user"}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    {user.emailVerified ? (
                                                        <span className="font-medium text-emerald-700">
                                                            Verified
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500">
                                                            Not verified
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 text-gray-500">
                                                    <span className="inline-flex items-center gap-2">
                                                        <CalendarDays size={15} />
                                                        {user.createdAt
                                                            ? new Date(
                                                                user.createdAt
                                                            ).toLocaleDateString()
                                                            : "—"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
