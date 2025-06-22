import { useNavigate } from "react-router-dom";


export default function Dashboard() {
  const navigate = useNavigate();
  const handleTransactions = () => {
    navigate("/Transactions");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <h1 className="text-2xl font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
        Overview
      </h1>

      <p className="font-medium text-[#3F3131] mb-3 font-(family-name:--font-IBMPlexSans)">
        Total of 3 Pending Tasks
      </p>

      <div className="grid grid-cols-4 grid-rows-2 gap-1 flex-1 min-h-0 overflow-hidden">
        <div className="bg-white rounded-lg shadow-sm px-3 pt-2 pb-1 flex flex-col min-h-0 overflow-hidden">
          <h2 className="text-base font-bold text-[#3F3131] mb-2 font-(family-name:--font-IBMPlexSans) flex-shrink-0">
            Account Breakdown
          </h2>

          <div className="space-y-2 overflow-y-auto min-h-0 flex-1">
            <div className="bg-[#57C785]/60 border border-[#4CAF75]/43 rounded-2xl py-3 px-4 min-h-16">
              <div className="mb-1">
                <h3 className="text-sm font-medium text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                  Checking Account ...1234
                </h3>
                <p className="text-lg font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                  USD $2,456.78
                </p>
              </div>

              <div className="flex items-center justify-between">
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
                    USD $1,234.56
                  </p>
                </div>

                <div className="w-px h-6 bg-black"></div>

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
                    USD $567.89
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#57C785]/60 border border-[#4CAF75]/43 rounded-2xl py-3 px-4 min-h-16">
              <div className="mb-1">
                <h3 className="text-sm font-medium text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                  Savings Account ...5678
                </h3>
                <p className="text-lg font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                  USD $8,901.23
                </p>
              </div>

              <div className="flex items-center justify-between">
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
                    USD $2,345.67
                  </p>
                </div>

                <div className="w-px h-6 bg-black"></div>

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
                    USD $123.45
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm col-span-2 px-3 pt-2 pb-1 flex flex-col">
          <h2 className="text-base font-bold text-[#3F3131] mb-2 font-(family-name:--font-IBMPlexSans) flex-shrink-0">
            Daily Spending to Earning Ratio
          </h2>

          <div className="flex items-center justify-center flex-1">
            <div className="border-dashed border-[#654545] py-10 px-15 rounded-4xl border-3">
              <p className="text-[#654545] text-2xl font-bold font-(family-name:--font-IBMPlexSans)">
                Graph Coming Soon
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm px-3 pt-2 pb-1 flex flex-col min-h-0 overflow-hidden">
          <h2 className="text-base font-bold text-[#3F3131] mb-2 font-(family-name:--font-IBMPlexSans) flex-shrink-0">
            Card Balance
          </h2>
          <div className="space-y-2 overflow-y-auto min-h-0 flex-1">
            <div className="bg-[#EE9898] border border-[#DA7C7C] rounded-2xl py-3 px-4 min-h-16">
              <div className="mb-1">
                <h3 className="text-sm font-medium text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                  Credit Card ...1314
                </h3>
                <p className="text-lg font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                  USD $22.95
                </p>
                <button onClick={() => handleTransactions()} className="font-bold font-(family-name:--font-IBMPlexSans) cursor-pointer bg-[#FFF] hover:bg-red-600 text-[#574545] px-2 py-1 mt-2 rounded-2xl text-xs transition-colors duration-200 ">
                  See Transaction History
                </button>
              </div>
            </div>

            <div className="bg-[#57C785]/60 border border-[#4CAF75]/43 rounded-2xl py-3 px-4 min-h-16">
              <div className="mb-1">
                <h3 className="text-sm font-medium text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                  Credit Card ...1314
                </h3>
                <p className="text-lg font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                  USD $8,901.23
                </p>
                <button onClick={() => handleTransactions()} className="font-bold font-(family-name:--font-IBMPlexSans) cursor-pointer bg-[#FFF] hover:bg-red-600 text-[#574545] px-2 py-1 mt-2 rounded-2xl text-xs transition-colors duration-200 ">
                  See Transaction History
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm px-3 pt-2 pb-1 col-span-3">
          <h2 className="text-base font-bold text-[#3F3131] mb-2 font-(family-name:--font-IBMPlexSans) flex-shrink-0">
            Upcoming Assignments
          </h2>
        </div>
        <div className="bg-white rounded-lg shadow-sm px-3 pt-2 pb-1">
          <h2 className="text-base font-bold text-[#3F3131] mb-2 font-(family-name:--font-IBMPlexSans) flex-shrink-0">
            Tasks
          </h2>
        </div>
      </div>
    </div>
  );
}
