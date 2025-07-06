import axios from "axios";
import { useEffect, useState, useRef } from "react";

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
  isComplete: false;
  dueDate: Date;
  classId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserData {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Props {
  userData: UserData | null;
  onAddClass: () => void;
  refreshKey: number;
  addNewTask: (classId: string) => void;
}

export default function Tasks({
  userData,
  onAddClass,
  refreshKey,
  addNewTask,
}: Props) {
  const [userClasses, setUserClasses] = useState<ClassData[]>([]);
  const [userTasks, setUserTasks] = useState<TaskData[]>([]);
  const [openMenuIdx, setOpenMenuIdx] = useState<number | null>(null);
  const menuRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [editingClassName, setEditingClassName] = useState<string>("");

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
  }, [userData, refreshKey]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        openMenuIdx !== null &&
        menuRefs.current[openMenuIdx] &&
        !(menuRefs.current[openMenuIdx] as any).contains(event.target)
      ) {
        setOpenMenuIdx(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuIdx]);

  const handleDeleteClass = (classId: string) => {
    setOpenMenuIdx(null);
    axios
      .delete(`http://localhost:3000/class/${classId}`)
      .then(async () => {
        if (userData) {
          const classRes = await axios.get(
            `http://localhost:3000/class/user/${userData._id}`
          );
          setUserClasses(classRes.data);
          const taskPromises = classRes.data.map((classItem: ClassData) =>
            axios.get(`http://localhost:3000/task/class/${classItem._id}`)
          );
          const taskResponses = await Promise.all(taskPromises);
          const allTasks = taskResponses.flatMap((res) => res.data);
          setUserTasks(allTasks);
        }
      })
      .catch((err) => {
        alert("Failed to delete class");
        console.error(err);
      });
  };

  const handleEditClass = (classItem: ClassData) => {
    setEditingClassId(classItem._id);
    setEditingClassName(classItem.className);
    setOpenMenuIdx(null);
  };

  const handleSaveEdit = (classId: string) => {
    axios
      .patch(`http://localhost:3000/class/${classId}`, {
        className: editingClassName,
      })
      .then(async () => {
        setEditingClassId(null);
        setEditingClassName("");
        if (userData) {
          const classRes = await axios.get(
            `http://localhost:3000/class/user/${userData._id}`
          );
          setUserClasses(classRes.data);
        }
      })
      .catch((err) => {
        alert("Failed to update class");
        console.error(err);
      });
  };

  const handleToggleTaskComplete = (taskId: string, isComplete: boolean) => {
    axios
      .patch(`http://localhost:3000/task/${taskId}`, {
        isComplete: !isComplete,
      })
      .then(async () => {
        if (userData) {
          const classRes = await axios.get(
            `http://localhost:3000/class/user/${userData._id}`
          );
          setUserClasses(classRes.data);
          const taskPromises = classRes.data.map((classItem: ClassData) =>
            axios.get(`http://localhost:3000/task/class/${classItem._id}`)
          );
          const taskResponses = await Promise.all(taskPromises);
          const allTasks = taskResponses.flatMap((res) => res.data);
          setUserTasks(allTasks);
        }
      })
      .catch((err) => {
        alert("Failed to update task status");
        console.error(err);
      });
  };

  function getTruncatedClassName(name: string) {
    return name.length > 20 ? name.slice(0, 20) + "..." : name;
  }

  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="flex mb-4 px-1">
        <h1 className="text-2xl font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
          My Tasks
        </h1>
        <button
          onClick={onAddClass}
          className="cursor-pointer font-semibold bg-[#D9D9D9] hover:bg-[#FCD34D] px-3 rounded-2xl transition-colors duration-200 flex items-center font-(family-name:--font-IBMPlexSans) ml-4"
        >
          Add Class
        </button>
      </div>

      {userClasses.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <button
            onClick={onAddClass}
            className="cursor-pointer text-lg font-semibold text-gray-500 hover:text-blue-600 transition-colors border border-dashed border-gray-400 px-6 py-4 rounded-lg bg-gray-50"
            style={{ fontFamily: "IBM Plex Sans, sans-serif" }}
          >
            Add New Class
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto h-full min-h-0 scrollbar-blue p-1">
          {userClasses.map((classItem, idx) => {
            const classTasks = userTasks.filter(
              (task) => task.classId === classItem._id
            );
            const now = new Date();
            const hasOverdue = classTasks.some(
              (task) => !task.isComplete && new Date(task.dueDate) < now
            );
            const hasIncomplete = classTasks.some((task) => !task.isComplete);
            const allComplete =
              classTasks.length > 0 &&
              classTasks.every((task) => task.isComplete);
            const total = classTasks.length;
            const completed = classTasks.filter((t) => t.isComplete).length;
            const percent = total === 0 ? 0 : (completed / total) * 100;
            if (classTasks.length === 0) {
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow py-4 px-4 flex flex-col h-full"
                >
                  <div className="flex flex-row items-center mb-1 gap-1">
                    <span
                      className="inline-block px-2 py-0.5 text-xs font-semibold rounded border border-gray-400 bg-gray-200 text-gray-700 w-auto"
                      style={{ fontFamily: "IBM Plex Sans, sans-serif" }}
                    >
                      No Tasks
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2 relative">
                    <div
                      className="text-[17px] font-bold text-[#3F3131] truncate flex items-center"
                      style={{
                        fontFamily: "IBM Plex Sans, sans-serif",
                        maxWidth: "240px",
                      }}
                      title={classItem.className}
                    >
                      {editingClassId === classItem._id ? (
                        <>
                          <input
                            type="text"
                            value={editingClassName}
                            onChange={(e) =>
                              setEditingClassName(e.target.value)
                            }
                            className="border rounded px-1 py-0.5 text-[15px] font-normal text-[#3F3131]"
                            style={{
                              fontFamily: "IBM Plex Sans, sans-serif",
                              maxWidth: "140px",
                            }}
                            autoFocus
                          />
                          <button
                            className=" cursor-pointer ml-2 px-2 py-0.5 bg-green-500 text-white rounded text-xs align-middle"
                            style={{ height: "28px", minHeight: "28px" }}
                            onClick={() => handleSaveEdit(classItem._id)}
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        getTruncatedClassName(classItem.className)
                      )}
                    </div>
                    <button
                      ref={(el) => {
                        menuRefs.current[idx] = el;
                      }}
                      className="p-1 cursor-pointer hover:bg-gray-100 rounded-md transition-colors relative"
                      onClick={() =>
                        setOpenMenuIdx(openMenuIdx === idx ? null : idx)
                      }
                    >
                      <img
                        src="/icons/tasks/pepicons-pop--dots-x.svg"
                        alt="More options"
                        className="w-6 h-6"
                      />
                      {openMenuIdx === idx && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-2xl overflow-clip shadow-lg z-10">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={() => handleEditClass(classItem)}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-red-100"
                            onClick={() => addNewTask(classItem._id)}
                          >
                            Add Task
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                            onClick={() => handleDeleteClass(classItem._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </button>
                  </div>
                  <div className="flex flex-1 items-center justify-center">
                    <button
                      onClick={() => addNewTask(classItem._id)}
                      className="cursor-pointer px-6 py-2 border-2 border-dashed border-gray-400 rounded-lg text-gray-600 font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Add New Task
                    </button>
                  </div>
                </div>
              );
            }
            return (
              <div
                key={idx}
                className="bg-white rounded-xl shadow py-4 px-4 flex flex-col"
              >
                <div className="flex flex-row items-center mb-1 gap-1">
                  {hasOverdue && (
                    <span
                      className="inline-block px-2 py-0.5 text-xs font-semibold rounded border border-red-500 bg-red-500/40 text-red-700 w-auto"
                      style={{ fontFamily: "IBM Plex Sans, sans-serif" }}
                    >
                      Urgent
                    </span>
                  )}
                  {hasIncomplete && (
                    <span
                      className="inline-block px-2 py-0.5 text-xs font-semibold rounded border border-blue-500 bg-blue-500/40 text-blue-700 w-auto"
                      style={{ fontFamily: "IBM Plex Sans, sans-serif" }}
                    >
                      Pending
                    </span>
                  )}
                  {allComplete && !hasOverdue && !hasIncomplete && (
                    <span
                      className="inline-block px-2 py-0.5 text-xs font-semibold rounded border border-green-500 bg-green-500/40 text-green-700 w-auto"
                      style={{ fontFamily: "IBM Plex Sans, sans-serif" }}
                    >
                      Complete
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mb-2 relative">
                  <div
                    className="text-[17px] font-bold text-[#3F3131] truncate flex items-center"
                    style={{
                      fontFamily: "IBM Plex Sans, sans-serif",
                      maxWidth: "200px",
                    }}
                    title={classItem.className}
                  >
                    {editingClassId === classItem._id ? (
                      <>
                        <input
                          type="text"
                          value={editingClassName}
                          onChange={(e) => setEditingClassName(e.target.value)}
                          className="border rounded px-1 py-0.5 text-[15px] font-normal text-[#3F3131]"
                          style={{
                            fontFamily: "IBM Plex Sans, sans-serif",
                            maxWidth: "140px",
                          }}
                          autoFocus
                        />
                        <button
                          className="cursor-pointer ml-2 px-2 py-0.5 bg-green-500 text-white rounded text-xs align-middle"
                          style={{ height: "28px", minHeight: "28px" }}
                          onClick={() => handleSaveEdit(classItem._id)}
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      getTruncatedClassName(classItem.className)
                    )}
                  </div>
                  <button
                    ref={(el) => {
                      menuRefs.current[idx] = el;
                    }}
                    className="p-1 cursor-pointer hover:bg-gray-100 rounded-md transition-colors relative"
                    onClick={() =>
                      setOpenMenuIdx(openMenuIdx === idx ? null : idx)
                    }
                  >
                    <img
                      src="/icons/tasks/pepicons-pop--dots-x.svg"
                      alt="More options"
                      className="w-6 h-6"
                    />
                    {openMenuIdx === idx && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => handleEditClass(classItem)}
                        >
                          Edit
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => addNewTask(classItem._id)}
                        >
                          Add New Task
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                          onClick={() => handleDeleteClass(classItem._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </button>
                </div>
                <div className="flex flex-col gap-2 mb-10">
                  {classTasks.map((task, tIdx, arr) => (
                    <div key={tIdx}>
                      <div className="flex items-start gap-3">
                        <button
                          className={`cursor-pointer w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 flex items-center justify-center transition-colors duration-200 ${
                            task.isComplete
                              ? "bg-green-500 border-green-500"
                              : "border-gray-400 bg-white"
                          }`}
                          aria-label={
                            task.isComplete
                              ? "Task complete"
                              : "Task incomplete"
                          }
                          onClick={() =>
                            handleToggleTaskComplete(task._id, task.isComplete)
                          }
                        >
                          {task.isComplete && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </button>
                        <div className="flex flex-col">
                          <span
                            className={`text-sm ${task.isComplete && "line-through decoration-2"} font-bold text-[#3F3131]`}
                            style={{ fontFamily: "IBM Plex Sans, sans-serif" }}
                          >
                            {task.name}
                          </span>
                          <span
                            className="flex items-center text-[11px] text-gray-500 mt-0.5"
                            style={{
                              fontFamily: "IBM Plex Sans, sans-serif",
                              fontWeight: 400,
                            }}
                          >
                            <img
                              src="/icons/tasks/cuida--calendar-outline.svg"
                              alt="Due date"
                              className="w-4 h-4 mr-1"
                            />
                            {new Date(task.dueDate).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                      {tIdx !== arr.length - 1 && (
                        <div className="border-b border-black my-2" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-1">
                    <span
                      className="text-xs text-gray-500"
                      style={{ fontFamily: "IBM Plex Sans, sans-serif" }}
                    >
                      Progress
                    </span>
                    <span
                      className="text-xs text-gray-500"
                      style={{ fontFamily: "IBM Plex Sans, sans-serif" }}
                    >
                      {completed}/{total}
                    </span>
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${percent}%`, background: "#535CFF" }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
