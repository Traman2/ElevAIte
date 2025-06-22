import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import Assets from "./Assets";
import Transactions from "./Transactions";
import Deposits from "./Deposits";
import { useNavigate } from "react-router-dom";
import Tasks from "./Tasks";
import Calendar from "./Calendar";
import Security from "./Security";
import Settings from "./Settings";

interface Props {
  page: string;
}

export default function NavSidebarLayout({ page }: Props) {
  const [activePage, setActivePage] = useState(page);
  useEffect(() => {
    setActivePage(page);
  }, [page]);

  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/");
  };

  function renderPage() {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;
      case "Assets":
        return <Assets />;
      case "Transactions":
        return <Transactions />;
      case "Deposits":
        return <Deposits />;
      case "Tasks":
        return <Tasks />;
      case "Calendar":
        return <Calendar />;
      case "Security":
        return <Security />;
      case "Settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  }

  return (
    <div className="h-screen w-full bg-[#EED2D2] flex flex-col overflow-hidden">
      <header className="bg-[#F9F1F1] mx-2 mt-2 px-3 py-2 rounded-t-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-60 flex items-center space-x-2">
              <img
                src="/icons/noto--money-bag.svg"
                alt="BudgLeaf Logo"
                className="w-6 h-6"
              />
              <span className="text-lg font-bold text-[#11502D] font-(family-name:--font-IBMPlexMono)">
                Schedgy
              </span>
            </div>
            <span className="text-lg font-bold text-[#3B3636]" style={{ fontFamily: 'var(--font-IBMPlexSans)' }}>
              Good Morning, Tejas
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleLogout()}
              className="font-bold font-(family-name:--font-IBMPlexSans) cursor-pointer flex items-center space-x-2 bg-[#D44E4E] hover:bg-red-700 text-white px-3 py-1.5 rounded-3xl transition-colors duration-200 text-sm"
            >
              <span>Logout</span>
              <img
                src="/icons/material-symbols--logout-rounded.svg"
                alt="Logout"
                className="w-4 h-4"
              />
            </button>

            <div className="flex items-center bg-[#EAE3E3] border border-gray-300 rounded-3xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
              <img
                src="/icons/material-symbols--search-rounded.svg"
                alt="Search"
                className="w-4 h-4 text-gray-400 ml-2"
              />
              <input
                type="text"
                placeholder="Search"
                className="pl-2 pr-3 py-1.5 bg-transparent focus:outline-none font-(family-name:--font-IBMPlexSans) text-sm"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex mx-2 mt-1 mb-2 gap-1 flex-1 min-h-0">
        <div className="bg-[#F9F1F1] w-60 px-3 py-2 rounded-bl-lg shadow-sm flex flex-col">
          <div className="border border-[#9C8383] bg-[#759EDC]/43 bg-opacity-74 rounded-lg px-3 pt-2 pb-3">
            <p className="text-[#3F3131] text-xs font-medium font-(family-name:--font-IBMPlexSans)">
              Total Assets
            </p>
            <p className="text-[#3F3131] text-xl font-semibold font-(family-name:--font-IBMPlexSans)">
              $12,543.23
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-4 flex-1">
            {/* Overview */}
            <button
              onClick={() => navigate("/Dashboard")}
              className={`${
                activePage === "Dashboard" && "bg-[#FADEDE]"
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
                Study Tools
              </h3>

              <button
                onClick={() => navigate("/Tasks")}
                className={`${
                  activePage === "Tasks" && "bg-[#FADEDE]"
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
                  activePage === "Calendar" && "bg-[#FADEDE]"
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
                Budget Tools
              </h3>

              <button
                onClick={() => navigate("/Assets")}
                className={`${
                  activePage === "Assets" && "bg-[#FADEDE]"
                } w-full flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer hover:bg-[#FADEDE] transition-colors`}
              >
                <div className="flex items-center space-x-2">
                  <img
                    src="/icons/sidebar/carbon--financial-assets.svg"
                    alt="Assets"
                    className="w-6 h-6"
                  />
                  <span className="font-(family-name:--font-IBMPlexSans) text-[#605D5D] font-semibold text-sm">
                    Assets
                  </span>
                </div>
                {activePage === "Assets" && (
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
                  activePage === "Transactions" && "bg-[#FADEDE]"
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

              <button
                onClick={() => navigate("/Deposits")}
                className={`${
                  activePage === "Deposits" && "bg-[#FADEDE]"
                } w-full flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer hover:bg-[#FADEDE] transition-colors mt-1`}
              >
                <div className="flex items-center space-x-2">
                  <img
                    src="/icons/sidebar/tabler--pig-money.svg"
                    alt="Deposits"
                    className="w-6 h-6"
                  />
                  <span className="font-(family-name:--font-IBMPlexSans) text-[#605D5D] font-semibold text-sm">
                    Deposits
                  </span>
                </div>
                {activePage === "Deposits" && (
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
                  activePage === "Security" && "bg-[#FADEDE]"
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
                  activePage === "Settings" && "bg-[#FADEDE]"
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

          <div className="mt-auto mb-2">
            <div className="bg-[#E7D7D7] rounded-2xl px-2 py-1.5">
              <div className="flex items-center space-x-2">
                <img
                  src="/icons/sidebar/gg--profile.svg"
                  alt="Profile"
                  className="w-7 h-7 rounded-full"
                />
                <div className="flex flex-col -space-y-1">
                  <span
                    className="text-[#291D1D] font-semibold text-sm"
                    style={{ fontFamily: "var(--font-IBMPlexSans)" }}
                  >
                    Tejas Raman
                  </span>
                  <span className="text-[#291D1D] text-xs opacity-80">
                    tejassraman@gmail.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#F9F1F1] flex-1 px-4 py-3 rounded-br-lg shadow-sm">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
