const classTasks = [
  {
    className: "Computer Architecture",
    tasks: [
      {
        name: "Homework 1",
        isComplete: false,
        dueDate: new Date("2025-06-10"),
      },
      {
        name: "Quiz 1",
        isComplete: true,
        dueDate: new Date("2025-06-05"),
      },
    ],
  },
  {
    className: "Data Structures and Alg.",
    tasks: [
      {
        name: "Essay Draft",
        isComplete: false,
        dueDate: new Date("2025-07-12"),
      },
      {
        name: "Reading Assignment",
        isComplete: true,
        dueDate: new Date("2025-07-08"),
      },
      {
        name: "Reading Assignment",
        isComplete: true,
        dueDate: new Date("2025-07-08"),
      },
    ],
  },
  {
    className: "Software Engineering",
    tasks: [
      {
        name: "Essay Draft",
        isComplete: true,
        dueDate: new Date("2024-06-12"),
      },
      {
        name: "Reading Assignment",
        isComplete: true,
        dueDate: new Date("2025-07-08"),
      },
    ],
  },
  {
    className: "Linear Algebra",
    tasks: [
      {
        name: "Essay Draft",
        isComplete: false,
        dueDate: new Date("2025-06-12"),
      },
      {
        name: "Reading Assignment",
        isComplete: true,
        dueDate: new Date("2025-06-08"),
      },
    ],
  },
  {
    className: "UNIX Programming",
    tasks: [
      {
        name: "Essay Draft",
        isComplete: false,
        dueDate: new Date("2024-07-12"),
      },
      {
        name: "Reading Assignment",
        isComplete: true,
        dueDate: new Date("2025-07-08"),
      },
      {
        name: "Reading Assignment",
        isComplete: true,
        dueDate: new Date("2025-06-08"),
      },
      {
        name: "Reading Assignment",
        isComplete: true,
        dueDate: new Date("2024-06-08"),
      },
      
    ],
  },
];

export default function Tasks() {
  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="flex mb-4 px-1">
        <h1 className="text-2xl font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
          My Tasks
        </h1>
        <button
          className="cursor-pointer font-semibold bg-[#D9D9D9] hover:bg-[#FCD34D] px-3 rounded-2xl transition-colors duration-200 flex items-center font-(family-name:--font-IBMPlexSans) ml-4"
        >
          Add Class
        </button>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto h-full min-h-0 scrollbar-blue p-1"
      >
        {classTasks.map((classItem, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow py-4 px-4 flex flex-col"
          >
            {(() => {
              const now = new Date();
              const hasOverdue = classItem.tasks.some(task => !task.isComplete && task.dueDate < now);
              const hasIncomplete = classItem.tasks.some(task => !task.isComplete);
              const allComplete = classItem.tasks.every(task => task.isComplete);
              return (
                <div className="flex flex-row items-center mb-1 gap-1">
                  {hasOverdue && (
                    <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded border border-red-500 bg-red-500/40 text-red-700 w-auto" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>Urgent</span>
                  )}
                  {hasIncomplete && (
                    <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded border border-blue-500 bg-blue-500/40 text-blue-700 w-auto" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>Pending</span>
                  )}
                  {allComplete && !hasOverdue && !hasIncomplete && (
                    <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded border border-green-500 bg-green-500/40 text-green-700 w-auto" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>Complete</span>
                  )}
                </div>
              );
            })()}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[17px] font-bold text-[#3F3131]" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>{classItem.className}</span>
              <button className="p-1 cursor-pointer hover:bg-gray-100 rounded-md transition-colors">
                <img src="/icons/tasks/pepicons-pop--dots-x.svg" alt="More options" className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              {classItem.tasks.slice(0, 3).map((task, tIdx, arr) => (
                <div key={tIdx}>
                  <div className="flex items-start gap-3">
                    <button
                      className={`cursor-pointer w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 flex items-center justify-center transition-colors duration-200 ${task.isComplete ? 'bg-green-500 border-green-500' : 'border-gray-400 bg-white'}`}
                      aria-label={task.isComplete ? 'Task complete' : 'Task incomplete'}
                    >
                      {task.isComplete && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#3F3131]" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
                        {task.name}
                      </span>
                      <span className="flex items-center text-[11px] text-gray-500 mt-0.5" style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 400 }}>
                        <img src="/icons/tasks/cuida--calendar-outline.svg" alt="Due date" className="w-4 h-4 mr-1" />
                        {task.dueDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  {tIdx !== arr.length - 1 && (
                    <div className="border-b border-black my-2" />
                  )}
                </div>
              ))}
            </div>

            {(() => {
              const total = classItem.tasks.length;
              const completed = classItem.tasks.filter(t => t.isComplete).length;
              const percent = total === 0 ? 0 : (completed / total) * 100;
              return (
                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
                      Progress
                    </span>
                    <span className="text-xs text-gray-500" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
                      {completed}/{total}
                    </span>
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${percent}%`, background: '#535CFF' }}
                    />
                  </div>
                </div>
              );
            })()}
          </div>
        ))}
      </div>
    </div>
  );
}