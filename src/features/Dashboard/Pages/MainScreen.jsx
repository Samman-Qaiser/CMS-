import React from 'react'
import {
  IoArrowUpOutline,
  IoBookOutline,
  IoTimeOutline,
  IoCheckmarkDoneOutline,
} from "react-icons/io5";
const MainScreen = () => {
   const stats = [
     {
       label: "All Courses",
       value: "1.500",
       icon: <IoBookOutline />,
       trend: "+12%",
     },
     {
       label: "Active Courses",
       value: "1.110",
       icon: <IoTimeOutline />,
       trend: "+5%",
     },
     {
       label: "Completed",
       value: "900",
       icon: <IoCheckmarkDoneOutline />,
       trend: "+18%",
     },
   ];
 
   return (
     <div className="space-y-8 animate-in fade-in duration-700">
       {/* 1. Hero / Promo Section */}
       <section className="relative overflow-hidden rounded-3xl bg-primary/10 p-8 md:p-12 border border-primary/20">
         <div className="relative z-10 max-w-lg">
           <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight">
             Join Now and Get{" "}
             <span className="text-primary">Discount Voucher</span> Up To 20%
           </h2>
           <p className="mt-4 text-slate-600 leading-relaxed">
             Experience the next generation of management systems with fluid
             typography and GSAP-powered motion design.
           </p>
           <button className="mt-8 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-transform">
             View Details
           </button>
         </div>
 
         {/* Abstract background shape using primary color */}
         <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
         <div className="absolute right-10 bottom-0 w-64 h-64 bg-accent/10 rounded-full blur-2xl" />
       </section>
 
       {/* 2. Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.map((item, idx) => (
           <div
             key={idx}
             className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
           >
             <div className="flex justify-between items-start">
               <div className="p-3 bg-secondary/10 text-secondary rounded-xl group-hover:bg-secondary group-hover:text-white transition-colors">
                 {item.icon}
               </div>
               <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                 <IoArrowUpOutline /> {item.trend}
               </span>
             </div>
             <div className="mt-4">
               <h3 className="text-2xl font-black text-slate-800">
                 {item.value}
               </h3>
               <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                 {item.label}
               </p>
             </div>
           </div>
         ))}
       </div>
 
       {/* 3. Main Activity / Chart Placeholder */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Learning Activity */}
         <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-8">
             <h3 className="text-xl font-bold text-slate-800">
               Learning Activity
             </h3>
             <select className="bg-slate-50 border-none text-sm font-bold rounded-lg px-3 py-1 outline-hidden">
               <option>Weekly</option>
               <option>Monthly</option>
             </select>
           </div>
 
           {/* Mockup Chart Bars */}
           <div className="flex items-end justify-between h-48 gap-2">
             {[60, 80, 45, 90, 70, 100, 50].map((height, i) => (
               <div key={i} className="flex-1 group relative">
                 <div
                   className="bg-primary/20 rounded-t-lg transition-all duration-500 group-hover:bg-primary"
                   style={{ height: `${height}%` }}
                 />
                 <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400">
                   {["M", "T", "W", "T", "F", "S", "S"][i]}
                 </div>
               </div>
             ))}
           </div>
         </div>
 
         {/* My Progress */}
         <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
           <div className="relative w-40 h-40">
             <svg className="w-full h-full transform -rotate-90">
               <circle
                 cx="80"
                 cy="80"
                 r="70"
                 stroke="currentColor"
                 strokeWidth="12"
                 fill="transparent"
                 className="text-slate-100"
               />
               <circle
                 cx="80"
                 cy="80"
                 r="70"
                 stroke="currentColor"
                 strokeWidth="12"
                 fill="transparent"
                 strokeDasharray={440}
                 strokeDashoffset={440 - (440 * 75) / 100}
                 className="text-primary"
               />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-3xl font-black text-slate-800">75%</span>
               <span className="text-[10px] font-bold text-slate-400 uppercase">
                 Progress
               </span>
             </div>
           </div>
           <h3 className="mt-6 text-lg font-bold text-slate-800">
             Course Completion
           </h3>
           <p className="text-sm text-slate-500 mt-2">
             You are doing great this week! Keep it up.
           </p>
         </div>
       </div>
     </div>
   );
}

export default MainScreen