import axios from 'axios';

interface ApplicationData {
  _id: string;
  date: string;
  name: string;
  category: string;
  employer: string;
  status: string;
  description: string;
}

interface InternshipManagerModalProps {
  application: ApplicationData;
  onClose: () => void;
  onDelete?: () => void;
}

const statusColors: Record<string, string> = {
  Accepted: "bg-green-200 text-green-800 border-green-400",
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-400",
  Reviewed: "bg-blue-100 text-blue-800 border-blue-400",
  Rejected: "bg-red-100 text-red-800 border-red-400",
};

export default function InternshipManagerModal({
  application,
  onClose,
  onDelete,
}: InternshipManagerModalProps) {
  const handleDelete = () => {
    console.log(application._id)
    axios.delete(`http://localhost:3000/internship/${application._id}`)
      .then((response) => {
        if (response.status === 200) {
          if (onDelete) {
            onDelete();
          }
          onClose();
        }
      })
      .catch((error) => {
        console.error('Error deleting application:', error);
        alert('Error deleting application. Please try again.');
      });
  };

  return (
    <>
      <div className="bg-white rounded-lg p-8 shadow-lg w-[500px]">
        <h2 className="text-2xl font-bold text-[#3F3131] font-(family-name:--font-IBMPlexMono) mb-4">
          {application?.name}
        </h2>
        <div className="mb-2">
          <span className="text-sm font-medium text-[#5C543C]">
            Date Added:
          </span>{" "}
          {application?.date}
        </div>
        <div className="mb-2">
          <span className="text-sm font-medium text-[#5C543C]">Category:</span>{" "}
          {application?.category}
        </div>
        <div className="mb-2">
          <span className="text-sm font-medium text-[#5C543C]">Employer:</span>{" "}
          {application?.employer}
        </div>
        <div className="mb-4">
          <span className="text-sm font-medium text-[#5C543C]">Status:</span>{" "}
          <span
            className={`inline-block px-3 py-1 rounded-full border text-xs font-bold font-(family-name:--font-IBMPlexSans) ${
              application?.status && statusColors[application.status]
                ? statusColors[application.status]
                : "bg-gray-200 text-gray-800 border-gray-400"
            }`}
          >
            {application?.status ?? "N/A"}
          </span>
        </div>
        <div className="mb-2">
          <span className="text-sm font-medium text-[#5C543C]">
            Description:
          </span>
          <div className="mt-1 text-[#3F3131] text-sm font-(family-name:--font-IBMPlexSans)">
            {application?.description}
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-sm bg-gray-300 font-(family-name:--font-IBMPlexSans) text-[#3F3131] font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-gray-400 transition-colors duration-200"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="cursor-pointer text-sm bg-red-500 font-(family-name:--font-IBMPlexSans) text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-red-600 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
