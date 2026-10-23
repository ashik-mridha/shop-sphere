import { useId } from "react";

const control =
    "w-full rounded-lg border bg-surface text-fg placeholder:text-muted/70 transition-colors " +
    "focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 " +
    "disabled:cursor-not-allowed disabled:opacity-60";

export function Field({ label, id, error, hint, required, className = "", children }) {
    return (
        <div className={className}>
            {label && (
                <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-fg">
                    {label}
                    {required && <span className="text-danger" aria-hidden="true"> *</span>}
                </label>
            )}
            {children}
            {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">{hint}</p>}
            {error && (
                <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-danger">
                    {error}
                </p>
            )}
        </div>
    );
}

function useFieldProps(id, error, hint) {
    const auto = useId();
    const fieldId = id || auto;
    return {
        fieldId,
        aria: {
            id: fieldId,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined,
        },
    };
}

export function Input({ label, error, hint, icon: Icon, required, id, className = "", wrapperClassName = "", ...props }) {
    const { fieldId, aria } = useFieldProps(id, error, hint);
    return (
        <Field label={label} id={fieldId} error={error} hint={hint} required={required} className={wrapperClassName}>
            <div className="relative">
                {Icon && <Icon size={18} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />}
                <input
                    required={required}
                    {...aria}
                    {...props}
                    className={`${control} h-11 px-3.5 text-sm ${Icon ? "pl-10" : ""} ${error ? "border-danger" : "border-line"} ${className}`}
                />
            </div>
        </Field>
    );
}

export function Textarea({ label, error, hint, required, id, className = "", wrapperClassName = "", rows = 4, ...props }) {
    const { fieldId, aria } = useFieldProps(id, error, hint);
    return (
        <Field label={label} id={fieldId} error={error} hint={hint} required={required} className={wrapperClassName}>
            <textarea
                rows={rows}
                required={required}
                {...aria}
                {...props}
                className={`${control} px-3.5 py-3 text-sm ${error ? "border-danger" : "border-line"} ${className}`}
            />
        </Field>
    );
}

export function Select({ label, error, hint, required, id, className = "", wrapperClassName = "", children, ...props }) {
    const { fieldId, aria } = useFieldProps(id, error, hint);
    return (
        <Field label={label} id={fieldId} error={error} hint={hint} required={required} className={wrapperClassName}>
            <select
                required={required}
                {...aria}
                {...props}
                className={`${control} h-11 px-3 text-sm ${error ? "border-danger" : "border-line"} ${className}`}
            >
                {children}
            </select>
        </Field>
    );
}

export function Checkbox({ label, id, className = "", ...props }) {
    const auto = useId();
    const fieldId = id || auto;
    return (
        <label htmlFor={fieldId} className={`flex cursor-pointer items-center gap-2.5 text-sm ${className}`}>
            <input id={fieldId} type="checkbox" className="h-4 w-4 rounded border-line accent-[var(--primary)]" {...props} />
            <span>{label}</span>
        </label>
    );
}
