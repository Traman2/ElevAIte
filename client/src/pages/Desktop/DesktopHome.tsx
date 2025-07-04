import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Hero from "../../components/DesktopLandingPage/Hero";
import HeroFeatureMiddleImage from "../../components/DesktopLandingPage/HeroFeatureMiddleImage";
import Features from "../../components/DesktopLandingPage/Features";
import FAQs from "../../components/DesktopLandingPage/FAQs";
import Footer from "../../components/DesktopLandingPage/Footer";

export default function DesktopHome() {
  const navigate = useNavigate();
  const [solid, setSolid] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = scrollRef.current
        ? scrollRef.current.scrollTop
        : 0;
      setSolid(currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > 95) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (scrollEl) {
        scrollEl.removeEventListener("scroll", handleScroll);
      }
    };
  }, [lastScrollY]);

  const handleLogin = () => {
    navigate("/Login");
  };
  const handleSignup = () => {
    navigate("/Signup");
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    targetId: string
  ) => {
    e.preventDefault();
    const scrollEl = scrollRef.current;
    const target = document.getElementById(targetId);
    if (scrollEl && target) {
      const scrollElRect = scrollEl.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const offset =
        targetRect.top - scrollElRect.top + scrollEl.scrollTop - 20;
      scrollEl.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  return (
    <div 
      className="min-h-screen w-full overflow-x-hidden relative bg-cover bg-center bg-no-repeat bg-[url('/Tutt-Library-entrance-1920x1256.jpg')]"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#EED2D2]/90"></div>
      
      <nav
        className={`fixed left-1/2 top-7 transform -translate-x-1/2 z-50 transition-all duration-500 ${
          solid
            ? "border border-[#eee2e2] bg-[#FADEDE] shadow-xl"
            : "bg-transparent border-transparent shadow-none"
        } rounded-4xl flex items-center justify-between px-10 py-2 w-[1100px] max-w-[98vw] ${
          isVisible ? "translate-y-0" : "-translate-y-[170%]"
        }`}
      >
        <div className="flex items-center space-x-3">
          <img
            src="/icons/noto--money-bag.svg"
            alt="Schedgy Logo"
            className="w-7 h-7"
          />
          <span className="text-lg font-bold tracking-tight font-(family-name:--font-IBMPlexMono) text-[#5C543C]">
            Schedgy
          </span>
        </div>
        <div className="flex items-center space-x-8">
          <a
            href="#features"
            onClick={(e) => handleNavClick(e, "features")}
            className="text-base font-semibold font-(family-name:--font-IBMPlexSans) text-[#5C543C] hover:underline underline-offset-8 decoration-[1px] transition-all duration-150"
          >
            Features
          </a>
          <a
            href="#faq"
            onClick={(e) => handleNavClick(e, "faq")}
            className="text-base font-semibold font-(family-name:--font-IBMPlexSans) text-[#5C543C] hover:underline underline-offset-8 decoration-[1px] transition-all duration-150"
          >
            FAQs
          </a>
          <a
            href="#Contact"
            onClick={(e) => handleNavClick(e, "Contact")}
            className="text-base font-semibold font-(family-name:--font-IBMPlexSans) text-[#5C543C] hover:underline underline-offset-8 decoration-[1px] transition-all duration-150"
          >
            Contact
          </a>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleLogin}
            className="cursor-pointer px-4 py-1 rounded-lg font-bold font-(family-name:--font-IBMPlexSans) text-[#5C543C] bg-transparent border-none outline-none transition-all duration-150 text-base hover:bg-gray-400/40"
          >
            Login
          </button>
          <button
            onClick={handleSignup}
            className="cursor-pointer px-4 py-1 rounded-2xl font-bold font-(family-name:--font-IBMPlexSans) text-[#5C543C] bg-[#F2C83F] shadow-sm hover:brightness-95 transition-all duration-150 text-base"
          >
            Signup
          </button>
        </div>
      </nav>
      <div
        ref={scrollRef}
        className="scrollbar-home overflow-y-auto max-h-[100vh] pt-[100px] relative z-10"
      >
        <Hero handleClick={handleNavClick} />
        <HeroFeatureMiddleImage/>
        <Features/>
        <FAQs/>
        <Footer/>
      </div>
    </div>
  );
}
