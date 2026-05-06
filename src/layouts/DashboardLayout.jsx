import ControlPanel from "../components/theme/ControlPanel";
import Sidebar from './Sidebar'; 

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-bg-main text-content-text transition-colors duration-500">
      <Sidebar />
      <div className="flex-1 ml-64">
        <main className="p-8">{children}</main>
      </div>
      <ControlPanel />
    </div>
  );
};

export default DashboardLayout;
