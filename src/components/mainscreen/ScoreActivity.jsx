import { useState } from "react";
import Chart from "react-apexcharts";
import { motion } from "framer-motion";

const ScoreActivity = () => {
  // visibility state for bar groups
  const [activeSeries, setActiveSeries] = useState({
    thisMonth: true,
    lastMonth: true,
  });

  const chartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ["var(--primary)", "var(--secondary)"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 4,
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    grid: { borderColor: "rgba(115, 123, 139, 0.1)" },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: { style: { colors: "var(--content-text)", fontSize: "12px" } },
      axisBorder: { show: false },
    },
    yaxis: {
      min: 0,
      max: 120,
      tickAmount: 4,
      labels: { style: { colors: "var(--content-text)", fontSize: "12px" } },
    },
    legend: { show: false },
    tooltip: { x: { show: false } },
  };

  const rawData = [
    {
      id: "thisMonth",
      name: "This Month",
      data: [118, 90, 70, 40, 50, 18, 70, 90, 70, 40, 50, 18],
    },
    {
      id: "lastMonth",
      name: "Last Month",
      data: [75, 50, 18, 70, 40, 70, 100, 50, 18, 40, 55, 100],
    },
  ];
 
  const chartSeries = rawData.map((s) => ({
    name: s.name,
    data: activeSeries[s.id] ? s.data : Array(12).fill(0),
  }));

  const toggleSeries = (id) => {
    setActiveSeries((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white dark:bg-[#292d4a] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3
          className="text-lg font-bold"
          style={{ color: "var(--content-text)" }}
        >
          Score Activity
        </h3>

        {/* Custom Legend Toggles */}
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
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
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
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
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

      <div className="h-[250px]">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height="100%"
        />
      </div>
    </motion.div>
  );
};

export default ScoreActivity;
