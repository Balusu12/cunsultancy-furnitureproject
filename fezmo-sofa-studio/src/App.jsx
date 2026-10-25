
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import RoomVisualizer from "./components/RoomVisualizer";
import Navbar from "./components/Nav";

function AppContent() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/" && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/visualizer" element={<RoomVisualizer />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}