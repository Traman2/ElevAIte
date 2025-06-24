interface Props {
  onAddAsset: () => void;
}

export default function Accounts({ onAddAsset }: Props) {
    return (
      <div>
        <div className="flex">
          <h1 className="text-2xl font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
            Accounts
          </h1>
          <button 
            onClick={onAddAsset}
            className="cursor-pointer font-semibold bg-[#D9D9D9] hover:bg-[#FCD34D] px-3 rounded-2xl transition-colors duration-200 flex items-center font-(family-name:--font-IBMPlexSans) ml-4"
          >
            Add
          </button>
        </div>
        
        <p className="font-medium text-[#3F3131] mb-3 font-(family-name:--font-IBMPlexSans)">
          Interest Payment on 12 Jul, 2025 for Account ...1202
        </p>
      </div>
    );
}