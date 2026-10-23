import { useState } from "react";
import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import AddressForm from "../../components/account/AddressForm";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import EmptyState, { ErrorState } from "../../components/ui/EmptyState";
import Modal from "../../components/ui/Modal";
import PageHeader from "../../components/ui/PageHeader";
import Skeleton from "../../components/ui/Skeleton";
import useFetch from "../../hooks/useFetch";
import usePageMeta from "../../hooks/usePageMeta";
import { api, errorMessage } from "../../lib/api";
import { COUNTRIES } from "../../lib/format";

export default function UserAddressesPage() {
    usePageMeta("My addresses", "Save and manage your shipping addresses for faster checkout.");
    const { data, loading, error, refetch } = useFetch("/addresses");
    const addresses = data?.data || [];
    const [editing, setEditing] = useState(null); // null | "new" | address
    const [removing, setRemoving] = useState(null);
    const [saving, setSaving] = useState(false);
    const [busy, setBusy] = useState(false);

    async function save(values) {
        setSaving(true);
        try {
            const payload = { ...values, label: values.label || "Home", line2: values.line2 || "", isDefault: Boolean(values.isDefault) };
            if (editing === "new") await api.post("/addresses", payload);
            else await api.patch(`/addresses/${editing._id}`, payload);
            toast.success(editing === "new" ? "Address saved" : "Address updated");
            setEditing(null);
            refetch();
        } catch (err) {
            toast.error(errorMessage(err));
        } finally {
            setSaving(false);
        }
    }

    async function makeDefault(address) {
        try {
            await api.patch(`/addresses/${address._id}`, { isDefault: true });
            toast.success("Default address updated");
            refetch();
        } catch (err) {
            toast.error(errorMessage(err));
        }
    }

    async function remove() {
        setBusy(true);
        try {
            await api.del(`/addresses/${removing._id}`);
            toast.success("Address removed");
            setRemoving(null);
            refetch();
        } catch (err) {
            toast.error(errorMessage(err));
        } finally {
            setBusy(false);
        }
    }

    return (
        <div>
            <PageHeader
                title="Addresses"
                description="Saved addresses can be picked at checkout."
                actions={<Button onClick={() => setEditing("new")}><Plus size={16} aria-hidden="true" /> Add address</Button>}
            />

            {error ? (
                <ErrorState message={error.message} onRetry={refetch} />
            ) : loading && !data ? (
                <div className="grid gap-4 md:grid-cols-2">{[0, 1].map((i) => <Skeleton key={i} className="h-44" />)}</div>
            ) : addresses.length === 0 ? (
                <EmptyState
                    icon={MapPin}
                    title="No saved addresses"
                    description="Add an address now to speed up your next checkout."
                    action={<Button onClick={() => setEditing("new")}>Add your first address</Button>}
                />
            ) : (
                <ul className="grid gap-4 md:grid-cols-2">
                    {addresses.map((a) => (
                        <li key={a._id}>
                            <Card className="flex h-full flex-col">
                                <div className="flex items-center justify-between gap-2">
                                    <h2 className="font-bold">{a.label || "Address"}</h2>
                                    {a.isDefault && <Badge tone="primary">Default</Badge>}
                                </div>
                                <address className="mt-3 flex-1 text-sm not-italic leading-6 text-muted">
                                    <span className="font-semibold text-fg">{a.fullName}</span><br />
                                    {a.line1}{a.line2 ? `, ${a.line2}` : ""}<br />
                                    {a.city}, {a.state} {a.postalCode}<br />
                                    {COUNTRIES.find(([c]) => c === a.country)?.[1] || a.country}<br />
                                    {a.phone}
                                </address>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <Button size="sm" variant="outline" onClick={() => setEditing(a)}><Pencil size={14} aria-hidden="true" /> Edit</Button>
                                    {!a.isDefault && <Button size="sm" variant="outline" onClick={() => makeDefault(a)}><Star size={14} aria-hidden="true" /> Make default</Button>}
                                    <Button size="sm" variant="danger-soft" onClick={() => setRemoving(a)} aria-label={`Delete ${a.label || "address"}`}><Trash2 size={14} aria-hidden="true" /> Delete</Button>
                                </div>
                            </Card>
                        </li>
                    ))}
                </ul>
            )}

            <Modal
                open={Boolean(editing)}
                onClose={() => !saving && setEditing(null)}
                title={editing === "new" ? "Add address" : "Edit address"}
                size="lg"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setEditing(null)} disabled={saving}>Cancel</Button>
                        <Button type="submit" form="address-form" loading={saving}>Save address</Button>
                    </>
                }
            >
                {editing && <AddressForm key={editing === "new" ? "new" : editing._id} formId="address-form" address={editing === "new" ? null : editing} onSubmit={save} />}
            </Modal>

            <ConfirmDialog
                open={Boolean(removing)}
                title="Delete this address?"
                message="This address will be removed from your account. Past orders are not affected."
                confirmLabel="Delete"
                danger
                loading={busy}
                onConfirm={remove}
                onCancel={() => setRemoving(null)}
            />
        </div>
    );
}
