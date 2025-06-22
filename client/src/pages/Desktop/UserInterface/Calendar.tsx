export default function Calendar() {
  
    return (
        <div>
        <h1
          className="text-2xl font-bold text-[#3F3131]"
          style={{ fontFamily: "var(--font-IBMPlexSans)" }}
        >
          Calendar
        </h1>
  
        <p
          className="font-medium text-[#3F3131] mb-3"
          style={{ fontFamily: "var(--font-IBMPlexSans)" }}
        >
          You currently have no events today
        </p>
      </div>
    );
}