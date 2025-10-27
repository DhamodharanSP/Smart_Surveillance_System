import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
// import Dashboard from "./components/Dashboard"
import FloatingMenu from "./components/FloatingMenu";
import HomePage from "./components/HomePage"; // Import HomePage
import TrafficLightTimer from "./components/TrafficLightTimer"
import AddCriminal from "./components/AddCriminal";
import ViewCriminals from "./components/ViewCriminals";
import CriminalDetails from "./components/CriminalDetails";
import VideoComponent from "./components/VideoComponent";
import LiveAlerts from "./components/LiveAlerts";
import DetectionHistory from "./components/DetectionHistory";
import Analytics from "./components/Analytics"; // Import Analytics component
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Violence from "./components/Violence";

const App = () => {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        {/* <Header /> */}
        <FloatingMenu />
        <main className="flex-grow-1">
          <div className="App dark-mode-container">
            <Routes>
              {/* <Route path="/" element={<Dashboard />} /> */}
              <Route path="/" element={<HomePage />} />
              <Route path="/traffic-management" element={<TrafficLightTimer />} />
              <Route path="/violence-detection" element={<Violence />} />
              <Route path="/add-criminal" element={<AddCriminal />} />
              <Route path="/view-criminals" element={<ViewCriminals />} />
              <Route path="/criminal/:id" element={<CriminalDetails />} />
              <Route path="/videos" element={<VideoComponent />} />
              <Route path="/live-alerts" element={<LiveAlerts />} />
              <Route path="/detection-history" element={<DetectionHistory />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;