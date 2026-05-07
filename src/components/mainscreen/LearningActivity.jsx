import { useState } from "react";
import Chart from "react-apexcharts";
import { motion } from "framer-motion";

const LearningActivity = () => {
  const [activeSeries, setActiveSeries] = useState({
    thisMonth: true,
    lastMonth: true,
  });

  const chartOptions = {
    chart: { type: "line", toolbar: { show: false } },
    colors: ["var(--primary)", "var(--secondary)"],
    stroke: { curve: "smooth", width: 3 },
    markers: { size: 6, strokeColors: "#fff", strokeWidth: 2 },
    grid: { borderColor: "rgba(115, 123, 139, 0.1)" },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      labels: { style: { colors: "var(--content-text)", fontSize: "12px" } },
    },
    yaxis: {
      min: 30,
      max: 100,
      tickAmount: 7,
      labels: { style: { colors: "var(--content-text)", fontSize: "12px" } },
    },
    legend: { show: false },
    tooltip: { x: { show: false } },
  };

  const rawData = [
    { id: "thisMonth", name: "This Month", data: [58, 68, 78, 50, 58, 88] },
    { id: "lastMonth", name: "Last Month", data: [38, 48, 38, 58, 88, 88] },
  ];

  const chartSeries = rawData.map((s) => ({
    name: s.name,
    data: activeSeries[s.id] ? s.data : [],
  }));

  const toggleSeries = (id) => {
    setActiveSeries((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white dark:bg-[#292d4a] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3
          className="text-lg font-bold"
          style={{ color: "var(--content-text)" }}
        >
          Learning Activity
        </h3>

        {/* Interactive Legend  */}
        <div className="flex gap-4">
          {/* This Month Toggle */}
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => toggleSeries("thisMonth")}
          >
            <div
              className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200"
              style={{
                borderColor: "var(--primary)",
                backgroundColor: activeSeries.thisMonth
                  ? "var(--primary)"
                  : "transparent",
              }}
            >
              {activeSeries.thisMonth && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            <span
              className={`text-xs transition-opacity ${activeSeries.thisMonth ? "opacity-100" : "opacity-50"}`}
              style={{ color: "var(--content-text)" }}
            >
              This Month
            </span>
          </div>

          {/* Last Month Toggle */}
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => toggleSeries("lastMonth")}
          >
            <div
              className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200"
              style={{
                borderColor: "var(--secondary)",
                backgroundColor: activeSeries.lastMonth
                  ? "var(--secondary)"
                  : "transparent",
              }}
            >
              {activeSeries.lastMonth && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            <span
              className={`text-xs transition-opacity ${activeSeries.lastMonth ? "opacity-100" : "opacity-50"}`}
              style={{ color: "var(--content-text)" }}
            >
              Last Month
            </span>
          </div>
        </div>
      </div>

      <div className="h-[200px]">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="line"
          height="100%"
        />
      </div>
    </motion.div>
  );
};

export default LearningActivity;
