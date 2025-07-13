import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

interface UserData {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Props {
  userData: UserData | null;
}

interface UserBankAccount {
  _id: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  userId: string;
  balance: number;
  incoming: number;
  spending: number;
}

interface Internship {
  _id: string;
  date: string;
  name: string;
  category: string;
  employer: string;
  status: "Accepted" | "Pending" | "Reviewed" | "Rejected";
  description?: string;
  userId: string;
}

interface ClassData {
  _id: string;
  className: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TaskData {
  _id: string;
  name: string;
  isComplete: boolean;
  dueDate: Date;
  classId: string;
  createdAt: Date;
  updatedAt: Date;
}

function getTruncatedTaskName(name: string) {
  return name.length > 20 ? name.slice(0, 20) + '...' : name;
}

const statusColors: Record<string, string> = {
  Accepted: "bg-green-200 text-green-800 border-green-400",
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-400",
  Reviewed: "bg-blue-100 text-blue-800 border-blue-400",
  Rejected: "bg-red-100 text-red-800 border-red-400",
};

// ChartLegendRenderer is needed to avoid ref type issues with inline functions in Recharts Legend
function ChartLegendRenderer(props: any) {
  return <ChartLegendContent {...props} />;
}

export default function Dashboard({ userData }: Props) {
  const navigate = useNavigate();
  const [userBankAccounts, setUserBankAccounts] = useState<
    UserBankAccount[] | null
  >(null);
  const [internships, setInternships] = useState<Internship[] | null>(null);
  const [userClasses, setUserClasses] = useState<ClassData[]>([]);
  const [userTasks, setUserTasks] = useState<TaskData[]>([]);

  const handleTransactions = () => {
    navigate("/Transactions");
  };

  const handleAccount = () => {
    navigate("/Transactions");
  };

  const handleTasks = () => {
    navigate("/Tasks");
  };

  const handleInternships = () => {
    navigate("/InternshipManager");
  };

  useEffect(() => {
    if (!userData) return;
    axios
      .get(`http://localhost:3000/class/user/${userData._id}`)
      .then((classRes) => {
        setUserClasses(classRes.data);
        const taskPromises = classRes.data.map((classItem: ClassData) =>
          axios.get(`http://localhost:3000/task/class/${classItem._id}`)
        );
        Promise.all(taskPromises)
          .then((taskResponses) => {
            const allTasks = taskResponses.flatMap((res) => res.data);
            setUserTasks(allTasks);
          })
          .catch((err) => {
            console.error("Error fetching tasks:", err);
          });
      })
      .catch((err) => {
        console.error("Error fetching user classes:", err);
      });
  }, [userData]);

  useEffect(() => {
    if (!userData) return;
    const fetchUserData = () => {
      axios
        .get(`http://localhost:3000/bankaccount/${userData._id}`)
        .then((response) => {
          setUserBankAccounts(response.data);
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
        });
    };
    const fetchInternships = () => {
      axios
        .get(`http://localhost:3000/internship/user/${userData._id}`)
        .then((response) => {
          setInternships(response.data);
        })
        .catch((err) => {
          console.error("Error fetching internships:", err);
        });
    };
    fetchUserData();
    fetchInternships();
  }, [userData]);

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const assignmentsChartData = userClasses.map((cls) => {
    const classTasks = userTasks.filter((task) => task.classId === cls._id);
    const completed = classTasks.filter((task) => task.isComplete).length;
    const pending = classTasks.filter((task) => !task.isComplete).length;
    return {
      className: cls.className,
      completed,
      pending,
    };
  });

  const assignmentsChartConfig = {
    completed: {
      label: "Completed",
      color: "#22c55e", // green
    },
    pending: {
      label: "Pending",
      color: "#ef4444", // red
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <h1 className="text-2xl font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans) px-1">
        Overview
      </h1>

      <p className="font-medium text-[#3F3131] mb-3 font-(family-name:--font-IBMPlexSans) px-1">
        Total of 3 Pending Tasks
      </p>

      <div className="grid grid-cols-4 grid-rows-2 gap-1 flex-1 min-h-0 overflow-hidden p-1">
        <div className="bg-white rounded-lg shadow-sm px-3 pt-2 pb-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans) flex-shrink-0">
              Asset Breakdown
            </h2>
            <button
              onClick={() => handleAccount()}
              className="cursor-pointer text-sm font-semibold text-[#3F3131] bg-[#F3F3F3] hover:bg-[#FCD34D] px-3 rounded-xl transition-colors duration-200 h-6 flex items-center"
            >
              View More
            </button>
          </div>

          {userBankAccounts &&
          userBankAccounts.filter(
            (account) => account.accountType === "Savings"
          ).length > 0 ? (
            <div className="space-y-2 overflow-y-auto min-h-0 flex-1">
              {userBankAccounts
                .filter((account) => account.accountType === "Savings")
                .slice(0, 2)
                .map((account) => (
                  <div
                    key={account._id}
                    className="bg-[#57C785]/60 border border-[#4CAF75]/43 rounded-2xl py-3 px-4 min-h-16"
                  >
                    <div className="mb-1">
                      <h3 className="text-sm font-medium text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                        {account.accountName} ...1234
                      </h3>
                      <p className="text-lg font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                        USD {formatCurrency(account.balance)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-start">
                      <div className="flex flex-col items-start space-y-0.5">
                        <div className="flex items-center space-x-1">
                          <img
                            src="/icons/overview/ant-design--stock-outlined.svg"
                            alt="Incoming"
                            className="w-4 h-4"
                          />
                          <p className="text-sm font-medium text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                            Incoming
                          </p>
                        </div>
                        <p className="text-sm font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                          USD {formatCurrency(account.incoming)}
                        </p>
                      </div>

                      <div className="flex flex-col items-start space-y-0.5">
                        <div className="flex items-center space-x-1">
                          <img
                            src="/icons/overview/uil--money-withdraw.svg"
                            alt="Spending"
                            className="w-4 h-4"
                          />
                          <p className="text-sm font-medium text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                            Spending
                          </p>
                        </div>
                        <p className="text-sm font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                          USD {formatCurrency(account.spending)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex items-center justify-center flex-1">
              <div className="border-dashed border-[#654545] py-10 px-15 rounded-4xl border-3">
                <p className="text-[#654545] text-2xl font-bold font-(family-name:--font-IBMPlexSans)">
                  Add Assets
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-sm col-span-2 px-3 pt-2 pb-1 flex flex-col">
          <h2 className="text-base font-bold text-[#3F3131] mb-2 font-(family-name:--font-IBMPlexSans) flex-shrink-0">
            Assignments Breakdown
          </h2>

          {(userTasks.length === 0 || assignmentsChartData.length === 0) ? (
            <div className="flex flex-1 h-full items-center justify-center min-h-[200px]">
              <div className="border-dashed border-[#654545] py-6 px-8 rounded-4xl border-3">
                <p className="text-[#654545] text-lg font-bold font-(family-name:--font-IBMPlexSans)">
                  No Tasks to Display Graph
                </p>
              </div>
            </div>
          ) : (
            <ChartContainer config={assignmentsChartConfig} className="min-h-[200px] p-2 w-full">
              <BarChart accessibilityLayer data={assignmentsChartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="className"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.length > 10 ? value.slice(0, 10) + '…' : value}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
                <Bar dataKey="pending" fill="var(--color-pending)" radius={4} />
                <ChartLegend
                  content={ChartLegendRenderer}
                  layout="horizontal"
                  align="center"
                  verticalAlign="bottom"
                  iconType="square"
                />
              </BarChart>
            </ChartContainer>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-sm px-3 pt-2 pb-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans) flex-shrink-0">
              Card Balance
            </h2>
            <button
              onClick={() => handleTransactions()}
              className="cursor-pointer text-sm font-semibold text-[#3F3131] bg-[#F3F3F3] hover:bg-[#FCD34D] px-3 rounded-xl transition-colors duration-200 h-6 flex items-center"
            >
              View More
            </button>
          </div>

          {userBankAccounts &&
          userBankAccounts.filter(
            (account) =>
              account.accountType === "Credit" ||
              account.accountType === "Debit"
          ).length > 0 ? (
            <div className="space-y-2 overflow-y-auto min-h-0 flex-1">
              {userBankAccounts
                .filter(
                  (account) =>
                    account.accountType === "Credit" ||
                    account.accountType === "Debit"
                )
                .slice(0, 2)
                .map((account) => (
                  <div
                    key={account._id}
                    className={`${
                      account.accountType === "Credit"
                        ? "bg-[#EE9898] border border-[#DA7C7C]"
                        : "bg-[#57C785]/60 border border-[#4CAF75]/43"
                    } rounded-2xl py-3 px-4 min-h-16`}
                  >
                    <div className="mb-1">
                      <h3 className="text-sm font-medium text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                        {account.accountName} ...1314
                      </h3>
                      <p className="text-lg font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                        USD {formatCurrency(account.balance)}
                      </p>
                      <button
                        onClick={() => handleTransactions()}
                        className="font-bold font-(family-name:--font-IBMPlexSans) cursor-pointer bg-[#FFF] hover:bg-red-600 text-[#574545] px-2 py-1 mt-2 rounded-2xl text-xs transition-colors duration-200 "
                      >
                        See Transaction History
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex items-center justify-center flex-1">
              <div className="border-dashed border-[#654545] py-10 px-15 rounded-4xl border-3">
                <p className="text-[#654545] text-2xl font-bold font-(family-name:--font-IBMPlexSans)">
                  Add Cards
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm px-3 pt-2 pb-4 col-span-3 flex flex-col min-h-0 flex-1">
        <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans) flex-shrink-0">
              Internships
            </h2>
            <button
              onClick={() => handleInternships()}
              className="cursor-pointer text-sm font-semibold text-[#3F3131] bg-[#F3F3F3] hover:bg-[#FCD34D] px-3 rounded-xl transition-colors duration-200 h-6 flex items-center"
            >
              View More
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3 min-h-0 flex-1">
            {internships && internships.length > 0 ? (
              internships.slice(0, 4).map((internship) => (
                <div
                  key={internship._id}
                  className="bg-[#F3F3F3] border border-[#E5E7EB] rounded-2xl p-4 flex flex-col shadow-sm h-full"
                >
                  
                  <span className="text-md font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                    {internship.name.length > 13
                      ? internship.name.slice(0, 13) + "..."
                      : internship.name}
                  </span>
                  <span className="text-xs text-[#654545] font-medium font-(family-name:--font-IBMPlexSans)">
                    {internship.employer}
                  </span>
                  <span className="text-xs text-[#3F3131] font-medium font-(family-name:--font-IBMPlexSans) mt-2">
                    {new Date(internship.date).toLocaleDateString()}
                  </span>
                  <div className="flex-1 flex flex-col justify-end mt-2">
                    {internship.description && (
                      <span className="text-xs text-[#654545] font-normal font-(family-name:--font-IBMPlexSans) break-words line-clamp-6 overflow-hidden">
                        {internship.description}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-3 justify-start">
                    <span className="inline-block bg-[#E5E7EB] rounded-md border border-[#E5E7EB] px-2 py-0.5 text-xs text-[#3F3131] font-medium font-(family-name:--font-IBMPlexSans)">
                      {internship.category}
                    </span>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-md border text-[11px] font-bold font-(family-name:--font-IBMPlexSans) ${statusColors[internship.status]}`}
                    >
                      {internship.status}
                    </span>
                    
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 flex items-center justify-center">
                <div className="border-dashed border-[#654545] py-8 px-12 rounded-4xl border-3">
                  <p className="text-[#654545] text-lg font-bold font-(family-name:--font-IBMPlexSans)">
                    No Internships
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm px-3 pt-2 pb-4 flex-1 min-h-0 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans) flex-shrink-0">
              All Tasks
            </h2>
            <button
              onClick={() => handleTasks()}
              className="cursor-pointer text-sm font-semibold text-[#3F3131] bg-[#F3F3F3] hover:bg-[#FCD34D] px-3 rounded-xl transition-colors duration-200 h-6 flex items-center"
            >
              View More
            </button>
          </div>
          {(() => {
            const allTasks = userTasks
              .sort(
                (a, b) =>
                  new Date(a.dueDate).getTime() -
                  new Date(b.dueDate).getTime()
              )
              .filter((task) => !task.isComplete)
              .slice(0, 4);
            if (allTasks.length === 0) {
              return (
                <div className="flex flex-1 h-full items-center justify-center">
                  <div className="border-dashed border-[#654545] py-6 px-8 rounded-4xl border-3">
                    <p className="text-[#654545] text-lg font-bold font-(family-name:--font-IBMPlexSans)">
                      No Pending Tasks
                    </p>
                  </div>
                </div>
              );
            }
            return (
              <div className="grid grid-rows-4 grid-cols-1 gap-3 overflow-y-auto min-h-0 flex-1 h-full">
                {allTasks.map((task, idx) => {
                  const className = userClasses.find(cls => cls._id === task.classId)?.className || "Unknown Class";
                  const dateObj = typeof task.dueDate === 'string' ? new Date(task.dueDate) : task.dueDate;
                  const formattedDate = dateObj.toLocaleDateString();
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-[#F3F3F3] rounded-xl px-3 py-2 border border-[#E5E7EB] row-span-1"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">{getTruncatedTaskName(task.name)}</span>
                        <span className="text-xs text-[#654545] font-medium font-(family-name:--font-IBMPlexSans)">{className}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-[#3F3131] font-medium font-(family-name:--font-IBMPlexSans)">{formattedDate}</span>
                        <span className={`text-xs font-bold font-(family-name:--font-IBMPlexSans) ${task.isComplete ? "text-green-600" : "text-red-600"}`}>{task.isComplete ? "Complete" : "Pending"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}