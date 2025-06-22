import { useNavigate } from "react-router-dom";

export default function DesktopHome() {
  const navigate = useNavigate();
  const handleDashboard = () => {
    navigate("/Dashboard");
  };

  return (
    <div className="min-h-screen w-full bg-[#EED2D2] flex flex-col items-center justify-center">
      <div className="bg-[#F9F1F1] p-12 rounded-lg shadow-md flex flex-col items-center">
        <img
          src="/icons/noto--money-bag.svg"
          alt="BudgLeaf Logo"
          className="w-24 h-24 mb-6"
        />
        <h1 className="text-3xl font-bold text-gray-800 text-center font-(family-name:--font-IBMPlexSans)">
          Landing Page Coming Soon
        </h1>
        <button onClick={() => handleDashboard()} className="mt-5 bg-amber-300 rounded-2xl px-4 py-1 cursor-pointer transition-colors hover:bg-amber-500">
          View Dashboard
        </button>
      </div>
    </div>
  );
}
