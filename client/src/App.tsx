import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import MobileHome from "./pages/Mobile/MobileHome";
import DesktopHome from "./pages/Desktop/DesktopHome";
import NavSidebarLayout from "./pages/Desktop/UserInterface/NavSidebarLayout";
import Login from "./pages/Desktop/Login";
import Signup from "./pages/Desktop/Signup";

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 868);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <>
      {isMobile ? (
        <>
          <Router>
            <Routes>
              <Route path="" element={<MobileHome />} />
            </Routes>
          </Router>
        </>
      ) : (
        <>
          <Router>
            <Routes>
              <Route path="" element={<DesktopHome />} />
              <Route path="Login" element={<Login />} />
              <Route path="Signup" element={<Signup />} />
              <Route path="Dashboard" element={<NavSidebarLayout page="Dashboard" />} />
              <Route path="Transactions" element={<NavSidebarLayout page="Transactions" />} />
              <Route path="InternshipManager" element={<NavSidebarLayout page="InternshipManager" />} />
              <Route path="Tasks" element={<NavSidebarLayout page="Tasks" />} />
              <Route path="Calendar" element={<NavSidebarLayout page="Calendar" />} />
              <Route path="Security" element={<NavSidebarLayout page="Security" />} />
              <Route path="Settings" element={<NavSidebarLayout page="Settings" />} />
            </Routes>
          </Router>
        </>
      )}
    </>
  )
}