import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useEffect, useState } from "react";

interface Props {
  onClose: () => void;
  classId: string;
  onTaskAdded: () => void;
  userId?: string;
}

export default function AddNewTaskModal({ onClose, classId, onTaskAdded, userId }: Props) {
  const [className, setClassName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!classId) return;
    axios
      .get(`http://localhost:3000/class/user/${userId}`)
      .then((res) => {
        const found = res.data.find((c: any) => c._id === classId);
        setClassName(found ? found.className : "");
      })
      .catch(() => setClassName(""));
  }, [classId]);

  const taskSchema = z.object({
    taskName: z.string().min(1, { message: "Task name is required" }),
    status: z.boolean().optional(),
    dueDate: z.string().min(1, { message: "Due date is required" }),
  });
  type TaskSchema = z.infer<typeof taskSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = (data: TaskSchema) => {
    setIsSubmitting(true);
    setError(null);
    axios
      .post("http://localhost:3000/task", {
        name: data.taskName,
        isComplete: !!data.status,
        dueDate: new Date(data.dueDate).toISOString(),
        classId: classId,
      })
      .then(() => {
        setIsSuccess(true);
        onTaskAdded();
        if (onClose) onClose();
      })
      .catch((err) => {
        setError("Failed to add task. Please try again.");
        setIsSubmitting(false);
        console.error(err);
      });
  };

  function getTruncatedClassName(name: string) {
    return name.length > 20 ? name.slice(0, 20) + '...' : name;
  }

  return (
    <>
      <div className="bg-white rounded-lg p-8 shadow-lg w-[500px]">
        <h2 className="text-2xl font-bold text-[#3F3131] font-(family-name:--font-IBMPlexMono) mb-4">
          {getTruncatedClassName(className)}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" autoComplete="off">
          <div>
            <label className="block mb-1 text-[17px] font-bold text-[#3F3131]">
              Task Name
            </label>
            <input
              type="text"
              {...register("taskName")}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-gray-100 text-[#3F3131] font-semibold text-[16px] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
              placeholder="Enter task name"
              style={{ fontFamily: "IBM Plex Sans, sans-serif" }}
              autoComplete="off"
            />
            {errors.taskName && (
              <p className="text-red-600 text-sm mt-1">
                {errors.taskName.message}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="status"
              {...register("status")}
              className="w-4 h-4 accent-green-500 rounded"
              autoComplete="off"
            />
            <label
              htmlFor="status"
              className="font-semibold text-[#3F3131] text-[15px]"
            >
              Completed
            </label>
          </div>
          <div>
            <label className="mb-1 text-[15px] font-semibold text-[#3F3131] flex items-center gap-1">
              <img
                src="/icons/tasks/cuida--calendar-outline.svg"
                alt="Due date"
                className="w-4 h-4 inline-block mr-1"
              />
              Due Date
            </label>
            <input
              type="date"
              {...register("dueDate")}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-gray-100 text-[#3F3131] font-semibold text-[15px] focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
              style={{ fontFamily: "IBM Plex Sans, sans-serif" }}
              autoComplete="off"
            />
            {errors.dueDate && (
              <p className="text-red-600 text-sm mt-1">
                {errors.dueDate.message}
              </p>
            )}
          </div>
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="bg-[#FCD34D] cursor-pointer font-(family-name:--font-IBMPlexSans) text-[#3F3131] font-bold py-2 px-4 rounded-xl shadow-md hover:bg-[#F59E0B] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isSubmitting || isSuccess}
            >
              {isSubmitting ? "Adding..." : isSuccess ? "Success!" : "Add Task"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-sm bg-gray-300 font-(family-name:--font-IBMPlexSans) text-[#3F3131] font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-gray-400 transition-colors duration-200"
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
