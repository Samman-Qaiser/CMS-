// InstructorTransactions.jsx
import EarningsBarChart from "../Components/EarningsBarChart";
import TotalOrderCard from "../Components/TotalOrderCard";
import EarningCoursesDonut from "../Components/EarningCoursesDonut";
import LatestTransactionTable from "../Components/LatestTransactionTable";

export default function InstructorTransactions() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#1E2139] p-2">
      <div className=" flex flex-col gap-5">
        {/* ── Row 1: Earnings chart (left) + Total Order + Donut (right) ── */}
        <div className="flex gap-5 ">
          {/* Left — Earnings Bar Chart */}
          <div className="flex-1 w-[65%] min-w-0 space-y-6">
            <EarningsBarChart />
            <LatestTransactionTable />
          </div>
          {/* Right — Total Order + Earning Courses stacked */}
          <div className="flex w-[35%] flex-col gap-5 shrink-0">
            <TotalOrderCard />
            <EarningCoursesDonut />
          </div>
        </div>
      </div>
    </div>
  );
}
