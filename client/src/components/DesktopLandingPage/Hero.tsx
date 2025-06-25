import { useNavigate } from "react-router-dom";

interface Props {
    handleClick: (e : React.MouseEvent<HTMLButtonElement, MouseEvent>, targetId: string ) => void;
}


export default function Hero({handleClick} : Props) {
  const handleSignup = () => {
    navigate("/Signup");
  };
  const navigate = useNavigate();

  return (
    <>
      <section className="w-full flex justify-center mt-22">
        <div className="max-w-[750px] w-full flex flex-col items-center">
          <h1
            className="text-center text-6xl font-bold font-(family-name:--font-IBMPlexMono) leading-tight"
            style={{ color: "#000000" }}
          >
            Organize your <span style={{ color: "#EAB508" }}>Schedule</span> and{" "}
            <span style={{ color: "#EAB508" }}>Budget</span> with confidence
          </h1>
          <p
            className="mt-6 font-bold text-center text-xl font-(family-name:--font-IBMPlexSans) max-w-[500px] mx-auto"
            style={{ color: "#5C543C" }}
          >
            From assignments to payroll dates, Schedgy keeps your academic and
            financial life in sync
          </p>
          <div className="flex flex-row gap-12 mt-8 justify-center">
            <button
              onClick={handleSignup}
              className="cursor-pointer px-7 py-2 rounded-xl font-bold font-(family-name:--font-IBMPlexMono) text-[#5C543C] bg-[#F2C83F] shadow-sm hover:brightness-95 transition-all duration-150 text-lg"
            >
              Get Started
            </button>
            <button onClick={(e) => handleClick(e, "features")} className="cursor-pointer px-7 py-2 rounded-xl font-bold font-(family-name:--font-IBMPlexMono) text-[#5C543C] bg-white border border-[#EED2D2] shadow-sm hover:bg-gray-100 transition-all duration-150 text-lg">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
