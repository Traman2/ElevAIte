import { useEffect } from "react";

export default function MobileHome() {
    useEffect(() => {
      document.title = "Coming Soon - Schedgy";
    }, []);
  
    return (
      <div className="min-h-screen w-full px-6 bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center relative" style={{ backgroundImage: 'url(/bg-bottom.jpg)' }}>
        <div className="absolute inset-0 bg-[#EED2D2] opacity-80"></div>
        <div className="relative z-10 bg-[#F9F1F1] p-12 rounded-3xl shadow-xl flex flex-col items-center">
          <img src="/icons/noto--money-bag.svg" alt="BudgLeaf Logo" className="w-24 h-24 mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 text-center font-(family-name:--font-IBMPlexSans)">
            Schedgy Coming Soon for Mobile 
          </h1>
          <p className="mt-3 text-gray-800 text-center font-(family-name:--font-IBMPlexSans)">(Please resize window or switch to desktop)</p>
        </div>
      </div>
    );
}
