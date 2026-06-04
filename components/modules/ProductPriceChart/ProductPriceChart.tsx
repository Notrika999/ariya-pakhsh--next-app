"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export type PriceChartItem = {
  date: string;
  price: number;
  originalPrice?: number;
  isAvailable: boolean;
};

type Props = { data: PriceChartItem[] };

const MARGIN = { top: 20, right: 10, bottom: 40, left: 20 };
const AVAILABLE_COLOR = "#2563eb";
const UNAVAILABLE_COLOR = "#9ca3af";
const ORIGINAL_COLOR = "#9ca3af";

function formatM(v: number) {
  return `${(v / 1_000_000).toFixed(0)}M`;
}

export default function ProductPriceChart({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 320 });

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setSize({ width, height: 320 });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const lastPrice = data?.[data.length - 1]?.price ?? 0;
  const hasOriginalPrice = data.some(
    (d) => d.originalPrice != null && d.originalPrice !== d.price,
  );

  const { width, height } = size;
  const innerW = width - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;

  // ─── scales ───────────────────────────────────────────────────────────────
  const prices = data.flatMap((d) =>
    [d.price, d.originalPrice].filter(Boolean),
  ) as number[];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;
  const paddedMin = minPrice - priceRange * 0.1;
  const paddedMax = maxPrice + priceRange * 0.1;

  const xScale = useCallback(
    (i: number) => {
      if (data.length <= 1) return innerW / 2;
      return (i / (data.length - 1)) * innerW;
    },
    [data.length, innerW],
  );

  const yScale = useCallback(
    (v: number) =>
      innerH - ((v - paddedMin) / (paddedMax - paddedMin)) * innerH,
    [innerH, paddedMin, paddedMax],
  );

  // ─── build points ─────────────────────────────────────────────────────────
  const points = data.map((d, i) => ({
    x: xScale(i),
    y: yScale(d.price),
    origY: d.originalPrice != null ? yScale(d.originalPrice) : null,
    isAvailable: d.isAvailable,
    label: d.date,
    price: d.price,
    originalPrice: d.originalPrice,
  }));

  // ─── Y axis ticks ─────────────────────────────────────────────────────────
  const tickCount = 5;
  const yTicks = Array.from({ length: tickCount }, (_, i) => {
    const v = paddedMin + ((paddedMax - paddedMin) / (tickCount - 1)) * i;
    return { v, y: yScale(v) };
  });

  // ─── Tooltip state ────────────────────────────────────────────────────────
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    idx: number;
  } | null>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!points.length) return;
      const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
      const mx = e.clientX - rect.left - MARGIN.left;
      let closest = 0;
      let minDist = Infinity;
      points.forEach((p, i) => {
        const d = Math.abs(p.x - mx);
        if (d < minDist) {
          minDist = d;
          closest = i;
        }
      });
      setTooltip({ x: points[closest].x, y: points[closest].y, idx: closest });
    },
    [points],
  );

  // ─── SVG path builders ────────────────────────────────────────────────────
  function buildPath(pts: { x: number; y: number }[]) {
    if (!pts.length) return "";
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  }

  // خط originalPrice
  const origPoints = points
    .filter((p) => p.origY != null)
    .map((p) => ({ x: p.x, y: p.origY! }));

  return (
    <div className="w-full bg-white dark:bg-zinc-900 p-5" dir="rtl">
      {/* آخرین قیمت */}
      <div className="mb-4 text-left">
        <span className="block text-xs text-gray-400">آخرین قیمت</span>
        <span className="font-extrabold text-red-500 text-lg">
          {Number(lastPrice).toLocaleString("fa-IR")} تومان
        </span>
      </div>

      {/* Chart container */}
      <div ref={containerRef} className="w-full" style={{ height }}>
        {width > 0 && (
          <svg
            width={width}
            height={height}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setTooltip(null)}
            style={{ overflow: "visible" }}
          >
            <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
              {/* ─── Grid lines ─── */}
              {yTicks.map((t, i) => (
                <line
                  key={i}
                  x1={0}
                  y1={t.y}
                  x2={innerW}
                  y2={t.y}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
              ))}

              {/* ─── Y Axis labels (سمت چپ) ─── */}
              {yTicks.map((t, i) => (
                <text
                  key={i}
                  x={-20}
                  y={t.y + 4}
                  fontSize={11}
                  fill="#9ca3af"
                  textAnchor="end"
                >
                  {formatM(t.v)}
                </text>
              ))}

              {/* ─── X Axis labels ─── */}
              {points.map((p, i) => {
                if (i !== 0) return null; // فقط اولین
                return (
                  <text
                    key={i}
                    x={p.x}
                    y={innerH + 24}
                    fontSize={11}
                    fill="#9ca3af"
                    textAnchor="middle"
                  >
                    {p.label}
                  </text>
                );
              })}

              {/* ─── originalPrice dashed line ─── */}
              {hasOriginalPrice && origPoints.length > 1 && (
                <path
                  d={buildPath(origPoints)}
                  fill="none"
                  stroke={ORIGINAL_COLOR}
                  strokeWidth={1.5}
                  strokeDasharray="6 5"
                />
              )}

              {/* ─── Segmented price line (آبی/خاکستری) ─── */}
              {points.map((p, i) => {
                if (i === 0) return null;
                const prev = points[i - 1];
                const color = prev.isAvailable
                  ? AVAILABLE_COLOR
                  : UNAVAILABLE_COLOR;
                return (
                  <line
                    key={i}
                    x1={prev.x}
                    y1={prev.y}
                    x2={p.x}
                    y2={p.y}
                    stroke={color}
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                );
              })}

              {/* ─── Tooltip cursor line ─── */}
              {tooltip && (
                <>
                  <line
                    x1={tooltip.x}
                    y1={0}
                    x2={tooltip.x}
                    y2={innerH}
                    stroke="#ef4444"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                  />

                  {/* label روز زیر cursor line */}
                  <text
                    x={tooltip.x}
                    y={innerH + 24}
                    fontSize={11}
                    fill="#374151"
                    textAnchor="middle"
                    fontWeight={600}
                  >
                    {points[tooltip.idx].label}
                  </text>

                  <circle
                    cx={tooltip.x}
                    cy={tooltip.y}
                    r={4}
                    fill={
                      points[tooltip.idx].isAvailable
                        ? AVAILABLE_COLOR
                        : UNAVAILABLE_COLOR
                    }
                    stroke="white"
                    strokeWidth={2}
                  />

                  {/* Tooltip box */}
                  {(() => {
                    const pt = points[tooltip.idx];
                    const boxW = 180;
                    const boxH =
                      pt.originalPrice != null && pt.originalPrice !== pt.price
                        ? 150
                        : 170;
                    let bx = tooltip.x + 12;
                    if (bx + boxW > innerW) bx = tooltip.x - boxW - 12;
                    const by = Math.max(0, tooltip.y - boxH / 2);

                    return (
                      <foreignObject x={bx} y={by} width={boxW} height={boxH}>
                        <div
                          style={
                            {
                              background: "white",
                              border: "1px solid #f3f4f6",
                              borderRadius: 8,
                              padding: "10px 14px",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                              direction: "rtl",
                              fontSize: 13,
                            } as React.CSSProperties
                          }
                        >
                          <div style={{ color: "#9ca3af", marginBottom: 6 }}>
                            {pt.label}
                          </div>
                          <div style={{ color: "#ef4444", fontWeight: 800 }}>
                            {Number(pt.price).toLocaleString("fa-IR")} تومان
                          </div>
                          {pt.originalPrice != null &&
                            pt.originalPrice !== pt.price && (
                              <div style={{ color: "#9ca3af", marginTop: 4 }}>
                                بدون تخفیف:{" "}
                                {Number(pt.originalPrice).toLocaleString(
                                  "fa-IR",
                                )}{" "}
                                تومان
                              </div>
                            )}
                          <div style={{ color: "#9ca3af", marginTop: 4 }}>
                            وضعیت: {pt.isAvailable ? "موجود" : "ناموجود"}
                          </div>
                        </div>
                      </foreignObject>
                    );
                  })()}
                </>
              )}
            </g>
          </svg>
        )}
      </div>

      {/* ─── Legend ─── */}
      <div className="mt-4 flex items-center justify-start gap-6 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-8 rounded"
            style={{ height: 2.5, background: AVAILABLE_COLOR }}
          />
          <span>قیمت (موجود)</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-8 rounded"
            style={{ height: 2.5, background: UNAVAILABLE_COLOR }}
          />
          <span>قیمت (ناموجود)</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="30" height="4" style={{ overflow: "visible" }}>
            <line
              x1="0"
              y1="2"
              x2="30"
              y2="2"
              stroke={ORIGINAL_COLOR}
              strokeWidth="2"
              strokeDasharray="5 4"
            />
          </svg>
          <span>قیمت بدون تخفیف</span>
        </div>
      </div>
    </div>
  );
}
