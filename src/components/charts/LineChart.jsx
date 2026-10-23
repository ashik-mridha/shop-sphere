import { useState } from "react";

const W = 600;
const H = 220;
const PAD = { top: 16, right: 12, bottom: 28, left: 52 };

function niceMax(max) {
    if (max <= 0) return 1;
    const pow = 10 ** Math.floor(Math.log10(max));
    const n = max / pow;
    return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
}

/** data: [{ label, value }] – label is shown on the x axis (sampled) and in the tooltip. */
export default function LineChart({ data, ariaLabel, formatValue = String, formatTick = formatValue }) {
    const [active, setActive] = useState(null);
    const max = niceMax(Math.max(0, ...data.map((d) => d.value)));
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const x = (i) => PAD.left + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
    const y = (v) => PAD.top + innerH - (v / max) * innerH;
    const points = data.map((d, i) => `${x(i)},${y(d.value)}`);
    const area = data.length ? `M${x(0)},${y(0)} L${points.join(" L")} L${x(data.length - 1)},${y(0)} Z` : "";
    const step = Math.max(1, Math.ceil(data.length / 6));
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);

    function onMove(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const px = ((e.clientX - rect.left) / rect.width) * W;
        const i = Math.round(((px - PAD.left) / innerW) * (data.length - 1));
        setActive(Math.min(data.length - 1, Math.max(0, i)));
    }

    const a = active != null ? data[active] : null;

    return (
        <div className="relative">
            <svg
                viewBox={`0 0 ${W} ${H}`}
                role="img"
                aria-label={ariaLabel}
                tabIndex={0}
                className="h-auto w-full"
                onPointerMove={onMove}
                onPointerLeave={() => setActive(null)}
                onBlur={() => setActive(null)}
                onKeyDown={(e) => {
                    if (e.key === "ArrowRight") setActive((i) => Math.min(data.length - 1, (i ?? -1) + 1));
                    if (e.key === "ArrowLeft") setActive((i) => Math.max(0, (i ?? data.length) - 1));
                }}
            >
                {ticks.map((t) => (
                    <g key={t}>
                        <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeWidth="1" />
                        <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--muted)">{formatTick(t)}</text>
                    </g>
                ))}
                {data.map((d, i) => i % step === 0 && (
                    <text key={d.label} x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--muted)">{d.label}</text>
                ))}
                <path d={area} fill="var(--primary)" opacity="0.12" />
                <polyline points={points.join(" ")} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                {a && (
                    <g>
                        <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={PAD.top + innerH} stroke="var(--muted)" strokeDasharray="3 3" />
                        <circle cx={x(active)} cy={y(a.value)} r="5" fill="var(--primary)" stroke="var(--surface)" strokeWidth="2" />
                    </g>
                )}
            </svg>
            {a && (
                <div
                    className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs shadow-lg"
                    style={{ left: `${Math.min(88, Math.max(12, (x(active) / W) * 100))}%` }}
                >
                    <p className="text-muted">{a.fullLabel || a.label}</p>
                    <p className="font-bold">{formatValue(a.value)}</p>
                </div>
            )}
            <table className="sr-only">
                <caption>{ariaLabel}</caption>
                <tbody>
                    {data.map((d) => (
                        <tr key={d.label}><th scope="row">{d.fullLabel || d.label}</th><td>{formatValue(d.value)}</td></tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
