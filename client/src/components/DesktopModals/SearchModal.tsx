
interface Props {
  onClose: () => void;
}

export default function SearchModal({onClose} : Props) {

  return (
    <>
      <div className="bg-[#E7D7D7] rounded-lg p-8 shadow-lg w-[500px]">
        <h2 className="text-2xl font-bold text-[#3F3131] font-(family-name:--font-IBMPlexMono) mb-4">
          Search
        </h2>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-sm bg-gray-300 font-(family-name:--font-IBMPlexSans) text-[#3F3131] font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-gray-400 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
