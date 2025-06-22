export default function Tasks() {
  
    return (
        <div>
        <h1
          className="text-2xl font-bold text-[#3F3131]"
          style={{ fontFamily: "var(--font-IBMPlexSans)" }}
        >
          Tasks
        </h1>

        <p
          className="font-medium text-[#3F3131] mb-3"
          style={{ fontFamily: "var(--font-IBMPlexSans)" }}
        >
          WARNING: You have 3 tasks overdue
        </p>
      </div>
    );
}