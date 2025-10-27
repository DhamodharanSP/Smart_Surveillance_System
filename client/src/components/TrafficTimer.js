import { useState, useEffect } from "react";

function TrafficTimer({ trafficPhases, currentPhase, setCurrentPhase, globalTimer, setGlobalTimer }) {
  const [timeLeft, setTimeLeft] = useState(trafficPhases[currentPhase].duration);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8001/");
    
    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const newTimer = parseInt(event.data, 10);
      if (!isNaN(newTimer)) {
        setGlobalTimer(newTimer);
        setTimeLeft(newTimer);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected, attempting to reconnect...");
      setTimeout(() => setSocket(new WebSocket("ws://localhost:8001/")), 3000);
    };

    setSocket(ws);

    return () => ws.close();
  }, []);

  // Sync `timeLeft` with the current phase's duration when `currentPhase` changes
  useEffect(() => {
    setTimeLeft(trafficPhases[currentPhase].duration);
  }, [currentPhase, trafficPhases]);

  // Handle the countdown logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          const nextPhase = (currentPhase + 1) % trafficPhases.length;
          setCurrentPhase(nextPhase);
          return trafficPhases[nextPhase].duration;
        }
        return prev - 1;
      });

      if (trafficPhases[currentPhase].color === "red") {
        setGlobalTimer((prev) => Math.max(prev - 1, 0));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPhase, trafficPhases, setCurrentPhase, setGlobalTimer]);

  return <h1 className="timer">{timeLeft}s</h1>;
}

export default TrafficTimer;
