import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import '../assets/CriminalDetails.css'; 

const CriminalDetails = () => {
  const { id } = useParams();
  const [criminal, setCriminal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCriminal = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/criminals/${id}`);
        setCriminal(res.data);
      } catch (err) {
        setError("Failed to load criminal details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCriminal();
  }, [id]);

  const downloadPdf = () => {
    if (!criminal) return;
  
    const doc = new jsPDF();
  
    // 🔹 Set PDF Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Criminal Report", 70, 20);
  
    // 🔹 Draw a separator line
    doc.setLineWidth(0.5);
    doc.line(10, 25, 200, 25);
  
    let y = 35;
  
    // 🔹 Add Circular Image at the Top
    if (criminal.photo) {
      doc.setFillColor(255, 255, 255); // White background
      doc.circle(105, y + 30, 30, "F"); // Circular border
      doc.addImage(criminal.photo, "JPEG", 75, y, 60, 60, "", "FAST");
      y += 70;
    }
  
    // 🔹 Criminal Information Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Criminal Information", 20, y);
    doc.setLineWidth(0.2);
    doc.line(20, y + 2, 190, y + 2);
    y += 10;
  
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
  
    // 🔹 Display Details with Proper Alignment
    const fieldSpacing = 10;
    const details = [
      ["Full Name:", criminal.fullName],
      ["Alias:", criminal.alias || "N/A"],
      ["Gender:", criminal.gender],
      ["Estimated Age:", criminal.estimatedAge],
      ["Height:", criminal.height],
      ["Weight:", criminal.weight],
      ["Body Type:", criminal.bodyType || "N/A"],
      ["Skin Tone:", criminal.skinTone || "N/A"],
      ["Hair:", criminal.hair || "N/A"],
      ["Facial Hair:", criminal.facialHair || "N/A"],
      ["Eye Color:", criminal.eyeColor || "N/A"],
      ["Scars/Tattoos:", criminal.scarsTattoos?.length ? criminal.scarsTattoos.join(', ') : "None"],
    ];
  
    details.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 80, y);
      y += fieldSpacing;
    });
  
    // 🔹 Footer Section
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 285);
    doc.text("Confidential Report", 150, 285);
  
    // 🔹 Save the PDF with Criminal Name
    doc.save(`${criminal.fullName}_details.pdf`);
  };
  
  

  if (loading) return <div className="loading">Loading criminal details...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="criminal-details-container">
      <div className="criminal-details-card">
        <h1>{criminal.fullName}</h1>
        {criminal.photo && <img src={criminal.photo} alt={criminal.fullName} className="criminal-photo-large" />}
        <p><strong>Alias:</strong> {criminal.alias || "N/A"}</p>
        <p><strong>Gender:</strong> {criminal.gender}</p>
        <p><strong>Estimated Age:</strong> {criminal.estimatedAge}</p>
        <p><strong>Height:</strong> {criminal.height}</p>
        <p><strong>Weight:</strong> {criminal.weight}</p>
        <p><strong>Body Type:</strong> {criminal.bodyType || "N/A"}</p>
        <p><strong>Skin Tone:</strong> {criminal.skinTone || "N/A"}</p>
        <p><strong>Hair:</strong> {criminal.hair || "N/A"}</p>
        <p><strong>Facial Hair:</strong> {criminal.facialHair || "N/A"}</p>
        <p><strong>Eye Color:</strong> {criminal.eyeColor || "N/A"}</p>
        <p><strong>Scars/Tattoos:</strong> {criminal.scarsTattoos?.length ? criminal.scarsTattoos.join(', ') : "None"}</p>
        <button onClick={downloadPdf} className="download-pdf-button">Download PDF</button>
      </div>
    </div>
  );
};

export default CriminalDetails;
