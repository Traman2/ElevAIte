import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

//Tabs
import Dashboard from "./Dashboard";
import Accounts from "./Accounts";
import Transactions from "./Transactions";
import InternshipManager from "./InternshipManager";
import Tasks from "./Tasks";
import Calendar from "./Calendar";
import Security from "./Security";
import Settings from "./Settings";

//Modals
import AssetModal from "../../../components/DesktopModals/AssetModal";
import TransactionModal from "../../../components/DesktopModals/TransactionModal";
import SearchModal from "../../../components/DesktopModals/SearchModal";
import TransactionTableModal from "../../../components/DesktopModals/TransactionTableModal";

interface Props {
  page: string;
}

interface UserData {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function NavSidebarLayout({ page }: Props) {
  const [activePage, setActivePage] = useState(page);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [totalAssets, setTotalAssets] = useState<number>(0);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: string;
    title: string;
    accountNumber?: string;
  }>({
    isOpen: false,
    type: "",
    title: "",
    accountNumber: undefined,
  });
  const [showModal, setShowModal] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    setActivePage(page);
  }, [page]);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleAssets = () => {
    navigate("/Accounts");
  };

  //Modal Handlers
  const handleAddAsset = () => {
    setModalState({
      isOpen: true,
      type: "addAsset",
      title: "Create New Asset",
    });
  };

  const handleAddTransaction = () => {
    setModalState({
      isOpen: true,
      type: "addTransaction",
      title: "Add Transaction",
    });
  };

  const handleSearch = () => {
    setModalState({
      isOpen: true,
      type: "search",
      title: "Search",
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      type: "",
      title: "",
    });
  };

  const handleShowTransactionTable = (accountNumber: string) => {
    setModalState({
      isOpen: true,
      type: "transactionTable",
      title: "Transaction Table",
      accountNumber: accountNumber,
    });
  };

  //Decrypt user data from jwt
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/user/me", {
        headers: {
          "x-auth-token": token,
        },
      })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((err) => {
        navigate("/Login");
        console.error("Error fetching user data:", err);
      });
  }, []);

  //Total Asset Calculation
  const fetchTotalAssets = () => {
    if (!userData) return;
    axios
      .get(`http://localhost:3000/bankaccount/${userData._id}`)
      .then((response) => {
        const total =
          response.data
            ?.filter(
              (account: any) =>
                account.accountType === "Savings" ||
                account.accountType === "Debit"
            )
            .reduce(
              (sum: number, account: any) => sum + (account.balance || 0),
              0
            ) || 0;
        setTotalAssets(total);
      })
      .catch((err) => {
        setTotalAssets(0);
        console.error("Error fetching bank accounts:", err);
      });
  };

  useEffect(() => {
    fetchTotalAssets();
  }, [userData]);

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  //React App Router Tab Render
  function renderPage() {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard userData={userData} />;
      case "Accounts":
        return <Accounts onAddAsset={handleAddAsset} userData={userData} />;
      case "Transactions":
        return <Transactions onAddTransaction={handleAddTransaction} userData={userData} onShowTransactionTable={handleShowTransactionTable}/>;
      case "InternshipManager":
        return <InternshipManager />;
      case "Tasks":
        return <Tasks />;
      case "Calendar":
        return <Calendar />;
      case "Security":
        return <Security />;
      case "Settings":
        return <Settings />;
      default:
        return <Dashboard userData={userData} />;
    }
  }

  //Set Modal Type
  function renderModalContent() {
    switch (modalState.type) {
      case "addAsset":
        return <AssetModal onClose={handleCloseModal} userId={userData?._id} onAssetAdded={fetchTotalAssets} />;
      case "addTransaction":
        return <TransactionModal onClose={handleCloseModal} userId={userData?._id} onTransactionAdded={fetchTotalAssets}/>;
      case "search":
        return <SearchModal/>
      case "transactionTable":
        return <TransactionTableModal onClose={handleCloseModal} accountNumber={modalState.accountNumber!}/>
      default:
        return null;
    }
  };

  useEffect(() => {
    if (modalState.isOpen) {
      setShowModal(true);
      setAnimateOut(false);
    } else if (showModal) {
      setAnimateOut(true);
      const timeout = setTimeout(() => setShowModal(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [modalState.isOpen]);

  return (
    <div className="h-screen w-full bg-[#EED2D2] flex flex-col overflow-hidden">
      {/* Header Nav Bar */}
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
            <span
              className="text-lg font-bold text-[#3B3636]"
              style={{ fontFamily: "var(--font-IBMPlexSans)" }}
            >
              Good Morning, {userData?.firstName}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleSearch()}
              className="font-semibold font-(family-name:--font-IBMPlexSans) cursor-pointer flex items-center space-x-2 bg-[#EAE3E3] hover:bg-gray-300 text-[#5C543C] px-3 py-1.5 rounded-3xl transition-colors duration-200 text-sm"
            >
              <span>Search</span>
              <img
                src="/icons/material-symbols--search-rounded.svg"
                alt="Search"
                className="w-4 h-4 ml-2"
              />
            </button>
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
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className="flex mx-2 mt-1 mb-2 gap-1 flex-1 min-h-0">
        <div className="bg-[#F9F1F1] w-60 px-3 py-2 rounded-bl-lg shadow-sm flex flex-col">
          <div
            onClick={() => handleAssets()}
            className="cursor-pointer shadow-sm bg-[#759EDC]/43 bg-opacity-74 rounded-lg px-3 pt-2 pb-3"
          >
            <p className="text-[#3F3131] text-xs font-medium font-(family-name:--font-IBMPlexSans)">
              Total Assets
            </p>
            <p className="text-[#3F3131] text-xl font-semibold font-(family-name:--font-IBMPlexSans)">
              {formatCurrency(totalAssets)}
            </p>
          </div>

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
                Study Tools
              </h3>

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
                Budget Tools
              </h3>

              <button
                onClick={() => navigate("/Accounts")}
                className={`${
                  activePage === "Accounts" && "bg-[#FADEDE] shadow-sm"
                } w-full flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer hover:bg-[#FADEDE] transition-colors`}
              >
                <div className="flex items-center space-x-2">
                  <img
                    src="/icons/sidebar/carbon--financial-assets.svg"
                    alt="Assets"
                    className="w-6 h-6"
                  />
                  <span className="font-(family-name:--font-IBMPlexSans) text-[#605D5D] font-semibold text-sm">
                    Accounts
                  </span>
                </div>
                {activePage === "Accounts" && (
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

              <button
                onClick={() => navigate("/InternshipManager")}
                className={`${
                  activePage === "Deposits" && "bg-[#FADEDE] shadow-sm"
                } w-full flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer hover:bg-[#FADEDE] transition-colors mt-1`}
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
                {activePage === "IntershipManager" && (
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
                    {userData?.firstName} {userData?.lastName}
                  </span>
                  <span className="text-[#291D1D] text-xs opacity-80">
                    {userData?.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Render Section */}
        <div className="bg-[#F9F1F1] flex-1 px-4 py-3 rounded-br-lg shadow-sm">
          {renderPage()}
        </div>
      </div>


      {/* Render Modal */}
      {showModal && (
        <>
          <div
            className={`fixed inset-0 z-50 ${animateOut ? "overlay-animate-out" : "overlay-animate-in"} bg-black`}
            onClick={() => {
              if (!animateOut) setModalState({ isOpen: false, type: "", title: "" });
            }}
          />
          <div
            className={`fixed inset-0 flex items-center justify-center z-60 pointer-events-none`}
          >
            <div
              onClick={e => e.stopPropagation()}
              className={animateOut ? "modal-animate-out pointer-events-auto" : "modal-animate-in pointer-events-auto"}
            >
              {renderModalContent()}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
