import { useState } from "react";
import TrafficTimer from "./TrafficTimer";
import "../assets/TrafficLightTimer.css";

const trafficPhases = [
  { color: "red", duration: 60 }, // 60 seconds for red light
  { color: "yellow", duration: 3 },
  { color: "green", duration: 7 },
];

function TrafficLightTimer() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [globalTimer, setGlobalTimer] = useState(60); // Tracks overall red light time

  return (
    <div className="traffic-container">
      <h2 className="title">🚦 Smart Traffic Signal System</h2>

      <div className="traffic-light">
        {trafficPhases.map((phase, index) => (
          <div
            key={index}
            className={`light ${phase.color} ${index === currentPhase ? "active" : ""}`}
          ></div>
        ))}
      </div>

      {/* Import and use the Timer Component */}
      <TrafficTimer
        trafficPhases={trafficPhases}
        currentPhase={currentPhase}
        setCurrentPhase={setCurrentPhase}
        globalTimer={globalTimer}
        setGlobalTimer={setGlobalTimer}
      />

      
    </div>
  );
}

export default TrafficLightTimer;
