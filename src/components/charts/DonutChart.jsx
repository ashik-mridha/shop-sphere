/** data: [{ label, value, color }] – color is a CSS value such as "var(--primary)". Legend doubles as the value list. */
export default function DonutChart({ data, ariaLabel, centerLabel = "Total" }) {
    const total = data.reduce((s, d) => s + d.value, 0);
    const R = 60;
    const C = 2 * Math.PI * R;
    let offset = 0;

    return (
        <div className="flex flex-col items-center gap-5 sm:flex-row">
            <svg viewBox="0 0 160 160" role="img" aria-label={ariaLabel} className="h-40 w-40 shrink-0 -rotate-90">
                <circle cx="80" cy="80" r={R} fill="none" stroke="var(--line)" strokeWidth="22" />
                {total > 0 && data.map((d) => {
                    const len = (d.value / total) * C;
                    const seg = (
                        <circle
                            key={d.label}
                            cx="80"
                            cy="80"
                            r={R}
                            fill="none"
                            stroke={d.color}
                            strokeWidth="22"
                            strokeDasharray={`${len} ${C - len}`}
                            strokeDashoffset={-offset}
                        >
                            <title>{`${d.label}: ${d.value}`}</title>
                        </circle>
                    );
                    offset += len;
                    return seg;
                })}
                <g className="rotate-90" style={{ transformOrigin: "80px 80px" }}>
                    <text x="80" y="80" textAnchor="middle" fontSize="24" fontWeight="700" fill="var(--fg)">{total}</text>
                    <text x="80" y="98" textAnchor="middle" fontSize="11" fill="var(--muted)">{centerLabel}</text>
                </g>
            </svg>
            <ul className="w-full min-w-0 flex-1 space-y-2 text-sm">
                {data.map((d) => (
                    <li key={d.label} className="flex items-center justify-between gap-3">
                        <span className="flex min-w-0 items-center gap-2">
                            <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: d.color }} aria-hidden="true" />
                            <span className="truncate">{d.label}</span>
                        </span>
                        <span className="font-semibold">
                            {d.value} <span className="font-normal text-muted">({total ? Math.round((d.value / total) * 100) : 0}%)</span>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
