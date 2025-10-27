import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/FloatingMenu.css";

const FloatingMenu = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate(); // Navigation Hook

  return (
    <>
      {/* Floating Menu Button */}
      <button onClick={() => setShow(true)} className="floating-menu-button">
        ☰
      </button>

      {/* Sidebar Menu */}
      <div className={`floating-menu-sidebar ${show ? "show" : ""}`}>
        <button className="close-button" onClick={() => setShow(false)}>×</button>
        <h2 className="menu-title">Menu</h2>
        <ul className="floating-menu-list">
          <li>
            <button className="floating-menu-link" onClick={() => { 
              navigate("/add-criminal"); 
              setShow(false); 
            }}>
              ➕ Add Criminal
            </button>
          </li>
          <li>
            <button className="floating-menu-link" onClick={() => { 
              navigate("/view-criminals"); 
              setShow(false);
            }}>
              👁️ View Criminals
            </button>
          </li>
          <li>
            <button className="floating-menu-link" onClick={() => { 
              navigate("/videos"); 
              setShow(false);
            }}>
              🎥 Videos
            </button>
          </li>
          <li>
            <button className="floating-menu-link" onClick={() => { 
              navigate("/live-alerts"); 
              setShow(false);
            }}>
              🚨 Live Alerts
            </button>
          </li>
          <li>
            <button className="floating-menu-link" onClick={() => { 
              navigate("/detection-history"); 
              setShow(false);
            }}>
              📜 Alerts
            </button>
          </li>
          {/* Analytics Button */}
          <li>
            <button className="floating-menu-link" onClick={() => { 
              navigate("/analytics");  
              setShow(false);
            }}>
              📊 Analytics
            </button>
          </li>
        </ul>
      </div>
      {/* Overlay to close menu */}
      {show && <div className="overlay" onClick={() => setShow(false)}></div>}
    </>
  );
};

export default FloatingMenu;
