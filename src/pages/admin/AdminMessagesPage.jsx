import { useState } from "react";
import { Inbox, Mail, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import usePageMeta from "../../hooks/usePageMeta";
import useFetch from "../../hooks/useFetch";
import useDebounce from "../../hooks/useDebounce";
import { api, errorMessage } from "../../lib/api";
import { formatDateTime } from "../../lib/format";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Input, Select } from "../../components/ui/Input";
import { Table, THead, TBody, Tr, Th, Td } from "../../components/ui/Table";
import { TableSkeleton } from "../../components/ui/Skeleton";
import EmptyState, { ErrorState } from "../../components/ui/EmptyState";
import Pagination from "../../components/ui/Pagination";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

const STATUS = {
    new: { label: "New", tone: "warning" },
    read: { label: "Read", tone: "neutral" },
    replied: { label: "Replied", tone: "success" },
    archived: { label: "Archived", tone: "info" },
};

export default function AdminMessagesPage() {
    usePageMeta("Contact messages", "Read and manage messages sent through the contact form.");
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [busy, setBusy] = useState(false);
    const debouncedQ = useDebounce(q);

    const { data, loading, error, refetch } = useFetch("/admin/messages", {
        params: { q: debouncedQ, status, sort, page, limit: 10 },
    });
    const unread = useFetch("/admin/messages", { params: { status: "new", limit: 1 } });
    const messages = data?.data || [];
    const pagination = data?.pagination;
    const unreadCount = unread.data?.pagination?.total ?? 0;

    const reset = (setter) => (e) => {
        setter(e.target.value);
        setPage(1);
    };

    function refreshAll() {
        refetch();
        unread.refetch();
    }

    async function updateStatus(message, next, { silent = false } = {}) {
        try {
            const res = await api.patch(`/admin/messages/${message._id}`, { status: next });
            setSelected((cur) => (cur?._id === message._id ? res.data : cur));
            if (!silent) toast.success(`Marked as ${STATUS[next].label.toLowerCase()}`);
            refreshAll();
        } catch (err) {
            toast.error(errorMessage(err));
        }
    }

    function open(message) {
        setSelected(message);
        if (message.status === "new") updateStatus(message, "read", { silent: true });
    }

    async function remove() {
        setBusy(true);
        try {
            await api.del(`/admin/messages/${deleting._id}`);
            toast.success("Message deleted");
            if (selected?._id === deleting._id) setSelected(null);
            setDeleting(null);
            if (messages.length === 1 && page > 1) setPage(page - 1);
            else refreshAll();
        } catch (err) {
            toast.error(errorMessage(err));
        } finally {
            setBusy(false);
        }
    }

    return (
        <>
            <PageHeader
                title="Messages"
                description="Questions and feedback from the contact form."
                actions={unreadCount > 0 && <Badge tone="warning">{unreadCount} unread</Badge>}
            />

            <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Input label="Search" icon={Search} type="search" value={q} onChange={reset(setQ)} placeholder="Name, email or subject" />
                <Select label="Status" value={status} onChange={reset(setStatus)}>
                    <option value="all">All messages</option>
                    {Object.entries(STATUS).map(([value, s]) => <option key={value} value={value}>{s.label}</option>)}
                </Select>
                <Select label="Sort by" value={sort} onChange={reset(setSort)}>
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                </Select>
            </div>

            {error ? (
                <ErrorState message={error.message} onRetry={refetch} />
            ) : loading && !data ? (
                <TableSkeleton rows={6} cols={4} />
            ) : messages.length === 0 ? (
                <EmptyState icon={Inbox} title="No messages" description="Messages sent from the contact page will show up here." />
            ) : (
                <div className={loading ? "opacity-60 transition-opacity" : ""}>
                    <Table>
                        <THead>
                            <tr>
                                <Th>From</Th>
                                <Th>Subject</Th>
                                <Th>Received</Th>
                                <Th>Status</Th>
                                <Th className="text-right">Actions</Th>
                            </tr>
                        </THead>
                        <TBody>
                            {messages.map((m) => (
                                <Tr key={m._id}>
                                    <Td>
                                        <p className={m.status === "new" ? "font-bold" : "font-semibold"}>{m.name}</p>
                                        <p className="text-xs text-muted">{m.email}</p>
                                    </Td>
                                    <Td className="max-w-xs">
                                        <p className={`truncate ${m.status === "new" ? "font-bold" : ""}`}>{m.subject}</p>
                                        <p className="truncate text-xs text-muted">{m.message}</p>
                                    </Td>
                                    <Td className="whitespace-nowrap text-muted">{formatDateTime(m.createdAt)}</Td>
                                    <Td><Badge tone={STATUS[m.status]?.tone}>{STATUS[m.status]?.label || m.status}</Badge></Td>
                                    <Td>
                                        <div className="flex justify-end gap-1">
                                            <Button size="sm" variant="outline" onClick={() => open(m)} aria-label={`Open message from ${m.name}`}>Open</Button>
                                            <Button size="icon" variant="ghost" className="text-danger" aria-label={`Delete message from ${m.name}`} onClick={() => setDeleting(m)}><Trash2 size={17} /></Button>
                                        </div>
                                    </Td>
                                </Tr>
                            ))}
                        </TBody>
                    </Table>
                    <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} className="mt-5" />
                </div>
            )}

            <Modal
                open={Boolean(selected)}
                onClose={() => setSelected(null)}
                title={selected?.subject || "Message"}
                size="lg"
                footer={
                    selected && (
                        <>
                            <Button variant="danger-soft" onClick={() => setDeleting(selected)}><Trash2 size={16} aria-hidden="true" /> Delete</Button>
                            <a
                                href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-line bg-surface px-5 text-sm font-semibold hover:bg-surface-2"
                            >
                                <Mail size={16} aria-hidden="true" /> Reply by email
                            </a>
                            {selected.status !== "replied" && <Button onClick={() => updateStatus(selected, "replied")}>Mark replied</Button>}
                            {selected.status !== "archived" && <Button variant="secondary" onClick={() => updateStatus(selected, "archived")}>Archive</Button>}
                        </>
                    )
                }
            >
                {selected && (
                    <div className="space-y-4">
                        <dl className="grid gap-3 text-sm sm:grid-cols-2">
                            <div><dt className="text-xs uppercase tracking-wide text-muted">From</dt><dd className="font-semibold">{selected.name}</dd></div>
                            <div>
                                <dt className="text-xs uppercase tracking-wide text-muted">Email</dt>
                                <dd><a className="break-all font-semibold text-primary hover:underline" href={`mailto:${selected.email}`}>{selected.email}</a></dd>
                            </div>
                            <div><dt className="text-xs uppercase tracking-wide text-muted">Received</dt><dd>{formatDateTime(selected.createdAt)}</dd></div>
                            <div><dt className="text-xs uppercase tracking-wide text-muted">Status</dt><dd><Badge tone={STATUS[selected.status]?.tone}>{STATUS[selected.status]?.label}</Badge></dd></div>
                        </dl>
                        <p className="whitespace-pre-wrap break-words rounded-lg bg-surface-2 p-4 text-sm leading-6">{selected.message}</p>
                    </div>
                )}
            </Modal>

            <ConfirmDialog
                open={Boolean(deleting)}
                title="Delete message?"
                message="This permanently removes the message."
                confirmLabel="Delete"
                danger
                loading={busy}
                onConfirm={remove}
                onCancel={() => setDeleting(null)}
            />
        </>
    );
}
