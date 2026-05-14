import { Outlet } from "react-router-dom";
import ConfigHeader from "../components/ConfigHeader";

const ConfigLayout = () => {
  return (
    <div className="space-y-6">
      <ConfigHeader />
      <div lassName="animate-fadeIn">
        <Outlet />
      </div>
    </div>
  );
};

export default ConfigLayout;
