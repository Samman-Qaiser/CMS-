import { ChevronRight } from "lucide-react";

const OngoingClass = () => {
  const classes = [
    { name: "UI Design Basic", progress: 75, color: "#8E54E9" }, // Purple
    { name: "Developer", progress: 50, color: "#FFB129" }  // Orange
  ];

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl text-header-text font-bold mb-2">Ongoing Class</h3>
      {classes.map((item, i) => (
        <div key={i} className="bg-[#FFFFFF] dark:bg-[#292D4A] p-5 rounded-md flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-5 flex-1">
            {/* Dynamic Progress Circle */}
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center relative flex-shrink-0"
              style={{
                background: `conic-gradient(${item.color} ${item.progress * 3.6}deg, rgba(255,255,255,0.1) 0deg)`
              }}
            >
              {/* Inner Circle to make it a ring */}
              <div className="w-[85%] h-[85%] bg-[#FFFFFF] dark:bg-[#292D4A] rounded-full flex items-center justify-center">
                <span className="font-bold text-header-text">{item.progress}%</span>
              </div>
            </div>

            {/* Content & Progress Bar */}
            <div className="flex flex-col gap-2 w-full max-w-[200px]">
              <p className="text-[16px] font-bold text-header-text leading-tight">{item.name}</p>
              
              {/* Linear Progress Bar */}
              <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${item.progress}%`, 
                    backgroundColor: item.color 
                  }}
                ></div>
              </div>
            </div>
          </div>

          <button className="text-sidebar-text hover:text-primary transition-colors ml-4">
            <ChevronRight size={20} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default OngoingClass;