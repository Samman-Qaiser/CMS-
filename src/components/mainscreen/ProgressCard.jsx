import Chart from "react-apexcharts";
import { motion } from "framer-motion";

const ProgressCard = () => {
  const percentage = 75; 

  const chartOptions = {
    chart: {
      type: "radialBar",
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          size: "70%",
        },
        track: {
          background: "var(--primary-light)", 
          strokeWidth: "100%",
          opacity: 0.1,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: 5,
            fontSize: "22px",
            fontWeight: "700",
            color: "var(--content-text)",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      colors: ["var(--primary)"], 
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  const chartSeries = [percentage];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white dark:bg-[#292d4a] rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center h-full"
    >
      <div className="w-full max-w-[200px] mb-2">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="radialBar"
          height={220}
        />
      </div>

      <h3
        className="text-xl font-bold mb-2"
        style={{ color: "var(--content-text)" }}
      >
        My Progress
      </h3>
      <p className="text-gray-500 text-sm mb-6 max-w-[200px]">
        Lorem ipsum dolor sit amet, consectetur
      </p>

      <button
        className="px-8 py-3 bg-primary hover:bg-primary-dark rounded-xl text-white font-semibold transition-transform hover:scale-105 active:scale-95"
      >
        More Details
      </button>
    </motion.div>
  );
};

export default ProgressCard;
