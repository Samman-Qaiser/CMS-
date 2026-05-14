import { Link } from "react-router-dom";

const ConfigHeader = () => {
  return (
    <div className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Left Side: Title and Subtitle */}
      <div className="text-center md:text-left">
        <h2 className="text-primary text-2xl font-bold tracking-tight">
          Configurations
        </h2>
        <p className="text-content-text text-sm mt-1 tracking-wider">
          all configurations
        </p>
      </div>

      {/* Right Side: Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm font-medium">
        <Link
          to="/dashboard/configurations"
          className="text-content-text hover:text-primary transition-colors"
        >
          Configurations
        </Link>
        <span className="text-primary font-bold">/</span>
        <Link
          to="/dashboard/configurations/add-config"
          className="text-primary font-bold hover:opacity-80 transition-opacity"
        >
          Add Config
        </Link>
      </div>
    </div>
  );
};

export default ConfigHeader;
