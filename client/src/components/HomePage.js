import React from "react";
import { Link } from "react-router-dom";
import "../assets/HomePage.css";

const HomePage = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <h1>Next-Gen Criminal Monitoring for Public Safety</h1>
        <p>AI-Powered Surveillance & Real-Time Alerts to Keep Your City Secure</p>
        <Link to="/dashboard" className="cta-button">Get Started</Link>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Our Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span>🚔</span>
            <h3>Add Criminal</h3>
            <p>Securely add criminal profiles with detailed metadata.</p>
          </div>
          <div className="feature-card">
            <span>👁</span>
            <h3>View Criminals</h3>
            <p>Search and filter criminal records in real time.</p>
          </div>
          <div className="feature-card">
            <span>🎥</span>
            <h3>Videos</h3>
            <p>Access surveillance recordings and live footage.</p>
          </div>
          <div className="feature-card">
            <span>🚨</span>
            <h3>Live Alerts</h3>
            <p>Receive instant alerts on detected suspects.</p>
          </div>
          <div className="feature-card">
            <span>📜</span>
            <h3>Alerts</h3>
            <p>Review past criminal detection records.</p>
          </div>
          <div className="feature-card">
            <span>📊</span>
            <h3>Analytics</h3>
            <p>Gain insights with interactive data visualization.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <span>🤖</span>
            <h3>AI-Driven Face Recognition</h3>
            <p>Matches suspects against a criminal database.</p>
          </div>
          <div className="step">
            <span>🎥</span>
            <h3>Live Video Surveillance</h3>
            <p>Integrates with CCTV & mobile cameras.</p>
          </div>
          <div className="step">
            <span>⚡</span>
            <h3>Instant Alerts</h3>
            <p>Notifies authorities in real-time.</p>
          </div>
          <div className="step">
            <span>📈</span>
            <h3>Data-Driven Insights</h3>
            <p>Helps law enforcement with crime trends.</p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact">
        <h2>Ensuring Public Safety</h2>
        <p>Our system enhances security, leverages AI for accuracy, and integrates seamlessly with law enforcement tools.</p>
      </section>
    </div>
  );
};

export default HomePage;