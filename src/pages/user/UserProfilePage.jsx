import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { fileToAvatarDataUrl } from "../../components/account/avatar";
import PasswordInput from "../../components/auth/PasswordInput";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import PageHeader from "../../components/ui/PageHeader";
import useAuth from "../../hooks/useAuth";
import usePageMeta from "../../hooks/usePageMeta";
import { authClient } from "../../lib/auth-client";
import { formatDate } from "../../lib/format";

const profileSchema = z.object({ name: z.string().trim().min(2, "Enter your name").max(80) });

const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, "Enter your current password"),
        newPassword: z.string().min(8, "Use at least 8 characters").max(128),
        confirm: z.string(),
    })
    .refine((v) => v.newPassword === v.confirm, { message: "Passwords do not match", path: ["confirm"] })
    .refine((v) => v.newPassword !== v.currentPassword, { message: "Choose a different password", path: ["newPassword"] });

function ProfileForm({ user, refreshSession }) {
    const fileRef = useRef(null);
    const [image, setImage] = useState(user.image || null);
    const [imageError, setImageError] = useState("");
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: { name: user.name || "" },
    });

    async function pick(e) {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        setImageError("");
        try {
            setImage(await fileToAvatarDataUrl(file));
        } catch (err) {
            setImageError(err.message);
        }
    }

    async function onSubmit(values) {
        const res = await authClient.updateUser({ name: values.name, image: image || null });
        if (res?.error) {
            toast.error(res.error.message || "Could not update your profile.");
            return;
        }
        await refreshSession();
        toast.success("Profile updated");
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <div className="flex flex-wrap items-center gap-4">
                {image ? (
                    <img src={image} alt={`${user.name}’s avatar`} className="h-20 w-20 rounded-full object-cover ring-2 ring-line" />
                ) : (
                    <span aria-hidden="true" className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-fg">
                        {(user.name || user.email || "U").charAt(0).toUpperCase()}
                    </span>
                )}
                <div>
                    <input ref={fileRef} id="avatar-file" type="file" accept="image/*" className="sr-only" onChange={pick} />
                    <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}><Camera size={15} aria-hidden="true" /> Change photo</Button>
                        {image && <Button size="sm" variant="ghost" onClick={() => setImage(null)}><Trash2 size={15} aria-hidden="true" /> Remove</Button>}
                    </div>
                    <p className="mt-1.5 text-xs text-muted">Square JPG, PNG or WebP. It is resized to 256 px automatically.</p>
                    {imageError && <p role="alert" className="mt-1 text-xs font-medium text-danger">{imageError}</p>}
                </div>
            </div>

            <Input label="Full name" autoComplete="name" required error={errors.name?.message} {...register("name")} />
            <Input label="Email" type="email" value={user.email} readOnly hint="Your email is used to sign in and can’t be changed here." />
            <Button type="submit" loading={isSubmitting}>Save changes</Button>
        </form>
    );
}

function PasswordForm() {
    const [serverError, setServerError] = useState("");
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: { currentPassword: "", newPassword: "", confirm: "" },
    });

    async function onSubmit(values) {
        setServerError("");
        const res = await authClient.changePassword({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
            revokeOtherSessions: true,
        });
        if (res?.error) {
            setServerError(res.error.message || "Could not change your password.");
            return;
        }
        reset();
        toast.success("Password changed. Other devices were signed out.");
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {serverError && (
                <div role="alert" className="rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">{serverError}</div>
            )}
            <PasswordInput label="Current password" autoComplete="current-password" error={errors.currentPassword?.message} {...register("currentPassword")} />
            <PasswordInput label="New password" autoComplete="new-password" hint="At least 8 characters" error={errors.newPassword?.message} {...register("newPassword")} />
            <PasswordInput label="Confirm new password" autoComplete="new-password" error={errors.confirm?.message} {...register("confirm")} />
            <Button type="submit" loading={isSubmitting}>Update password</Button>
        </form>
    );
}

export default function UserProfilePage() {
    usePageMeta("My profile", "Update your name, photo and password.");
    const { user, isAdmin, refreshSession } = useAuth();
    if (!user) return null;

    return (
        <div>
            <PageHeader title="My profile" description="Manage how you appear and keep your account secure." />
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="space-y-6">
                    <Card>
                        <h2 className="mb-4 text-lg font-bold">Personal details</h2>
                        <ProfileForm key={user.id} user={user} refreshSession={refreshSession} />
                    </Card>
                    <Card>
                        <h2 className="mb-1 text-lg font-bold">Change password</h2>
                        <p className="mb-4 text-sm text-muted">If you signed up with Google you may not have a password to change.</p>
                        <PasswordForm />
                    </Card>
                </div>

                <aside>
                    <Card>
                        <h2 className="mb-4 text-lg font-bold">Account</h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex items-center justify-between"><dt className="text-muted">Role</dt><dd><Badge tone={isAdmin ? "warning" : "primary"}>{isAdmin ? "Administrator" : "Customer"}</Badge></dd></div>
                            <div className="flex items-center justify-between"><dt className="text-muted">Member since</dt><dd className="font-semibold">{formatDate(user.createdAt)}</dd></div>
                            <div className="flex items-center justify-between"><dt className="text-muted">Email verified</dt><dd className="font-semibold">{user.emailVerified ? "Yes" : "No"}</dd></div>
                        </dl>
                    </Card>
                </aside>
            </div>
        </div>
    );
}
