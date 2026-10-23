import { useState } from "react";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import usePageMeta from "../../hooks/usePageMeta";
import useFetch from "../../hooks/useFetch";
import useDebounce from "../../hooks/useDebounce";
import useAuth from "../../hooks/useAuth";
import { api, errorMessage } from "../../lib/api";
import { formatDate, formatMoney } from "../../lib/format";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Input, Select, Textarea } from "../../components/ui/Input";
import { Table, THead, TBody, Tr, Th, Td } from "../../components/ui/Table";
import { TableSkeleton } from "../../components/ui/Skeleton";
import EmptyState, { ErrorState } from "../../components/ui/EmptyState";
import Pagination from "../../components/ui/Pagination";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function AdminUsersPage() {
    usePageMeta("Manage users", "Review customer accounts, change roles and block access.");
    const { user: me } = useAuth();
    const [q, setQ] = useState("");
    const [role, setRole] = useState("all");
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);
    const [action, setAction] = useState(null); // { type: "role" | "block" | "unblock", user }
    const [reason, setReason] = useState("");
    const [busy, setBusy] = useState(false);
    const debouncedQ = useDebounce(q);

    const { data, loading, error, refetch } = useFetch("/admin/users", {
        params: { q: debouncedQ, role, status, sort, page, limit: 10 },
    });
    const users = data?.data || [];
    const pagination = data?.pagination;

    const reset = (setter) => (e) => {
        setter(e.target.value);
        setPage(1);
    };

    function openAction(type, user) {
        setReason("");
        setAction({ type, user });
    }

    async function confirm() {
        const { type, user } = action;
        setBusy(true);
        try {
            const body =
                type === "role"
                    ? { role: user.role === "admin" ? "user" : "admin" }
                    : type === "block"
                      ? { banned: true, banReason: reason.trim() || undefined }
                      : { banned: false };
            await api.patch(`/admin/users/${user._id}`, body);
            toast.success("User updated");
            setAction(null);
            refetch();
        } catch (err) {
            toast.error(errorMessage(err));
        } finally {
            setBusy(false);
        }
    }

    const dialog = action && {
        role: {
            title: action.user.role === "admin" ? "Remove admin access?" : "Make this user an admin?",
            message:
                action.user.role === "admin"
                    ? `${action.user.name} will lose access to the admin dashboard.`
                    : `${action.user.name} will be able to manage products, orders and users.`,
            label: action.user.role === "admin" ? "Make customer" : "Make admin",
        },
        block: {
            title: "Block this user?",
            message: `${action.user.name} will be signed out everywhere and will not be able to sign in again until unblocked.`,
            label: "Block user",
        },
        unblock: {
            title: "Unblock this user?",
            message: `${action.user.name} will be able to sign in again.`,
            label: "Unblock",
        },
    }[action.type];

    return (
        <>
            <PageHeader title="Users" description={pagination ? `${pagination.total} account${pagination.total === 1 ? "" : "s"}` : "Manage customer and admin accounts"} />

            <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Input
                    label="Search"
                    icon={Search}
                    type="search"
                    value={q}
                    onChange={reset(setQ)}
                    placeholder="Name or email"
                    wrapperClassName="lg:col-span-1"
                />
                <Select label="Role" value={role} onChange={reset(setRole)}>
                    <option value="all">All roles</option>
                    <option value="user">Customers</option>
                    <option value="admin">Admins</option>
                </Select>
                <Select label="Status" value={status} onChange={reset(setStatus)}>
                    <option value="all">All statuses</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                </Select>
                <Select label="Sort by" value={sort} onChange={reset(setSort)}>
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="name">Name (A–Z)</option>
                </Select>
            </div>

            {error ? (
                <ErrorState message={error.message} onRetry={refetch} />
            ) : loading && !data ? (
                <TableSkeleton rows={8} cols={6} />
            ) : users.length === 0 ? (
                <EmptyState title="No users found" description="Try a different search or clear the filters." />
            ) : (
                <div className={loading ? "opacity-60 transition-opacity" : ""}>
                    <Table>
                        <THead>
                            <tr>
                                <Th>User</Th>
                                <Th>Role</Th>
                                <Th>Status</Th>
                                <Th className="text-right">Orders</Th>
                                <Th className="text-right">Spent</Th>
                                <Th>Joined</Th>
                                <Th className="text-right">Actions</Th>
                            </tr>
                        </THead>
                        <TBody>
                            {users.map((u) => {
                                const self = u._id === me?.id;
                                return (
                                    <Tr key={u._id}>
                                        <Td>
                                            <div className="flex items-center gap-3">
                                                {u.image ? (
                                                    <img src={u.image} alt="" className="h-9 w-9 rounded-full object-cover" />
                                                ) : (
                                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                                                        {(u.name || u.email || "U").charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold">
                                                        {u.name}
                                                        {self && <span className="ml-1.5 text-xs font-normal text-muted">(you)</span>}
                                                    </p>
                                                    <p className="truncate text-xs text-muted">{u.email}</p>
                                                </div>
                                            </div>
                                        </Td>
                                        <Td><Badge tone={u.role === "admin" ? "warning" : "neutral"}>{u.role === "admin" ? "Admin" : "Customer"}</Badge></Td>
                                        <Td><Badge tone={u.banned ? "danger" : "success"}>{u.banned ? "Blocked" : "Active"}</Badge></Td>
                                        <Td className="text-right tabular-nums">{u.orders}</Td>
                                        <Td className="text-right tabular-nums">{formatMoney(u.spent)}</Td>
                                        <Td className="whitespace-nowrap text-muted">{formatDate(u.createdAt)}</Td>
                                        <Td>
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="outline" disabled={self} onClick={() => openAction("role", u)} title={self ? "You cannot change your own account" : undefined}>
                                                    {u.role === "admin" ? "Make customer" : "Make admin"}
                                                </Button>
                                                <Button size="sm" variant={u.banned ? "secondary" : "danger-soft"} disabled={self} onClick={() => openAction(u.banned ? "unblock" : "block", u)}>
                                                    {u.banned ? "Unblock" : "Block"}
                                                </Button>
                                            </div>
                                        </Td>
                                    </Tr>
                                );
                            })}
                        </TBody>
                    </Table>
                    <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} className="mt-5" />
                </div>
            )}

            <ConfirmDialog
                open={Boolean(action) && action.type !== "block"}
                title={dialog?.title}
                message={dialog?.message}
                confirmLabel={dialog?.label}
                loading={busy}
                onConfirm={confirm}
                onCancel={() => setAction(null)}
            />

            <Modal
                open={action?.type === "block"}
                onClose={() => setAction(null)}
                title="Block this user?"
                size="sm"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setAction(null)} disabled={busy}>Cancel</Button>
                        <Button variant="danger" onClick={confirm} loading={busy}>Block user</Button>
                    </>
                }
            >
                <p className="mb-4 text-sm text-muted">{dialog?.message}</p>
                <Textarea label="Reason (optional)" rows={2} maxLength={200} value={reason} onChange={(e) => setReason(e.target.value)} />
            </Modal>
        </>
    );
}
