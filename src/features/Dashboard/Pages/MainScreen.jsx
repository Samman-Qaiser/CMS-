import LearningActivity from "../../../components/mainscreen/LearningActivity";
import VoucherCard from "../../../components/mainscreen/VoucherCard";

const MainScreen = () => {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <VoucherCard />
        <LearningActivity />
      </div>
      <div className="row2">
        <div className="col1"></div>
        <div className="col2"></div>
        <div className="col3"></div>
      </div>
      <div className="row3"></div>
      <div className="row4">
        <div className="col1"></div>
        <div className="col2"></div>
      </div>
    </div>
  );
}

export default MainScreen