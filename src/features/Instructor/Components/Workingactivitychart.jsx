import { useState } from "react";

const monthlyData = [
  { month: "Jan", hired: 40, applicationAnswered: 50, applicationSent: 25 },
  { month: "Feb", hired: 50, applicationAnswered: 50, applicationSent: 25 },
  { month: "Mar", hired: 10, applicationAnswered: 40, applicationSent: 45 },
  { month: "Apr", hired: 10, applicationAnswered: 40, applicationSent: 45 },
  { month: "May", hired: 45, applicationAnswered: 10, applicationSent: 45 },
  { month: "Jun", hired: 65, applicationAnswered: 30, applicationSent: 35 },
  { month: "Jul", hired: 5,  applicationAnswered: 70, applicationSent: 55 },
  { month: "Aug", hired: 10, applicationAnswered: 65, applicationSent: 55 },
  { month: "Sep", hired: 50, applicationAnswered: 30, applicationSent: 40 },
  { month: "Oct", hired: 35, applicationAnswered: 40, applicationSent: 10 },
  { month: "Nov", hired: 30, applicationAnswered: 45, applicationSent: 15 },
  { month: "Dec", hired: 10, applicationAnswered: 50, applicationSent: 60 },
];

const Y_MAX = 160;
const Y_TICKS = [0, 40, 80, 120, 160];

const CHUNK_META = {
  hired: {
    label: "Hired",
    colorClass: "bg-slate-300 dark:bg-slate-500",
    dotClass: "bg-slate-400",
  },
  applicationAnswered: {
    label: "Application Answered",
    colorClass: "bg-secondary",
    dotClass: "bg-secondary",
  },
  applicationSent: {
    label: "Application Sent",
    colorClass: "bg-primary",
    dotClass: "bg-primary",
  },
};

export default function WorkActivity() {
  const [tooltip, setTooltip] = useState(null);

  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-2xl p-6 w-full shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-header-text font-semibold text-lg">Working Activity</h2>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-primary inline-block" />
            <span className="text-content-text text-xs">Application Sent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-400 inline-block" />
            <span className="text-content-text text-xs">Application Answered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-500 inline-block" />
            <span className="text-content-text text-xs">Hired</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative flex gap-2">
        {/* Y-axis */}
        <div className="flex flex-col-reverse justify-between h-56 pr-2 shrink-0">
          {Y_TICKS.map((tick) => (
            <span key={tick} className="text-content-text text-xs leading-none">
              {tick}
            </span>
          ))}
        </div>

        {/* Bars + X labels */}
        <div className="flex-1 flex flex-col">
          <div className="relative h-56">
            {/* Grid lines */}
            {Y_TICKS.map((tick) => (
              <div
                key={tick}
                className="absolute left-0 right-0 border-t border-dashed border-slate-200 dark:border-slate-600/40"
                style={{ bottom: `${(tick / Y_MAX) * 100}%` }}
              />
            ))}

            {/* Bars */}
            <div className="absolute inset-0 flex items-end justify-around gap-1 px-1">
              {monthlyData.map((d, i) => {
                const total = d.hired + d.applicationAnswered + d.applicationSent;
                const totalPct = Math.min((total / Y_MAX) * 100, 100);
                const sentH  = (d.applicationSent / total) * 100;
                const answH  = (d.applicationAnswered / total) * 100;
                const hiredH = (d.hired / total) * 100;

                const activeChunk = tooltip?.barIndex === i ? tooltip.chunk : null;

                return (
                  <div
                    key={d.month}
                    className="relative flex flex-col justify-end items-center flex-1"
                    style={{ height: "100%" }}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    {/* Stacked bar */}
                    <div
                      className="relative w-5 rounded-t-md overflow-hidden"
                      style={{ height: `${totalPct}%` }}
                    >
                      {/* BOTTOM — Application Sent */}
                      <div
                        className={`absolute bottom-0 left-0 right-0 cursor-pointer transition-all duration-150 bg-primary ${
                          activeChunk === "applicationSent" ? "brightness-125 saturate-150" : ""
                        }`}
                        style={{ height: `${sentH}%` }}
                        onMouseEnter={() => setTooltip({ barIndex: i, chunk: "applicationSent" })}
                      />

                      {/* MIDDLE — Application Answered */}
                      <div
                        className={`absolute left-0 right-0 cursor-pointer transition-all duration-150 bg-orange-400 ${
                          activeChunk === "applicationAnswered" ? "brightness-125 saturate-150" : ""
                        }`}
                        style={{ bottom: `${sentH}%`, height: `${answH}%` }}
                        onMouseEnter={() => setTooltip({ barIndex: i, chunk: "applicationAnswered" })}
                      />

                      {/* TOP — Hired */}
                      <div
                        className={`absolute top-0 left-0 right-0 cursor-pointer transition-all duration-150 bg-slate-300 dark:bg-slate-500 ${
                          activeChunk === "hired" ? "brightness-125 saturate-150" : ""
                        }`}
                        style={{ height: `${hiredH}%` }}
                        onMouseEnter={() => setTooltip({ barIndex: i, chunk: "hired" })}
                      />
                    </div>

                    {/* Per-chunk Tooltip */}
                    {activeChunk && (
                      <div
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 bg-white dark:bg-[#1e2240] border border-slate-200 dark:border-slate-600 rounded-xl shadow-xl px-3 py-2.5 pointer-events-none"
                        style={{ minWidth: "175px" }}
                      >
                        <p className="text-header-text font-semibold text-xs mb-1.5">{d.month}</p>
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${CHUNK_META[activeChunk].dotClass}`} />
                          <span className="text-content-text text-xs flex-1">
                            {CHUNK_META[activeChunk].label}
                          </span>
                          <span className="text-header-text text-xs font-bold">
                            {d[activeChunk]}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-around px-1 pt-2">
            {monthlyData.map((d) => (
              <span key={d.month} className="flex-1 text-center text-content-text text-xs">
                {d.month}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}