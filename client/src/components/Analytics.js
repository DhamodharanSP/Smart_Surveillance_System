import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Button } from "react-bootstrap";
import { jsPDF } from "jspdf";
import "../assets/Analytics.css";

const Analytics = () => {
  const [detections, setDetections] = useState([]);

  useEffect(() => {
    fetchDetectionHistory();
  }, []);

  const fetchDetectionHistory = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/detection-history");
      const data = await response.json();
      setDetections(data);
    } catch (error) {
      console.error("Error fetching detection history:", error);
    }
  };

  // Frequency Analysis - Count detections per name
  const frequencyData = detections.reduce((acc, record) => {
    const name = record.name;
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const barChartData = Object.keys(frequencyData).map(name => ({
    name,
    count: frequencyData[name],
  }));

  // Location-Based Trends - Count detections per location
  const locationData = detections.reduce((acc, record) => {
    const location = record.location;
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.keys(locationData).map(location => ({
    name: location,
    value: locationData[location],
  }));

  // Generate PDF function
  const generatePDF = (title, data) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text(title, 14, 10);
    
    let yPosition = 20;
    data.forEach((item) => {
      doc.setFontSize(12);
      doc.text(`${item.name}: ${item.count || item.value}`, 14, yPosition);
      yPosition += 10;
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });

    doc.save(`${title}.pdf`);
  };

  return (
    <div className="analytics-page">
      <h1 className="page-title">Analytics Dashboard</h1>

      {/* Bar Chart for Frequency Analysis */}
      <div className="analytics-section">
        <h2>📊 Criminal Detection Frequency</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData}>
            <XAxis dataKey="name" stroke="#ffcc00" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#ffcc00" />
          </BarChart>
        </ResponsiveContainer>
        <Button onClick={() => generatePDF("Frequency Analysis", barChartData)} className="download-pdf-button">
          Download PDF
        </Button>
      </div>

      {/* Pie Chart for Location-Based Trends */}
      <div className="analytics-section">
        <h2>📍 Detection Location Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#ffcc00" label>
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={["#ffcc00", "#ff9900", "#ff6600"][index % 3]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <Button onClick={() => generatePDF("Location Analysis", pieChartData)} className="download-pdf-button">
          Download PDF
        </Button>
      </div>

      {/* Heatmap Placeholder (Custom Implementations Needed) */}
      <div className="analytics-section">
        <h2>🔥 Heatmap (Coming Soon)</h2>
        <p>We can integrate a heatmap library or use MapBox for location-based heat visualization.</p>
      </div>
    </div>
  );
};

export default Analytics;
