import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";

interface Props {
    onClose: () => void;
    userId?: string;
    onTaskAdded: () => void;
}

export default function TaskModal({ onClose, userId, onTaskAdded } : Props) {

  const classSchema = z.object({
    className: z.string().min(1, { message: "Class name is required" }),
    addTask: z.boolean().optional(),
    task: z.object({
      taskName: z.string().optional(),
      status: z.boolean().optional(),
      dueDate: z.string().optional(),
    }).optional(),
  }).refine(
    (data) => {
      if (data.addTask) {
        return (
          data.task &&
          !!data.task.taskName &&
          !!data.task.dueDate &&
          !isNaN(Date.parse(data.task.dueDate))
        );
      }
      return true;
    },
    {
      message: "Task name and valid due date are required when adding a task.",
      path: ["task"],
    }
  );

  type ClassSchema = z.infer<typeof classSchema>;

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      addTask: false,
    },
  });

  const addTaskChecked = watch("addTask");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (data: ClassSchema) => {
    setIsSubmitting(true);
    setError(null);
    axios.post("http://localhost:3000/class", {
      className: data.className,
      userId: userId,
    })
      .then((classRes) => {
        const classId = classRes.data._id || classRes.data.class?._id;
        if (data.addTask && data.task && classId) {
          return axios.post("http://localhost:3000/task", {
            name: data.task.taskName,
            isComplete: !!data.task.status,
            dueDate: new Date(data.task.dueDate || '').toISOString(),
            classId: classId,
            userId: userId,
          });
        }
        return null;
      })
      .then(() => {
        setIsSuccess(true);
        if (onTaskAdded) onTaskAdded();
        if (onClose) onClose();
      })
      .catch((err) => {
        setError("Failed to create class or task. Please try again.");
        setIsSubmitting(false);
        console.error(err);
      });
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow p-6 w-[500px] flex flex-col gap-4" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
        <h2 className="text-2xl font-bold text-[#3F3131] font-(family-name:--font-IBMPlexMono) mb-2">
          Add New Class
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" autoComplete="off">
          <div>
            <label className="block mb-1 text-[17px] font-bold text-[#3F3131]">Class Name</label>
            <input
              type="text"
              {...register("className")}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-gray-100 text-[#3F3131] font-semibold text-[16px] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
              placeholder="Enter class name"
              style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
              autoComplete="off"
            />
            {errors.className && (
              <p className="text-red-600 text-sm mt-1">{errors.className.message}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="addTask"
              {...register("addTask")}
              className="w-4 h-4 accent-[#535CFF] rounded"
            />
            <label htmlFor="addTask" className="font-semibold text-[#3F3131] text-[15px]">Add a Task</label>
          </div>
          {addTaskChecked && (
            <div className="bg-[#f5eded] border border-gray-300 rounded-xl p-4 flex flex-col gap-3 shadow-inner">
              <div className="mb-2">
                <span className="text-[15px] font-bold text-[#3F3131]">Task Details</span>
              </div>
              <div>
                <label className="block mb-1 text-[15px] font-semibold text-[#3F3131]">Task Name</label>
                <input
                  type="text"
                  {...register("task.taskName")}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-gray-100 text-[#3F3131] font-semibold text-[15px] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                  placeholder="Enter task name"
                  style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
                  autoComplete="off"
                />
                {errors.task?.taskName && (
                  <p className="text-red-600 text-sm mt-1">{errors.task.taskName.message}</p>
                )}
                {errors.task && typeof errors.task.message === 'string' && (
                  <p className="text-red-600 text-sm mt-1">{errors.task.message}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="status"
                  {...register("task.status")}
                  className="w-4 h-4 accent-green-500 rounded"
                />
                <label htmlFor="status" className="font-semibold text-[#3F3131] text-[15px]">Completed</label>
              </div>
              <div>
                <label className="mb-1 text-[15px] font-semibold text-[#3F3131] flex items-center gap-1">
                  <img src="/icons/tasks/cuida--calendar-outline.svg" alt="Due date" className="w-4 h-4 inline-block mr-1" />
                  Due Date
                </label>
                <input
                  type="date"
                  {...register("task.dueDate")}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-gray-100 text-[#3F3131] font-semibold text-[15px] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                  style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
                  autoComplete="off"
                />
                {errors.task?.dueDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.task.dueDate.message}</p>
                )}
                {errors.task && typeof errors.task.message === 'string' && (
                  <p className="text-red-600 text-sm mt-1">{errors.task.message}</p>
                )}
              </div>
            </div>
          )}
          {error && (
            <p className="text-red-600 text-sm mt-1">{error}</p>
          )}
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="bg-[#FCD34D] cursor-pointer font-(family-name:--font-IBMPlexSans) text-[#3F3131] font-bold py-2 px-4 rounded-xl shadow-md hover:bg-[#F59E0B] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isSubmitting || isSuccess}
            >
              {isSubmitting ? "Adding..." : isSuccess ? "Success!" : "Add Class"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-sm cursor-pointer bg-gray-300 font-(family-name:--font-IBMPlexSans) text-[#3F3131] font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-gray-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
  