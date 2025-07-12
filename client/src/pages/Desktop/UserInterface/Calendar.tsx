import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Card } from "../../../components/ui/card";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface TaskData {
  _id: string;
  name: string;
  isComplete: boolean;
  dueDate: string;
  classId: string;
  createdAt: string;
  updatedAt: string;
}

function getMonthMatrix(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const matrix = [];
  let day = 1 - firstDay.getDay();
  for (let i = 0; i < 6; i++) {
    const week = [];
    for (let j = 0; j < 7; j++, day++) {
      const date = new Date(year, month, day);
      week.push(date);
    }
    matrix.push(week);
  }
  return matrix;
}

function getWeekDates(date: Date) {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function isToday(date: Date) {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export default function Calendar() {
  const [view, setView] = useState<'month' | 'week' | 'day'>("month");
  const [current, setCurrent] = useState(new Date());
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [hoverTasks, setHoverTasks] = useState<TaskData[] | null>(null);
  const [hoverPos, setHoverPos] = useState<{x: number, y: number} | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardDims, setCardDims] = useState<{width: number, height: number}>({width: 208, height: 180});
  useEffect(() => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setCardDims({ width: rect.width, height: rect.height });
    }
  }, [hoverTasks, hoverPos]);

  // Fetch user data and tasks
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get("http://localhost:3000/user/me", {
        headers: { "x-auth-token": token },
      })
      .then((res) => {
        // Fetch classes for user
        return axios.get(`http://localhost:3000/class/user/${res.data._id}`);
      })
      .then((classRes) => {
        const classList = classRes.data;
        // Fetch all tasks for each class
        const taskPromises = classList.map((classItem: any) =>
          axios.get(`http://localhost:3000/task/class/${classItem._id}`)
        );
        return Promise.all(taskPromises);
      })
      .then((taskResponses) => {
        const allTasks = taskResponses.flatMap((res) => res.data);
        setTasks(allTasks);
      })
      .catch((err) => {
        // Optionally handle error
        console.error(err);
      });
  }, []);

  const goToPrev = () => {
    const d = new Date(current);
    if (view === "month") d.setMonth(d.getMonth() - 1);
    else if (view === "week") d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setCurrent(d);
  };
  const goToNext = () => {
    const d = new Date(current);
    if (view === "month") d.setMonth(d.getMonth() + 1);
    else if (view === "week") d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setCurrent(d);
  };

  return (
    <Card className="h-full flex flex-col px-1 pt-2 pb-4 bg-[#F9F1F1] overflow-hidden">
      {/* Header: All controls in one row */}
      <div className="flex items-center justify-between mb-1 gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans) whitespace-nowrap mr-4">
          Calendar
        </h1>
        <div className="flex gap-2 flex-shrink-0">
          <button
            className={`px-3 py-1 rounded-xl font-semibold text-sm transition-colors ${view === "month" ? "bg-[#FADEDE] text-[#3F3131]" : "bg-[#E7D7D7] text-[#3F3131] hover:bg-[#FADEDE]"}`}
            onClick={() => setView("month")}
          >
            Month
          </button>
          <button
            className={`px-3 py-1 rounded-xl font-semibold text-sm transition-colors ${view === "week" ? "bg-[#FADEDE] text-[#3F3131]" : "bg-[#E7D7D7] text-[#3F3131] hover:bg-[#FADEDE]"}`}
            onClick={() => setView("week")}
          >
            Week
          </button>
          <button
            className={`px-3 py-1 rounded-xl font-semibold text-sm transition-colors ${view === "day" ? "bg-[#FADEDE] text-[#3F3131]" : "bg-[#E7D7D7] text-[#3F3131] hover:bg-[#FADEDE]"}`}
            onClick={() => setView("day")}
          >
            Day
          </button>
        </div>
        <div className="flex items-center gap-2 ml-4 flex-1 justify-end">
          <button
            className="px-2 py-1 rounded-lg bg-[#E7D7D7] hover:bg-[#FADEDE] text-[#3F3131] font-bold flex items-center justify-center transition-colors"
            onClick={goToPrev}
            aria-label="Previous"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" stroke="#3F3131" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="text-lg font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
            {view === "month"
              ? current.toLocaleString("default", { month: "long", year: "numeric" })
              : view === "week"
              ? `${getWeekDates(current)[0].toLocaleDateString()} - ${getWeekDates(current)[6].toLocaleDateString()}`
              : current.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
          </span>
          <button
            className="px-2 py-1 rounded-lg bg-[#E7D7D7] hover:bg-[#FADEDE] text-[#3F3131] font-bold flex items-center justify-center transition-colors"
            onClick={goToNext}
            aria-label="Next"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" stroke="#3F3131" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      {view === "month" && (
        <div className="flex flex-col flex-1 h-full pb-2">
          <div className="grid grid-cols-7 mb-0.5">
            {WEEK_DAYS.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)"
              >
                {d}
              </div>
            ))}
          </div>
          {getMonthMatrix(current.getFullYear(), current.getMonth()).map((week, i, weeksArr) =>
            week.some(date => date.getMonth() === current.getMonth()) ? (
              <div key={i} className="flex flex-1 min-h-0 w-full">
                {week.map((date, j) => {
                  // Determine if this is the first or last visible week
                  const isFirstVisibleWeek = i === weeksArr.findIndex(w => w.some(d => d.getMonth() === current.getMonth()));
                  const isLastVisibleWeek = i === weeksArr.map(w => w.some(d => d.getMonth() === current.getMonth())).lastIndexOf(true);
                  // Determine if this is the first or last day in the week
                  const isFirstDay = j === 0;
                  const isLastDay = j === 6;
                  // Always apply rounding to the outer corners, regardless of current month
                  let roundedClass = "";
                  if (isFirstVisibleWeek && isFirstDay) roundedClass += " rounded-tl-xl";
                  if (isFirstVisibleWeek && isLastDay) roundedClass += " rounded-tr-xl";
                  if (isLastVisibleWeek && isFirstDay) roundedClass += " rounded-bl-xl";
                  if (isLastVisibleWeek && isLastDay) roundedClass += " rounded-br-xl";
                  const isCurrentMonth = date.getMonth() === current.getMonth();
                  return (
                    <Card
                      key={i + "-" + j}
                      className={`flex flex-col items-start p-4 border border-[#C8B7B7] bg-[#F0E4E4] rounded-none flex-1 h-full min-h-0 min-w-0 w-full${roundedClass}${!isCurrentMonth ? " opacity-40" : ""}`}
                    >
                      <div className="w-full flex justify-center items-start mb-[2px]">
                        <span className="text-xs font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                          <span
                            className={`rounded-full w-7 h-7 flex items-center justify-center mx-auto pointer-events-auto ${isToday(date) ? "bg-blue-500 text-white" : "bg-gray-200 text-[#3F3131]"}`}
                            onMouseEnter={e => {
                              const dayTasks = tasks.filter((task) => {
                                const due = new Date(task.dueDate);
                                return (
                                  due.getFullYear() === date.getFullYear() &&
                                  due.getMonth() === date.getMonth() &&
                                  due.getDate() === date.getDate()
                                );
                              });
                              if (dayTasks.length > 0) {
                                setHoverTasks(dayTasks);
                                setHoverPos({ x: e.clientX, y: e.clientY });
                              }
                            }}
                            onMouseMove={e => {
                              const dayTasks = tasks.filter((task) => {
                                const due = new Date(task.dueDate);
                                return (
                                  due.getFullYear() === date.getFullYear() &&
                                  due.getMonth() === date.getMonth() &&
                                  due.getDate() === date.getDate()
                                );
                              });
                              if (dayTasks.length > 0) {
                                setHoverPos({ x: e.clientX, y: e.clientY });
                              }
                            }}
                            onMouseLeave={() => {
                              setHoverTasks(null);
                              setHoverPos(null);
                            }}
                          >
                            {date.getDate()}
                          </span>
                        </span>
                      </div>
                      <div className="mt-0 flex flex-col gap-1 w-full">
                        {(() => {
                          const dayTasks = tasks.filter((task) => {
                            const due = new Date(task.dueDate);
                            return (
                              due.getFullYear() === date.getFullYear() &&
                              due.getMonth() === date.getMonth() &&
                              due.getDate() === date.getDate()
                            );
                          });
                          if (dayTasks.length === 0) return null;
                          // Group by classId
                          const classMap = new Map();
                          dayTasks.forEach((task) => {
                            if (!classMap.has(task.classId)) classMap.set(task.classId, []);
                            classMap.get(task.classId).push(task);
                          });
                          const firstTask = dayTasks[0];
                          return <>
                            <span
                              key={firstTask._id}
                              className={`block text-xs truncate px-1 py-0.5 rounded font-medium ${firstTask.isComplete ? "bg-green-100 text-green-700" : "bg-[#FADEDE] text-[#3F3131]"} w-full overflow-hidden whitespace-nowrap`}
                              title={firstTask.name}
                            >
                              {firstTask.name}
                            </span>
                          </>;
                        })()}
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : null
          )}
        </div>
      )}
      {view === "week" && (
        <div className="flex flex-col gap-1 h-full flex-1">
          <div className="grid grid-cols-7 mb-0.5">
            {WEEK_DAYS.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="flex flex-row flex-1 h-full pb-2 min-h-0 w-full">
            {getWeekDates(current).map((date, i) => (
              <Card
                key={i}
                className="flex-1 h-full flex flex-col items-start p-6 border border-[#C8B7B7] bg-[#F0E4E4] rounded-none min-w-0 min-h-0 w-full"
              >
                <div className="w-full flex justify-center items-start mb-[2px]">
                  <span className="text-xs font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                    <span
                      className={`rounded-full w-7 h-7 flex items-center justify-center mx-auto pointer-events-auto ${isToday(date) ? "bg-blue-500 text-white" : "bg-gray-200 text-[#3F3131]"}`}
                      onMouseEnter={e => {
                        const dayTasks = tasks.filter((task) => {
                          const due = new Date(task.dueDate);
                          return (
                            due.getFullYear() === date.getFullYear() &&
                            due.getMonth() === date.getMonth() &&
                            due.getDate() === date.getDate()
                          );
                        });
                        if (dayTasks.length > 0) {
                          setHoverTasks(dayTasks);
                          setHoverPos({ x: e.clientX, y: e.clientY });
                        }
                      }}
                      onMouseMove={e => {
                        const dayTasks = tasks.filter((task) => {
                          const due = new Date(task.dueDate);
                          return (
                            due.getFullYear() === date.getFullYear() &&
                            due.getMonth() === date.getMonth() &&
                            due.getDate() === date.getDate()
                          );
                        });
                        if (dayTasks.length > 0) {
                          setHoverPos({ x: e.clientX, y: e.clientY });
                        }
                      }}
                      onMouseLeave={() => {
                        setHoverTasks(null);
                        setHoverPos(null);
                      }}
                    >
                      {date.getDate()}
                    </span>
                  </span>
                </div>
                <div className="mt-0 flex flex-col gap-1 w-full">
                  {(() => {
                    const dayTasks = tasks.filter((task) => {
                      const due = new Date(task.dueDate);
                      return (
                        due.getFullYear() === date.getFullYear() &&
                        due.getMonth() === date.getMonth() &&
                        due.getDate() === date.getDate()
                      );
                    });
                    if (dayTasks.length === 0) return null;
                    // Group by classId
                    const classMap = new Map();
                    dayTasks.forEach((task) => {
                      if (!classMap.has(task.classId)) classMap.set(task.classId, []);
                      classMap.get(task.classId).push(task);
                    });
                    const firstTask = dayTasks[0];
                    return <>
                      <span
                        key={firstTask._id}
                        className={`block text-xs truncate px-1 py-0.5 rounded font-medium ${firstTask.isComplete ? "bg-green-100 text-green-700" : "bg-[#FADEDE] text-[#3F3131]"} w-full overflow-hidden whitespace-nowrap`}
                        title={firstTask.name}
                      >
                        {firstTask.name}
                      </span>
                    </>;
                  })()}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      {view === "day" && (
        <div className="flex flex-col gap-1">
          <Card className="min-h-[200px] flex flex-col items-start p-4 border border-[#E7D7D7] bg-[#F9F1F1]">
            {/* Increased padding for day view */}
            <span className="text-lg font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
              {current.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
            </span>
            <div className="mt-0 flex flex-col gap-1 w-full">
              {(() => {
                const dayTasks = tasks.filter((task) => {
                  const due = new Date(task.dueDate);
                  return (
                    due.getFullYear() === current.getFullYear() &&
                    due.getMonth() === current.getMonth() &&
                    due.getDate() === current.getDate()
                  );
                });
                if (dayTasks.length === 0) {
                  return <span className="text-[#654545] text-base font-medium font-(family-name:--font-IBMPlexSans)">No events for this day.</span>;
                }
                // Group by classId
                const classMap = new Map();
                dayTasks.forEach((task) => {
                  if (!classMap.has(task.classId)) classMap.set(task.classId, []);
                  classMap.get(task.classId).push(task);
                });
                const firstTask = dayTasks[0];
                return <>
                  <span
                    key={firstTask._id}
                    className={`block text-sm truncate px-2 py-1 rounded font-medium ${firstTask.isComplete ? "bg-green-100 text-green-700" : "bg-[#FADEDE] text-[#3F3131]"}`}
                    title={firstTask.name}
                  >
                    {firstTask.name}
                  </span>
                </>;
              })()}
            </div>
          </Card>
        </div>
      )}
      {/* Hover card for viewing more tasks on a day */}
      {hoverTasks && hoverPos && (() => {
        let top = hoverPos.y + 12;
        let left = hoverPos.x + 12;
        if (top + cardDims.height > window.innerHeight) {
          top = hoverPos.y - cardDims.height - 12;
          if (top < 0) top = window.innerHeight - cardDims.height - 12;
        }
        if (left + cardDims.width > window.innerWidth) {
          left = window.innerWidth - cardDims.width - 12;
          if (left < 0) left = 0;
        }
        return (
          <div
            ref={cardRef}
            className="fixed z-50 bg-white rounded-xl shadow-lg p-3 w-52 border border-[#E7D7D7]"
            style={{
              top,
              left,
              fontFamily: 'IBM Plex Sans, sans-serif',
              pointerEvents: 'none',
              overflow: 'visible',
              maxHeight: 'none',
            }}
          >
            <div className="font-bold text-[#3F3131] mb-2 text-base">All Tasks</div>
            <div className="flex flex-col gap-3">
              {hoverTasks.map((task) => (
                <div key={task._id} className={`flex flex-col gap-1 py-2 px-2 rounded ${task.isComplete ? "bg-green-200" : "bg-[#F5D7B8]"}`}>
                  <span className="font-semibold text-[#3F3131]">{task.name}</span>
                  <span className="text-xs text-[#654545]">Due: {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className={`text-xs font-bold ${task.isComplete ? "text-green-700" : "text-[#3F3131]"}`}>{task.isComplete ? "Complete" : "Incomplete"}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </Card>
  );
}