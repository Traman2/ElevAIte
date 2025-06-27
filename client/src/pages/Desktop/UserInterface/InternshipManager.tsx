const dummyData = [
  {
    date: "2025-01-12",
    name: "Frontend Developer Internship",
    category: "Tech",
    employer: "Google",
    status: "Accepted",
    description:
      "Worked on UI components and collaborated with the design team to improve user experience.",
  },
  {
    date: "2025-01-10",
    name: "Customer Success Intern",
    category: "Customer Relations",
    employer: "Zendesk",
    status: "Pending",
    description:
      "Assisted customers with onboarding and provided technical support for SaaS products.",
  },
  {
    date: "2025-01-08",
    name: "Backend Developer Internship",
    category: "Tech",
    employer: "Amazon",
    status: "Reviewed",
    description:
      "Developed REST APIs and optimized database queries for high-traffic services.",
  },
  {
    date: "2025-01-05",
    name: "Sales Intern",
    category: "Customer Relations",
    employer: "Salesforce",
    status: "Rejected",
    description:
      "Supported the sales team in lead generation and CRM data management.",
  },
];

const statusColors: Record<string, string> = {
  Accepted: "bg-green-200 text-green-800 border-green-400",
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-400",
  Reviewed: "bg-blue-100 text-blue-800 border-blue-400",
  Rejected: "bg-red-100 text-red-800 border-red-400",
};

interface InternshipManagerProps {
  onApplicationClick: (application: typeof dummyData[0]) => void;
  onAddInternship: () => void;
}

export default function InternshipManager({ onApplicationClick, onAddInternship }: InternshipManagerProps) {

  return (
    <>
      <div className="flex flex-col h-full min-h-0">
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
          {dummyData.length === 0 ? (
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
                {dummyData.map((app, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-[#F4D5D5] last:border-b-0 hover:bg-[#FADEDE]/60 transition-colors cursor-pointer"
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
                      <span
                        className={`inline-block px-3 py-1 rounded-full border text-xs font-bold font-(family-name:--font-IBMPlexSans) ${
                          statusColors[app.status]
                        }`}
                      >
                        {app.status}
                      </span>
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
