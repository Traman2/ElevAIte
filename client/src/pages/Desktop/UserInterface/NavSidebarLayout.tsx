import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

//Tabs
import Dashboard from "./Dashboard";
import Transactions from "./Transactions";
import InternshipManager from "./InternshipManager";
import Tasks from "./Tasks";
import Calendar from "./Calendar";
import Security from "./Security";
import Settings from "./Settings";

//Buttons
import SidebarButtons from "../../../components/NavSidebar/SidebarButton";

//Modals
import AssetModal from "../../../components/DesktopModals/AssetModal";
import TransactionModal from "../../../components/DesktopModals/TransactionModal";
import SearchModal from "../../../components/DesktopModals/SearchModal";
import TransactionTableModal from "../../../components/DesktopModals/TransactionTableModal";
import InternshipManagerModal from "../../../components/DesktopModals/InternshipManagerModal";
import InternshipAddModal from "../../../components/DesktopModals/InternshipAddModal";
import TaskModal from "../../../components/DesktopModals/TaskModal";
import AddNewTaskModal from "../../../components/DesktopModals/AddNewTaskModal";

//AI Assistant pop up hover card
import AIAssistantChatCard from "../../../components/AIHoverChatCard/AIAssistantChatCard";

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

interface ApplicationData {
  _id: string;
  date: string;
  name: string;
  category: string;
  employer: string;
  status: string;
  description: string;
}

export default function NavSidebarLayout({ page }: Props) {
  const [activePage, setActivePage] = useState(page);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [totalAssets, setTotalAssets] = useState<number>(0);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: string;
    title: string;
  }>({
    isOpen: false,
    type: "",
    title: "",
  });

  //Pass through values for modal
  const [transactionAccountNumber, setTransactionAccountNumber] = useState<
    string | null
  >(null);
  const [classIdForTask, setClassId] = useState<string | null>(null);
  const [viewApplication, setViewApplication] =
    useState<ApplicationData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);
  const [internshipRefreshKey, setInternshipRefreshKey] = useState(0);
  const [taskRefreshKey, setTaskRefreshKey] = useState(0);
  const [accountRefreshKey, setAccountRefreshKey] = useState(0);
  const [showAssets, setShowAssets] = useState(false);

  //ai Hover card code
  // Remove showAICard; use aiButtonPosition as the only source of truth
  const [aiButtonPosition, setAiButtonPosition] = useState<
    { x: number; y: number; width: number; height: number } | undefined
  >(undefined);
  const aiButtonRef = useRef<HTMLButtonElement>(null);

  //Socket io client handlers
  useEffect(() => {
    if (!userData) return;

    const socket = io("http://localhost:3000");

    socket.emit("register", userData._id);

    socket.on("refresh-component", ({ type }) => {
      if (type === "updateClass") {
        console.log("Received task update event. Refreshing...");
        setTaskRefreshKey((k) => k + 1);
      }

      if (type === "updateAccount") {
        console.log("Received task update event. Refreshing...");
        setAccountRefreshKey((k) => k + 1)
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userData]);

  useEffect(() => {
    setActivePage(page);
  }, [page]);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  //Modal Handlers (Passes these into panel components)
  const handleAddAsset = () => {
    setModalState({
      isOpen: true,
      type: "addAsset",
      title: "Create New Asset",
    });
  };

  const handleViewApplication = (application: ApplicationData) => {
    setViewApplication(application);
    setModalState({
      isOpen: true,
      type: "viewApplication",
      title: application.name,
    });
  };

  const handleAddTransaction = () => {
    setModalState({
      isOpen: true,
      type: "addTransaction",
      title: "Add Transaction",
    });
  };

  const handleAddInternship = () => {
    setModalState({
      isOpen: true,
      type: "addInternship",
      title: "Add Internship",
    });
  };

  const handleAddTask = () => {
    setModalState({
      isOpen: true,
      type: "addTask",
      title: "Add Task",
    });
  };

  const handleSearch = () => {
    setModalState({
      isOpen: true,
      type: "search",
      title: "Search",
    });
  };

  const handleAddNewTask = (classId: string) => {
    setClassId(classId);
    setModalState({
      isOpen: true,
      type: "addNewTask",
      title: "Add New Task",
    });
  };

  const handleShowTransactionTable = (accountNumber: string) => {
    setTransactionAccountNumber(accountNumber);
    setModalState({
      isOpen: true,
      type: "transactionTable",
      title: "Transaction Table",
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      type: "",
      title: "",
    });
    setTransactionAccountNumber(null);
    setViewApplication(null);
    setClassId(null);
  };

  //ai card handler logic
  const handleAICardToggle = () => {
    if (!aiButtonPosition && aiButtonRef.current) {
      const rect = aiButtonRef.current.getBoundingClientRect();
      const position = {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      };
      setAiButtonPosition(position);
    } else {
      setAiButtonPosition(undefined);
    }
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
        setAccountRefreshKey((k) => k + 1);
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
      case "Transactions":
        return (
          <Transactions
            onAddAccount={handleAddAsset}
            onAddTransaction={handleAddTransaction}
            userData={userData}
            refreshKey={accountRefreshKey}
            onShowTransactionTable={handleShowTransactionTable}
          />
        );
      case "InternshipManager":
        return (
          <InternshipManager
            userId={userData?._id}
            onApplicationClick={handleViewApplication}
            onAddInternship={handleAddInternship}
            refreshKey={internshipRefreshKey}
          />
        );

      case "Tasks":
        return (
          <Tasks
            userData={userData}
            onAddClass={handleAddTask}
            refreshKey={taskRefreshKey}
            addNewTask={handleAddNewTask}
          />
        );
      case "Calendar":
        return <Calendar refreshKey={taskRefreshKey} userId={userData?._id} />;
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
        return (
          <AssetModal
            onClose={handleCloseModal}
            userId={userData?._id}
            onAssetAdded={fetchTotalAssets}
            onAssetRefresh={() => setAccountRefreshKey((k) => k + 1)}
          />
        );
      case "addTransaction":
        return (
          <TransactionModal
            onClose={handleCloseModal}
            userId={userData?._id}
            onTransactionAdded={fetchTotalAssets}
          />
        );
      case "search":
        return <SearchModal onClose={handleCloseModal} />;
      case "transactionTable":
        return transactionAccountNumber ? (
          <TransactionTableModal
            onClose={handleCloseModal}
            accountNumber={transactionAccountNumber}
          />
        ) : null;
      case "viewApplication":
        return viewApplication ? (
          <InternshipManagerModal
            application={viewApplication}
            onClose={handleCloseModal}
            onDelete={() => setInternshipRefreshKey((k) => k + 1)}
            userId={userData?._id}
          />
        ) : null;
      case "addInternship":
        return (
          <InternshipAddModal
            onClose={handleCloseModal}
            userId={userData?._id}
            onInternshipAdded={() => setInternshipRefreshKey((k) => k + 1)}
          />
        );
      case "addTask":
        return (
          <TaskModal
            onClose={handleCloseModal}
            userId={userData?._id}
            onTaskAdded={() => setTaskRefreshKey((k) => k + 1)}
          />
        );
      case "addNewTask":
        return (
          <AddNewTaskModal
            onClose={handleCloseModal}
            classId={classIdForTask ? classIdForTask : ""}
            onTaskAdded={() => setTaskRefreshKey((k) => k + 1)}
            userId={userData?._id}
          />
        );
      default:
        return null;
    }
  }

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
      <header className="bg-[#F9F1F1] mx-2 mt-2 px-3 py-2 rounded-t-lg shadow-sm relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 relative">
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

            <div className="relative">
              <button
                ref={aiButtonRef}
                aria-label={
                  aiButtonPosition ? "Close AI Assistant" : "Open AI Assistant"
                }
                className="cursor-pointer ml-3 w-7 h-7 flex items-center justify-center rounded-full bg-[#EAE3E3] hover:bg-[#d1c7c7] shadow transition-colors duration-200 border border-[#D4C4C4]"
                type="button"
                onClick={handleAICardToggle}
              >
                {aiButtonPosition ? (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                ) : (
                  <img
                    src="/icons/sidebar/material-symbols-light--robot.svg"
                    alt="AI Assistant"
                    className="w-4 h-4"
                  />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3 pr-1">
            <button
              onClick={() => handleSearch()}
              className="font-semibold font-(family-name:--font-IBMPlexSans) cursor-pointer flex items-center space-x-2 bg-[#EAE3E3] hover:bg-gray-300 text-[#5C543C] px-3 py-1.5 rounded-md transition-colors duration-200 text-sm"
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
              className="font-bold font-(family-name:--font-IBMPlexSans) cursor-pointer flex items-center space-x-2 bg-[#D44E4E] hover:bg-red-700 text-white px-3 py-1.5 rounded-md transition-colors duration-200 text-sm"
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

      {/* AI Assistant Chat Card render */}
      {aiButtonPosition && (
        <AIAssistantChatCard
          buttonPosition={aiButtonPosition}
          userData={userData}
        />
      )}

      {/* Sidebar */}
      <div className="flex mx-2 mt-1 mb-2 gap-1 flex-1 min-h-0">
        <div className="bg-[#F9F1F1] w-60 px-3 py-2 rounded-bl-lg shadow-sm flex flex-col">
          <div className="shadow-sm bg-[#759EDC]/43 bg-opacity-74 rounded-lg px-3 pt-2 pb-3">
            <p className="text-[#3F3131] text-xs font-medium font-(family-name:--font-IBMPlexSans)">
              Total Assets
            </p>
            <div className="flex items-center space-x-2">
              <p className="text-[#3F3131] text-xl font-semibold font-(family-name:--font-IBMPlexSans)">
                {showAssets ? formatCurrency(totalAssets) : "$****.**"}
              </p>
              <button
                type="button"
                className="focus:outline-none cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAssets((v) => !v);
                }}
                aria-label={showAssets ? "Hide assets" : "Show assets"}
              >
                <img
                  src="/icons/sidebar/mdi--eye.svg"
                  alt={showAssets ? "Hide" : "Show"}
                  className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity duration-150"
                />
              </button>
            </div>
          </div>

          {/* Buttons */}
          <SidebarButtons activePage={activePage} />

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
        <div className="bg-[#F9F1F1] flex-1 px-3 py-2 rounded-br-lg shadow-sm">
          {renderPage()}
        </div>
      </div>

      {/* Render Modal */}
      {showModal && (
        <>
          <div
            className={`fixed inset-0 z-50 ${
              animateOut ? "overlay-animate-out" : "overlay-animate-in"
            } bg-black`}
            onClick={() => {
              if (!animateOut)
                setModalState({ isOpen: false, type: "", title: "" });
            }}
          />
          <div
            className={`fixed inset-0 flex items-center justify-center z-60 pointer-events-none`}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={
                animateOut
                  ? "modal-animate-out pointer-events-auto"
                  : "modal-animate-in pointer-events-auto"
              }
            >
              {renderModalContent()}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
