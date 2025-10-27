import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "../assets/DetectionHistory.css"; // Import CSS for styling

const DetectionHistory = () => {
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetectionHistory();
  }, []);

  const fetchDetectionHistory = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/detection-history"); // Backend API
      const data = await response.json();
      setDetections(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching detection history:", error);
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("Detection History", 14, 10); // Title

    // Set starting Y position for records
    let yPosition = 20;

    detections.forEach((record, index) => {
      doc.setFontSize(12);
      doc.text(`Name: ${record.name}`, 14, yPosition);
      yPosition += 10;
      doc.text(`Location: ${record.location}`, 14, yPosition);
      yPosition += 10;
      doc.text(`Time: ${new Date(record.timestamp).toUTCString()}`, 14, yPosition);
      yPosition += 15;

      // Add a page if the content is getting too long
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });

    // Save the PDF
    doc.save("detection_history.pdf");
  };

  return (
    <div className="history-page">
      <h1 className="page-title">Detection History</h1>
      <button onClick={generatePDF} className="download-pdf-button">
        Download PDF
      </button>
      {loading ? (
        <p className="loading-text">Loading detection history...</p>
      ) : detections.length === 0 ? (
        <p className="no-history">No detections found.</p>
      ) : (
        <div className="history-list">
          {detections.map((record, index) => (
            <div key={index} className="history-card">
              <img src={record.photo} alt={record.name} className="criminal-photo" /> {/* Cloudinary Image URL */}
              <div className="history-info">
                <h3>{record.name}</h3>
                <p>
                  <strong>📍 Location:</strong>{" "}
                  <a
                    href={`https://www.google.com/maps?q=${record.latitude},${record.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="location-link"
                  >
                    {record.location}
                  </a>
                </p>
                <p><strong>🕒 Time:</strong> {new Date(record.timestamp).toUTCString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetectionHistory;
