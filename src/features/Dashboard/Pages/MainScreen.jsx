import { BsBookmark, BsCheckSquare, BsLightbulb } from "react-icons/bs";
import LearningActivity from "../../../components/mainscreen/LearningActivity";
import StatCard from "../../../components/mainscreen/StatCard";
import VoucherCard from "../../../components/mainscreen/VoucherCard";

const statData = [
  {
    id: 1,
    icon: BsCheckSquare,
    count: "1.500",
    label: "All Courses",
    bgColor: "var(--primary)",
  },
  {
    id: 2,
    icon: BsBookmark,
    count: "1.112",
    label: "Upcoming",
    bgColor: "black",
  },
  {
    id: 3,
    icon: BsLightbulb,
    count: "903",
    label: "Progress Courses",
    bgColor: "var(--secondary)",
  },
];

const MainScreen = () => {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <VoucherCard />
        <LearningActivity />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {statData.map((stat, index) => (
          <StatCard
            key={stat.id}
            icon={stat.icon}
            count={stat.count}
            label={stat.label}
            bgColor={stat.bgColor}
            delay={0.1 * (index + 1)}
          />
        ))}
      </div>
      <div className="row3"></div>
      <div className="row4">
        <div className="col1"></div>
        <div className="col2"></div>
      </div>
      <div className="row5 h-[100vh]"></div>
    </div>
  );
}

export default MainScreen