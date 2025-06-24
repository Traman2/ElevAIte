interface Props {
  onAddTransaction: () => void;
}

export default function Transactions({ onAddTransaction }: Props) {
  return (
    <div>
      <div className="flex">
        <h1 className="text-2xl font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
          Transactions
        </h1>
        <button
          onClick={onAddTransaction}
          className="cursor-pointer font-semibold bg-[#D9D9D9] hover:bg-[#FCD34D] px-3 rounded-2xl transition-colors duration-200 flex items-center font-(family-name:--font-IBMPlexSans) ml-4"
        >
          Add
        </button>
      </div>

      <p className="font-medium text-[#3F3131] mb-5 font-(family-name:--font-IBMPlexSans)">
        Credit Card Payment Due 1 Aug, 2025
      </p>

      <h2 className="text-xl font-semibold text-[#3F3131] font-(family-name:--font-IBMPlexSans) mb-2">
        Accounts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-5">
        <div className="bg-[#57C785]/60 border border-[#4CAF75]/43 rounded-2xl py-3 px-4 min-h-16">
          <div className="mb-1">
            <h3 className="text-sm font-medium text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
              Everyday Checking ...1234
            </h3>
            <p className="text-lg font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
              USD $2,239.22
            </p>
          </div>
          <div className="flex flex-row items-center justify-start gap-x-2 mt-2">
            <button className="w-auto cursor-pointer font-semibold bg-[#D9D9D9] hover:bg-[#004687]/60 px-3 py-0.5 rounded-2xl transition-colors duration-200 flex items-center justify-center font-['IBM_Plex_Sans'] text-sm">
              Transactions
            </button>
            <button className="w-auto cursor-pointer font-semibold bg-[#D9D9D9] hover:bg-[#1E90FF] px-3 py-0.5 rounded-2xl transition-colors duration-200 flex items-center justify-center font-['IBM_Plex_Sans'] text-sm">
              Maps
            </button>
          </div>
        </div>
      </div>
      <h2 className="text-xl font-semibold text-[#3F3131] font-(family-name:--font-IBMPlexSans) mb-2">
        Recent Purchases
      </h2>

      <div className="relative overflow-x-auto rounded-md font-(family-name:--font-IBMPlexSans)">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-[#c2bcbc]">
            <tr>
              <th scope="col" className="px-6 py-3">
                Product name
              </th>
              <th scope="col" className="px-6 py-3">
                Color
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-[#D9D4D4] border-b border-gray-400">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                Apple MacBook Pro 17"
              </th>
              <td className="px-6 py-4 text-gray-700">Silver</td>
              <td className="px-6 py-4 text-gray-700">Laptop</td>
              <td className="px-6 py-4 text-gray-700">$2999</td>
            </tr>
            <tr className="bg-[#D9D4D4] border-b border-gray-400">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                Microsoft Surface Pro
              </th>
              <td className="px-6 py-4 text-gray-700">White</td>
              <td className="px-6 py-4 text-gray-700">Laptop PC</td>
              <td className="px-6 py-4 text-gray-700">$1999</td>
            </tr>
            <tr className="bg-[#D9D4D4]">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                Magic Mouse 2
              </th>
              <td className="px-6 py-4 text-gray-700">Black</td>
              <td className="px-6 py-4 text-gray-700">Accessories</td>
              <td className="px-6 py-4 text-gray-700">$99</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
