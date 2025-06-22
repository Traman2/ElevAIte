export default function Dashboard() {
  
    return (
      <div className="flex flex-col h-full">
        <h1 className="text-2xl font-bold text-[#3F3131]" style={{ fontFamily: 'var(--font-IBMPlexSans)' }}>
          Overview
        </h1>
        
        <p className="font-medium text-[#3F3131] mb-3" style={{ fontFamily: 'var(--font-IBMPlexSans)' }}>
          Total of 3 Pending Tasks
        </p>

        <div className="grid grid-cols-4 grid-rows-2 gap-2 flex-1">
          <div className="bg-white rounded-lg shadow-sm p-4">
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 col-span-2">
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 col-span-3">
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
          </div>
        </div>
      </div>
    );
}