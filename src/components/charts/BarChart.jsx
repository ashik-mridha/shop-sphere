import { useState } from "react";

const W = 600;
const H = 220;
const PAD = { top: 16, right: 12, bottom: 34, left: 52 };

function niceMax(max) {
    if (max <= 0) return 1;
    const pow = 10 ** Math.floor(Math.log10(max));
    const n = max / pow;
    return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
}

/** data: [{ label, value }] */
export default function BarChart({ data, ariaLabel, formatValue = String, formatTick = formatValue }) {
    const [active, setActive] = useState(null);
    const max = niceMax(Math.max(0, ...data.map((d) => d.value)));
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const slot = innerW / Math.max(1, data.length);
    const barW = Math.min(56, slot * 0.6);
    const y = (v) => PAD.top + innerH - (v / max) * innerH;
    const ticks = [0, 0.5, 1].map((t) => t * max);
    const a = active != null ? data[active] : null;

    return (
        <div className="relative">
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel} className="h-auto w-full">
                {ticks.map((t) => (
                    <g key={t}>
                        <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--line)" />
                        <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--muted)">{formatTick(t)}</text>
                    </g>
                ))}
                {data.map((d, i) => {
                    const cx = PAD.left + slot * i + slot / 2;
                    return (
                        <g key={d.label} onPointerEnter={() => setActive(i)} onPointerLeave={() => setActive(null)}>
                            <rect x={cx - slot / 2} y={PAD.top} width={slot} height={innerH} fill="transparent" />
                            <rect
                                x={cx - barW / 2}
                                y={y(d.value)}
                                width={barW}
                                height={Math.max(0, PAD.top + innerH - y(d.value))}
                                rx="4"
                                fill="var(--primary)"
                                opacity={active == null || active === i ? 1 : 0.55}
                            />
                            <text x={cx} y={H - 12} textAnchor="middle" fontSize="11" fill="var(--muted)">
                                {d.label.length > 12 ? `${d.label.slice(0, 11)}…` : d.label}
                            </text>
                        </g>
                    );
                })}
            </svg>
            {a && (
                <div
                    className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs shadow-lg"
                    style={{ left: `${Math.min(88, Math.max(12, ((PAD.left + slot * active + slot / 2) / W) * 100))}%` }}
                >
                    <p className="text-muted">{a.label}</p>
                    <p className="font-bold">{formatValue(a.value)}</p>
                </div>
            )}
            <table className="sr-only">
                <caption>{ariaLabel}</caption>
                <tbody>
                    {data.map((d) => (
                        <tr key={d.label}><th scope="row">{d.label}</th><td>{formatValue(d.value)}</td></tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
