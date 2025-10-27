import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "../assets/LiveAlertsVideo.css"; // Ensure the correct path

const LiveAlertsVideo = () => {
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io("http://localhost:5001");

    socket.on("suspect_detected", (data) => {
      alert(`🚨 ALERT: ${data.name} detected!`);
      fetchAlerts();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/live-alerts");
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="live-alerts-container">
      <h2>🚨 Live Alerts with Video</h2>
      {alerts.length > 0 ? (
        alerts.map((alert, index) => (
          <div
            key={index}
            className="suspect-card"
            onClick={() => navigate(`/criminal/${alert._id}`)}
          >
            <img
              src={alert.photo || "suspect-placeholder.jpg"}
              alt="Suspect"
              className="suspect-photo"
            />
            <div className="suspect-info">
              <p><strong>Name:</strong> {alert.fullName || "Unknown"}</p>
              <p><strong>Last Seen:</strong> {alert.lastSeen || "N/A"}</p>
            </div>
            <div className="video-container">
              <video controls>
                <source src={`http://localhost:5000/videos/${alert.video}`} type="video/mp4" />
              </video>
            </div>
          </div>
        ))
      ) : (
        <p>No live alerts available.</p>
      )}
    </div>
  );
};

export default LiveAlertsVideo;
