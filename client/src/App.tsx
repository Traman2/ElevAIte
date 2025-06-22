import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import MobileHome from "./pages/Mobile/MobileHome";
import DesktopHome from "./pages/Desktop/DesktopHome";
import NavSidebarLayout from "./pages/Desktop/UserInterface/NavSidebarLayout";

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
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
              <Route path="Dashboard" element={<NavSidebarLayout page="Dashboard" />} />
              <Route path="Assets" element={<NavSidebarLayout page="Assets" />} />
              <Route path="Transactions" element={<NavSidebarLayout page="Transactions" />} />
              <Route path="Deposits" element={<NavSidebarLayout page="Deposits" />} />
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