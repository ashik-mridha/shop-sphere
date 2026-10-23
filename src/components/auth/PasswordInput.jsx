import { useId, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Field } from "../ui/Input";

export default function PasswordInput({ label, error, hint, id, ...props }) {
    const auto = useId();
    const fieldId = id || auto;
    const [show, setShow] = useState(false);
    return (
        <Field label={label} id={fieldId} error={error} hint={hint}>
            <div className="relative">
                <Lock size={18} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                    id={fieldId}
                    type={show ? "text" : "password"}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
                    {...props}
                    className={`h-11 w-full rounded-lg border bg-surface pl-10 pr-11 text-sm transition-colors focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${error ? "border-danger" : "border-line"}`}
                />
                <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? "Hide password" : "Show password"}
                    aria-pressed={show}
                    className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:bg-surface-2"
                >
                    {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
            </div>
        </Field>
    );
}
