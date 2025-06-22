import { useEffect } from "react";

export default function MobileHome() {
    useEffect(() => {
      document.title = "Coming Soon - Schedgy";
    }, []);
  
    return (
      <div className="min-h-screen w-full px-6 bg-[#EED2D2] flex flex-col items-center justify-center">
        <div className="bg-[#F9F1F1] p-12 rounded-lg shadow-md flex flex-col items-center">
          <img src="/icons/noto--money-bag.svg" alt="BudgLeaf Logo" className="w-24 h-24 mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 text-center font-(family-name:--font-IBMPlexSans)">
            Schedgy Coming Soon for Mobile
          </h1>
        </div>
      </div>
    );
}
