"use client";

import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChartData {
  type: "bar" | "line" | "pie";
  title: string;
  labels: string[];
  data: number[];
  legend?: string;
  yAxis?: string;
  colors?: string[];
}

interface InteractiveChartProps {
  chartData: ChartData;
}

const PALETTE = ["#1890FF", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4"];

export default function InteractiveChart({ chartData }: InteractiveChartProps) {
  const { type, title, labels = [], data = [], legend = "Valor", yAxis = "", colors = [] } = chartData;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const uniqueId = useId();

  if (!labels.length || !data.length) return null;

  const maxValue = Math.max(...data, 1);
  const totalValue = data.reduce((sum, val) => sum + val, 0);

  // SVG dimensions
  const width = 500;
  const height = 300;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 40;
  const paddingBottom = 40;

  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const svgRect = e.currentTarget.closest("svg")?.getBoundingClientRect();
    if (svgRect) {
      setTooltipPos({
        x: rect.left - svgRect.left + rect.width / 2,
        y: rect.top - svgRect.top - 10,
      });
    }
    setHoveredIdx(index);
  };

  const renderBarChart = () => {
    const barWidth = (plotWidth / data.length) * 0.6;
    const colWidth = plotWidth / data.length;
    const baseColor = colors[0] || "#1890FF";

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto text-current select-none">
        <defs>
          <linearGradient id={`barGrad-${uniqueId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={baseColor} />
            <stop offset="100%" stopColor={colors[1] || `${baseColor}cc`} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = paddingTop + plotHeight * (1 - ratio);
          const gridVal = (maxValue * ratio).toFixed(0);
          return (
            <g key={i} className="opacity-20">
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="currentColor"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <text
                x={paddingLeft - 8}
                y={y + 4}
                className="text-[9px] font-bold text-right fill-current"
                textAnchor="end"
              >
                {gridVal}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((val, i) => {
          const barHeight = (val / maxValue) * plotHeight;
          const x = paddingLeft + i * colWidth + (colWidth - barWidth) / 2;
          const y = paddingTop + plotHeight - barHeight;

          const isHovered = hoveredIdx === i;

          return (
            <g key={i}>
              {/* Invisible touch target bar for better hover experience */}
              <rect
                x={paddingLeft + i * colWidth}
                y={paddingTop}
                width={colWidth}
                height={plotHeight}
                fill="transparent"
                onMouseEnter={(e) => handleMouseMove(e, i)}
                onMouseMove={(e) => handleMouseMove(e, i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              />
              
              <motion.rect
                x={x}
                width={barWidth}
                rx={4}
                fill={colors.length > 1 ? colors[i % colors.length] : `url(#barGrad-${uniqueId})`}
                initial={{ height: 0, y: paddingTop + plotHeight }}
                animate={{
                  height: barHeight,
                  y: y,
                  opacity: hoveredIdx === null ? 1 : isHovered ? 1 : 0.6,
                  scaleX: isHovered ? 1.05 : 1,
                }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                style={{ transformOrigin: `${x + barWidth / 2}px ${paddingTop + plotHeight}px` }}
                pointerEvents="none"
              />

              {/* X label */}
              <text
                x={paddingLeft + i * colWidth + colWidth / 2}
                y={height - paddingBottom + 16}
                className={`text-[9px] font-bold fill-current text-center transition-opacity ${
                  isHovered ? "opacity-100" : "opacity-60"
                }`}
                textAnchor="middle"
              >
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  const renderLineChart = () => {
    const colWidth = plotWidth / (data.length - 1 || 1);
    const points = data.map((val, i) => {
      const x = paddingLeft + i * colWidth;
      const y = paddingTop + plotHeight - (val / maxValue) * plotHeight;
      return { x, y };
    });

    // Generate path
    const pathD = points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, "");

    const areaD = points.length > 0 
      ? `${pathD} L ${points[points.length - 1].x} ${paddingTop + plotHeight} L ${points[0].x} ${paddingTop + plotHeight} Z`
      : "";

    const lineColor = colors[0] || "#1890FF";

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto text-current select-none">
        <defs>
          <linearGradient id={`areaGrad-${uniqueId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = paddingTop + plotHeight * (1 - ratio);
          const gridVal = (maxValue * ratio).toFixed(0);
          return (
            <g key={i} className="opacity-20">
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="currentColor"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <text
                x={paddingLeft - 8}
                y={y + 4}
                className="text-[9px] font-bold text-right fill-current"
                textAnchor="end"
              >
                {gridVal}
              </text>
            </g>
          );
        })}

        {/* Filled gradient area */}
        {areaD && (
          <motion.path
            d={areaD}
            fill={`url(#areaGrad-${uniqueId})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            pointerEvents="none"
          />
        )}

        {/* Main Line path */}
        {pathD && (
          <motion.path
            d={pathD}
            fill="none"
            stroke={lineColor}
            strokeWidth={3}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            pointerEvents="none"
          />
        )}

        {/* Guideline when hovering */}
        {hoveredIdx !== null && (
          <line
            x1={points[hoveredIdx].x}
            y1={paddingTop}
            x2={points[hoveredIdx].x}
            y2={paddingTop + plotHeight}
            stroke={lineColor}
            strokeWidth={1}
            strokeDasharray="4 4"
            className="opacity-50"
            pointerEvents="none"
          />
        )}

        {/* Interactive nodes */}
        {points.map((p, i) => {
          const isHovered = hoveredIdx === i;
          return (
            <g key={i}>
              {/* Touch target circle */}
              <circle
                cx={p.x}
                cy={p.y}
                r={16}
                fill="transparent"
                onMouseEnter={(e) => handleMouseMove(e, i)}
                onMouseMove={(e) => handleMouseMove(e, i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              />

              {/* Visual circle point */}
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 6 : 4}
                fill={isHovered ? "#FFFFFF" : lineColor}
                stroke={lineColor}
                strokeWidth={isHovered ? 3 : 2}
                animate={{
                  scale: isHovered ? 1.2 : 1,
                }}
                pointerEvents="none"
              />

              {/* X label */}
              <text
                x={p.x}
                y={height - paddingBottom + 16}
                className={`text-[9px] font-bold fill-current text-center transition-opacity ${
                  isHovered ? "opacity-100" : "opacity-60"
                }`}
                textAnchor="middle"
              >
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  const renderPieChart = () => {
    const cx = 100;
    const cy = 100;
    const r = 85;
    const innerR = 55; // Donut style!
    const palette = colors.length > 0 ? colors : PALETTE;

    let accumulatedAngle = 0;

    return (
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-4">
        {/* SVG Donut */}
        <div className="relative w-48 h-48 md:w-56 md:h-56">
          <svg viewBox="0 0 200 200" className="w-full h-full text-current select-none">
            {data.map((val, i) => {
              const sliceAngle = (val / totalValue) * 360;
              const color = palette[i % palette.length];
              const isHovered = hoveredIdx === i;

              // Arc math
              const startAngle = accumulatedAngle;
              const endAngle = accumulatedAngle + sliceAngle;
              accumulatedAngle += sliceAngle;

              const rad = Math.PI / 180;
              const startX = cx + r * Math.cos((startAngle - 90) * rad);
              const startY = cy + r * Math.sin((startAngle - 90) * rad);
              const endX = cx + r * Math.cos((endAngle - 90) * rad);
              const endY = cy + r * Math.sin((endAngle - 90) * rad);

              const innerStartX = cx + innerR * Math.cos((startAngle - 90) * rad);
              const innerStartY = cy + innerR * Math.sin((startAngle - 90) * rad);
              const innerEndX = cx + innerR * Math.cos((endAngle - 90) * rad);
              const innerEndY = cy + innerR * Math.sin((endAngle - 90) * rad);

              const largeArcFlag = sliceAngle > 180 ? 1 : 0;

              // Donut segment path formula
              const pathD = `
                M ${startX} ${startY}
                A ${r} ${r} 0 ${largeArcFlag} 1 ${endX} ${endY}
                L ${innerEndX} ${innerEndY}
                A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}
                Z
              `;

              // Shift segment slightly outward on hover
              const bisectAngle = startAngle + sliceAngle / 2;
              const shiftX = isHovered ? 4 * Math.cos((bisectAngle - 90) * rad) : 0;
              const shiftY = isHovered ? 4 * Math.sin((bisectAngle - 90) * rad) : 0;

              return (
                <g key={i} className="cursor-pointer">
                  <motion.path
                    d={pathD}
                    fill={color}
                    animate={{
                      x: shiftX,
                      y: shiftY,
                      opacity: hoveredIdx === null ? 1 : isHovered ? 1 : 0.75,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const svgRect = e.currentTarget.closest("svg")?.getBoundingClientRect();
                      if (svgRect) {
                        setTooltipPos({
                          x: rect.left - svgRect.left + rect.width / 2,
                          y: rect.top - svgRect.top - 5,
                        });
                      }
                      setHoveredIdx(i);
                    }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const svgRect = e.currentTarget.closest("svg")?.getBoundingClientRect();
                      if (svgRect) {
                        setTooltipPos({
                          x: rect.left - svgRect.left + rect.width / 2,
                          y: rect.top - svgRect.top - 5,
                        });
                      }
                      setHoveredIdx(i);
                    }}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Center Info Text inside the Donut hole */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-4">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
              {hoveredIdx !== null ? labels[hoveredIdx] : "Total"}
            </span>
            <motion.span 
              key={hoveredIdx !== null ? `val-${hoveredIdx}` : "total-val"}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-lg md:text-xl font-serif font-bold text-slate-900 dark:text-white mt-0.5"
            >
              {hoveredIdx !== null ? data[hoveredIdx] : totalValue}
            </motion.span>
            <span className="text-[9px] font-semibold text-slate-400">
              {hoveredIdx !== null 
                ? `${((data[hoveredIdx] / totalValue) * 100).toFixed(1)}%`
                : legend
              }
            </span>
          </div>
        </div>

        {/* Legend sidebar */}
        <div className="flex flex-col gap-2.5 max-w-[200px] select-none text-left">
          {labels.map((lbl, i) => {
            const isHovered = hoveredIdx === i;
            const color = palette[i % palette.length];
            return (
              <div 
                key={i} 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  isHovered ? "bg-slate-100/50 border-slate-200" : "bg-transparent border-transparent"
                }`}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-xs font-bold truncate max-w-[130px]">{lbl}</span>
                <span className="text-xs font-serif font-bold text-slate-400 ml-auto">{data[i]}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="my-10 border border-slate-200/50 rounded-2xl p-6 bg-slate-50/30 backdrop-blur-sm relative group overflow-hidden">
      
      {/* Title */}
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-serif font-bold text-base md:text-lg text-slate-950 dark:text-white m-0">
          {title}
        </h4>
        {yAxis && (
          <span className="text-[9px] font-bold tracking-widest uppercase text-slate-400">
            Eje Y: {yAxis}
          </span>
        )}
      </div>

      {/* Rendering target chart type */}
      {type === "bar" && renderBarChart()}
      {type === "line" && renderLineChart()}
      {type === "pie" && renderPieChart()}

      {/* Floating Tooltip (for Bar & Line charts) */}
      <AnimatePresence>
        {hoveredIdx !== null && type !== "pie" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y,
              transform: "translate(-50%, -100%)",
            }}
            className="absolute z-50 bg-slate-950 border border-white/10 text-white rounded-xl shadow-xl px-3 py-2 text-left pointer-events-none select-none"
          >
            <p className="text-[9px] font-bold tracking-wider uppercase text-slate-400 m-0 leading-none">
              {labels[hoveredIdx]}
            </p>
            <p className="text-xs font-bold m-0 mt-1 flex items-center gap-1.5 leading-none">
              <span className="text-[#1890FF]">{legend}:</span>
              <span>{data[hoveredIdx]}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
