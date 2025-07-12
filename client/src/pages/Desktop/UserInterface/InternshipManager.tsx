import { useEffect, useState, useRef } from "react";
import axios from "axios";

const statusColors: Record<string, string> = {
  Accepted: "bg-green-200 text-green-800 border-green-400",
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-400",
  Reviewed: "bg-blue-100 text-blue-800 border-blue-400",
  Rejected: "bg-red-100 text-red-800 border-red-400",
};

interface InternshipData {
  _id: string;
  userId: string;
  date: string;
  name: string;
  category: string;
  employer: string;
  status: string;
  description: string;
}

interface InternshipManagerProps {
  userId?: string;
  onApplicationClick: (application: InternshipData) => void;
  onAddInternship: () => void;
  refreshKey: number;
}

export default function InternshipManager({ userId, onApplicationClick, onAddInternship, refreshKey }: InternshipManagerProps) {
  const [internships, setInternships] = useState<InternshipData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusEditId, setStatusEditId] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const statusDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    axios
      .get(`http://localhost:3000/internship/user/${userId}`)
      .then((response) => {
        setInternships(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch internships");
        console.error("404 error", err)
        setLoading(false);
      });
  }, [userId, refreshKey, statusUpdating]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setStatusEditId(null);
      }
    }
    if (statusEditId) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [statusEditId]);

  const handleStatusClick = (id: string) => {
    setStatusError(null);
    setStatusEditId(prev => (prev === id ? null : id));
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setStatusUpdating(id);
    setStatusError(null);
    axios
      .patch(`http://localhost:3000/internship/${id}`, { 
        updates: { status: newStatus },
        userId: userId 
      })
      .then(() => {
        setStatusEditId(null);
        setStatusUpdating(null);
      })
      .catch((err) => {
        setStatusError("Failed to update status");
        setStatusUpdating(null);
        console.error("Error updating status:", err);
      });
  };

  return (
    <>
      <div className="flex flex-col h-full min-h-0 px-1">
        <div className="flex mb-6">
          <h1 className="text-2xl font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
            Internship Manager
          </h1>
          <button
            onClick={onAddInternship}
            className="cursor-pointer font-semibold bg-[#D9D9D9] hover:bg-[#FCD34D] px-3 rounded-2xl transition-colors duration-200 flex items-center font-(family-name:--font-IBMPlexSans) ml-4"
          >
            Add
          </button>
        </div>
        <div className="w-full flex-1 min-h-0 overflow-x-hidden rounded-lg">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="mb-4 text-lg text-[#3F3131] font-bold font-(family-name:--font-IBMPlexSans) border-dashed border-[#654545] border-3 p-8 rounded-4xl">
                Loading internships...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="mb-4 text-lg text-red-600 font-bold font-(family-name:--font-IBMPlexSans) border-dashed border-[#654545] border-3 p-8 rounded-4xl">
                {error}
              </p>
            </div>
          ) : internships.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="mb-4 text-lg text-[#3F3131] font-bold font-(family-name:--font-IBMPlexSans) border-dashed border-[#654545] border-3 p-8 rounded-4xl">
                No applications found
              </p>
            </div>
          ) : (
            <table className="w-full bg-white rounded-lg">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#EED2D2] text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                  <th className="py-3 px-4 text-left font-semibold">
                    Date Added
                  </th>
                  <th className="py-3 px-4 text-left font-semibold">Name</th>
                  <th className="py-3 px-4 text-left font-semibold">
                    Category
                  </th>
                  <th className="py-3 px-4 text-left font-semibold">
                    Employer
                  </th>
                  <th className="py-3 px-4 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {internships.map((app, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-[#F4D5D5] last:border-b-0 hover:bg-[#FADEDE]/60 transition-colors"
                    onClick={() => onApplicationClick(app)}
                  >
                    <td className="py-3 px-4 font-medium text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                      {app.date}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                      {app.name}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#5C543C] font-(family-name:--font-IBMPlexSans)">
                      {app.category}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#5C543C] font-(family-name:--font-IBMPlexSans)">
                      {app.employer}
                    </td>
                    <td className="py-3 px-4">
                      <div className="relative inline-block">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold font-(family-name:--font-IBMPlexSans) ${statusColors[app.status]} cursor-pointer`}
                          onClick={e => { e.stopPropagation(); handleStatusClick(app._id); }}
                        >
                          <span>{app.status}</span>
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${statusEditId === app._id ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                        {statusEditId === app._id && (
                          <div
                            ref={statusDropdownRef}
                            className="absolute z-20 left-0 top-full mt-2 bg-white border rounded shadow-lg min-w-[120px]"
                            style={{ minWidth: 120 }}
                          >
                            {["Accepted", "Pending", "Reviewed", "Rejected"].map(option => (
                              <div
                                key={option}
                                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm ${option === app.status ? "font-bold text-green-700" : ""}`}
                                onClick={e => { e.stopPropagation(); handleStatusChange(app._id, option); }}
                              >
                                {option}
                              </div>
                            ))}
                            {statusUpdating === app._id && (
                              <div className="px-4 py-2 text-xs text-gray-500">Updating...</div>
                            )}
                            {statusError && (
                              <div className="px-4 py-2 text-xs text-red-500">{statusError}</div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
