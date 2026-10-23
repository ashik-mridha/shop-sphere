import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

/** Horizontal scroll lives inside the card so the page itself never overflows on mobile. */
export function Table({ children, className = "" }) {
    return (
        <div className={`overflow-x-auto rounded-xl border border-line bg-surface ${className}`}>
            <table className="w-full min-w-[640px] text-left text-sm">{children}</table>
        </div>
    );
}

export const THead = ({ children }) => (
    <thead className="border-b border-line bg-surface-2 text-xs uppercase tracking-wide text-muted">{children}</thead>
);

export const TBody = ({ children }) => <tbody className="divide-y divide-line">{children}</tbody>;

export const Tr = ({ children, className = "" }) => <tr className={`hover:bg-surface-2/60 ${className}`}>{children}</tr>;

export const Th = ({ children, className = "", ...props }) => (
    <th scope="col" className={`px-4 py-3 font-semibold ${className}`} {...props}>{children}</th>
);

export const Td = ({ children, className = "", ...props }) => (
    <td className={`px-4 py-3 align-middle ${className}`} {...props}>{children}</td>
);

/** sort = { field, dir: "asc" | "desc" }; onSort(field) toggles direction. */
export function SortTh({ label, field, sort, onSort, className = "" }) {
    const active = sort?.field === field;
    const Icon = !active ? ChevronsUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
    return (
        <th scope="col" aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"} className={`px-4 py-3 font-semibold ${className}`}>
            <button type="button" onClick={() => onSort(field)} className="inline-flex items-center gap-1 uppercase tracking-wide hover:text-fg">
                {label}
                <Icon size={13} aria-hidden="true" className={active ? "text-primary" : "opacity-60"} />
            </button>
        </th>
    );
}
