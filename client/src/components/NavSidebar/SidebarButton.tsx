import { useNavigate } from "react-router-dom";

interface SidebarButtonProps {
  activePage: string;
}

export default function SidebarButtons({ activePage }: SidebarButtonProps) {
  const navigate = useNavigate();

  return (
    <div className="mt-4 flex-1">
      <button
        onClick={() => navigate("/Dashboard")}
        className={`${
          activePage === "Dashboard" && "bg-[#FADEDE] shadow-sm"
        } w-full flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer hover:bg-[#FADEDE] transition-colors`}
      >
        <div className="flex items-center space-x-2">
          <img
            src="/icons/sidebar/ic--round-dashboard.svg"
            alt="Overview"
            className="w-6 h-6"
          />
          <span className="text-[#605D5D] font-semibold font-(family-name:--font-IBMPlexSans) text-sm">
            Overview
          </span>
        </div>
        {activePage === "Dashboard" && (
          <img
            src="/icons/sidebar/ic--sharp-arrow-right.svg"
            alt="Active"
            className="w-6 h-6"
          />
        )}
      </button>

      <div className="mt-2">
        <h3 className="text-[#5C3333] font-bold text-xs mb-1.5">
          Budget Tools
        </h3>

        <button
          onClick={() => navigate("/InternshipManager")}
          className={`${
            activePage === "InternshipManager" && "bg-[#FADEDE] shadow-sm"
          } w-full flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer hover:bg-[#FADEDE] transition-colors`}
        >
          <div className="flex items-center space-x-2">
            <img
              src="/icons/sidebar/tabler--pig-money.svg"
              alt="Internship Portal"
              className="w-6 h-6"
            />
            <span className="font-(family-name:--font-IBMPlexSans) text-[#605D5D] font-semibold text-sm">
              Internship Portal
            </span>
          </div>
          {activePage === "InternshipManager" && (
            <img
              src="/icons/sidebar/ic--sharp-arrow-right.svg"
              alt="Active"
              className="w-6 h-6"
            />
          )}
        </button>

        <button
          onClick={() => navigate("/Transactions")}
          className={`${
            activePage === "Transactions" && "bg-[#FADEDE] shadow-sm"
          } w-full flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer hover:bg-[#FADEDE] transition-colors mt-1`}
        >
          <div className="flex items-center space-x-2">
            <img
              src="/icons/sidebar/streamline-freehand--money-bill-fly.svg"
              alt="Transactions"
              className="w-6 h-6"
            />
            <span className="font-(family-name:--font-IBMPlexSans) text-[#605D5D] font-semibold text-sm">
              Transactions
            </span>
          </div>
          {activePage === "Transactions" && (
            <img
              src="/icons/sidebar/ic--sharp-arrow-right.svg"
              alt="Active"
              className="w-6 h-6"
            />
          )}
        </button>
      </div>

      <div className="mt-2">
        <h3 className="text-[#5C3333] font-bold text-xs mb-1.5">Study Tools</h3>

        <button
          onClick={() => navigate("/Tasks")}
          className={`${
            activePage === "Tasks" && "bg-[#FADEDE] shadow-sm"
          } w-full flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer hover:bg-[#FADEDE] transition-colors mt-1`}
        >
          <div className="flex items-center space-x-2">
            <img
              src="/icons/sidebar/clarity--tasks-line.svg"
              alt="Tasks"
              className="w-6 h-6"
            />
            <span className="font-(family-name:--font-IBMPlexSans) text-[#605D5D] font-semibold text-sm">
              Tasks
            </span>
          </div>
          {activePage === "Tasks" && (
            <img
              src="/icons/sidebar/ic--sharp-arrow-right.svg"
              alt="Active"
              className="w-6 h-6"
            />
          )}
        </button>

        <button
          onClick={() => navigate("/Calendar")}
          className={`${
            activePage === "Calendar" && "bg-[#FADEDE] shadow-sm"
          } w-full flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer hover:bg-[#FADEDE] transition-colors mt-1`}
        >
          <div className="flex items-center space-x-2">
            <img
              src="/icons/sidebar/solar--calendar-line-duotone.svg"
              alt="Calendar"
              className="w-6 h-6"
            />
            <span className="font-(family-name:--font-IBMPlexSans) text-[#605D5D] font-semibold text-sm">
              Calendar
            </span>
          </div>
          {activePage === "Calendar" && (
            <img
              src="/icons/sidebar/ic--sharp-arrow-right.svg"
              alt="Active"
              className="w-6 h-6"
            />
          )}
        </button>
      </div>

      <div className="mt-2">
        <h3 className="text-[#5C3333] font-bold text-xs mb-1.5">
          Account Management
        </h3>

        <button
          onClick={() => navigate("/Security")}
          className={`${
            activePage === "Security" && "bg-[#FADEDE] shadow-sm"
          } w-full flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer hover:bg-[#FADEDE] transition-colors`}
        >
          <div className="flex items-center space-x-2">
            <img
              src="/icons/sidebar/ic--baseline-security.svg"
              alt="Security"
              className="w-6 h-6"
            />
            <span className="font-(family-name:--font-IBMPlexSans) text-[#605D5D] font-semibold text-sm">
              Security
            </span>
          </div>
          {activePage === "Security" && (
            <img
              src="/icons/sidebar/ic--sharp-arrow-right.svg"
              alt="Active"
              className="w-6 h-6"
            />
          )}
        </button>

        <button
          onClick={() => navigate("/Settings")}
          className={`${
            activePage === "Settings" && "bg-[#FADEDE] shadow-sm"
          } w-full flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer hover:bg-[#FADEDE] transition-colors mt-1`}
        >
          <div className="flex items-center space-x-2">
            <img
              src="/icons/sidebar/material-symbols--settings.svg"
              alt="Settings"
              className="w-6 h-6"
            />
            <span className="font-(family-name:--font-IBMPlexSans) text-[#605D5D] font-semibold text-sm">
              Settings
            </span>
          </div>
          {activePage === "Settings" && (
            <img
              src="/icons/sidebar/ic--sharp-arrow-right.svg"
              alt="Active"
              className="w-6 h-6"
            />
          )}
        </button>
      </div>
    </div>
  );
}
