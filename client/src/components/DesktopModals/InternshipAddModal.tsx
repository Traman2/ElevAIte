import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import axios from "axios";

const statusColors: Record<string, string> = {
  Accepted: "bg-green-200 text-green-800 border-green-400",
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-400",
  Reviewed: "bg-blue-100 text-blue-800 border-blue-400",
  Rejected: "bg-red-100 text-red-800 border-red-400",
};

const internshipFormSchema = z.object({
  date: z
    .string()
    .regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, "Date must be in YYYY-MM-DD format"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  category: z
    .string()
    .min(1, "Category is required")
    .max(30, "Category must be 30 characters or less"),
  employer: z
    .string()
    .min(1, "Employer is required")
    .max(50, "Employer must be 50 characters or less"),
  status: z.enum(["Accepted", "Pending", "Reviewed", "Rejected"], {
    required_error: "Please select a status",
  }),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

type InternshipFormData = z.infer<typeof internshipFormSchema>;

interface InternshipAddModalProps {
  onClose: () => void;
  userId?: string;
  onInternshipAdded?: () => void;
}

export default function InternshipAddModal({
    userId,
  onClose,
  onInternshipAdded,
}: InternshipAddModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<InternshipFormData>({
    resolver: zodResolver(internshipFormSchema),
  });

  const selectedStatus = watch("status");

  const onSubmit = async (data: InternshipFormData) => {
    console.log(data)
    setIsSubmitting(true);
    const submitData = {
      date: data.date,
      name: data.name,
      category: data.category,
      employer: data.employer,
      status: data.status,
      description: data.description,
      userId: userId,
    };
    await axios
      .post("http://localhost:3000/internship/", submitData)
      .then(() => {
        setIsSuccess(true);
        if (onInternshipAdded) onInternshipAdded();
        setTimeout(() => {
          if (onClose) {
            onClose();
          }
        }, 2000);
      })
      .catch((err) => {
        setIsSubmitting(false);
        console.error("Server not responding", err);
      });
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 w-[500px]" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <h2 className="text-2xl font-bold text-[#3F3131] font-(family-name:--font-IBMPlexMono) mb-2">
        Add Internship
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-x-6 gap-y-6">
        {/* Date Added */}
        <div className="col-span-1">
          <label
            htmlFor="date"
            className="block mb-1 text-[17px] font-bold text-[#3F3131]"
          >
            Date Added:
          </label>
          <input
            type="text"
            id="date"
            maxLength={10}
            placeholder="YYYY-MM-DD"
            {...register("date")}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 text-[#3F3131] font-semibold text-[16px] focus:outline-none focus:ring-2 focus:ring-[#FCD34D] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || isSuccess}
          />
          {errors.date && (
            <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>
          )}
        </div>
        {/* Name */}
        <div className="col-span-1">
          <label
            htmlFor="name"
            className="block mb-1 text-[17px] font-bold text-[#3F3131]"
          >
            Name:
          </label>
          <input
            type="text"
            id="name"
            maxLength={40}
            {...register("name")}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 text-[#3F3131] font-semibold text-[16px] focus:outline-none focus:ring-2 focus:ring-[#FCD34D] disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter name"
            disabled={isSubmitting || isSuccess}
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        {/* Category */}
        <div className="col-span-1">
          <label
            htmlFor="category"
            className="block mb-1 text-[17px] font-bold text-[#3F3131]"
          >
            Category:
          </label>
          <input
            type="text"
            id="category"
            maxLength={30}
            {...register("category")}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 text-[#3F3131] font-semibold text-[16px] focus:outline-none focus:ring-2 focus:ring-[#FCD34D] disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter category"
            disabled={isSubmitting || isSuccess}
          />
          {errors.category && (
            <p className="text-red-600 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>
        {/* Employer */}
        <div className="col-span-1">
          <label
            htmlFor="employer"
            className="block mb-1 text-[17px] font-bold text-[#3F3131]"
          >
            Employer:
          </label>
          <input
            type="text"
            id="employer"
            maxLength={30}
            {...register("employer")}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 text-[#3F3131] font-semibold text-[16px] focus:outline-none focus:ring-2 focus:ring-[#FCD34D] disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter employer"
            disabled={isSubmitting || isSuccess}
          />
          {errors.employer && (
            <p className="text-red-600 text-sm mt-1">
              {errors.employer.message}
            </p>
          )}
        </div>
        {/* Status Dropdown */}
        <div className="col-span-2">
          <label className="block mb-1 text-[17px] font-bold text-[#3F3131]">
            Status
          </label>
          <div className="flex gap-1">
            {["Accepted", "Pending", "Reviewed", "Rejected"].map((status) => (
              <label key={status} className="flex items-center">
                <input
                  type="radio"
                  value={status}
                  {...register("status")}
                  className="sr-only"
                  disabled={isSubmitting || isSuccess}
                />
                <div
                  className={`px-4 py-2 rounded-3xl border-2 cursor-pointer transition-all font-bold text-xs
                    ${
                      selectedStatus === status
                        ? statusColors[status]
                        : "bg-white border-gray-300 text-gray-600 hover:border-[#FCD34D]"
                    }
                    ${
                      isSubmitting || isSuccess
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }
                  `}
                >
                  {status}
                </div>
              </label>
            ))}
          </div>
          {errors.status && (
            <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>
          )}
        </div>
        {/* Description */}
        <div className="col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-[#3F3131] mb-2"
          >
            Description (optional):
          </label>
          <textarea
            id="description"
            maxLength={500}
            rows={3}
            {...register("description")}
            className="w-full px-3 py-2 border border-[#B8ABAB] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#FCD34D] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            placeholder="Add a description (max 500 characters)"
            disabled={isSubmitting || isSuccess}
          />
          <div className="flex justify-between text-xs mt-1">
            <span className="text-gray-400">
              {watch("description")?.length || 0}/500
            </span>
            {errors.description && (
              <span className="text-red-600">{errors.description.message}</span>
            )}
          </div>
        </div>
        {/* Submit Button */}
        <div className="col-span-2">
        {isSuccess ? (
          <div className="cursor-not-allowed font-(family-name:--font-IBMPlexSans) bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Added Successfully!
          </div>
        ) : (
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#FCD34D] font-(family-name:--font-IBMPlexSans) text-[#3F3131] font-bold py-2 px-4 rounded-xl shadow-md hover:bg-[#F59E0B] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#3F3131]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding...
                </>
              ) : (
                "Add Internship"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-sm bg-gray-300  font-(family-name:--font-IBMPlexSans) text-[#3F3131] font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-gray-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              
            >
              Cancel
            </button>
          </div>
        )}
        </div>
      </form>
    </div>
  );
}
