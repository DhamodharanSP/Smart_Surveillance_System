// LiveAlerts.js
import React, { useState, useEffect } from "react";
import { MapPin, Clock, Phone, Eye, Download, ZoomIn, RefreshCw } from 'lucide-react';
import alertGif from './Alert.gif';
import "../assets/LiveAlerts.css";

export default function LiveAlerts() {
  const [persons, setPersons] = useState([]);
  const [detections, setDetections] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // ------------------ FETCH ACTIVE PERSONS ------------------
  useEffect(() => {
    fetchPersons();
    fetchAllDetections();
  }, []);

  const fetchPersons = async () => {
    try {
      const response = await fetch("http://localhost:5001/get-name"); // socket.io server maintains names
      if (!response.ok) throw new Error("Failed to fetch names");
      const { names } = await response.json();

      if (Array.isArray(names) && names.length > 0) {
        const data = await Promise.all(
          names.map(async (name) => {
            const res = await fetch(`http://localhost:5000/fetch-person?name=${name}`);
            return await res.json();
          })
        );
        setPersons(data);
      }
    } catch (err) {
      console.error("❌ Error fetching persons:", err);
    }
  };

  // ------------------ FETCH DETECTIONS ------------------
  const fetchAllDetections = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/detection-history");
      if (response.ok) {
        const data = await response.json();
        setDetections(data);
      }
    } catch (error) {
      console.error("Error fetching detection history:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter detections for selected person
  const getFilteredDetections = () => {
    if (!selectedPerson) return detections;
    return detections.filter((d) => d.name === selectedPerson.fullName);
  };

  const handlePersonClick = (person) => {
    setSelectedPerson(selectedPerson?.fullName === person.fullName ? null : person);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const downloadImage = (imageUrl, id) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `detection-${id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
    <div class = 'own'>
      <h1 >Temple Management Dashboard</h1>
      <h5>Real time Monitoring and Management System</h5>
    </div>
    <div className="bg-white rounded-lg shadow-lg p-6">
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Missing Person Monitoring</h3>
          <p className="text-sm text-gray-600">AI-powered detection and monitoring</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={fetchAllDetections}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <div className="text-sm text-red-600 font-medium">{persons.length} Active Cases</div>
        </div>
      </div>

      {/* Persons List */}
      <div className="space-y-4 mb-8">
        {persons.map((person, idx) => (
          <div
            key={idx}
            className={`border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg hover:shadow-md cursor-pointer ${
              selectedPerson?.fullName === person.fullName ? "ring-2 ring-red-300" : ""
            }`}
            onClick={() => handlePersonClick(person)}
          >
            <div className="flex items-start space-x-4">
              <div className="w-20 bg-gray-300 rounded-lg overflow-hidden">
                <img src={person.photo} alt={person.fullName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800">{person.fullName}</h4>
                <p className="text-sm text-gray-600">Age: {person.estimatedAge}</p>
                <p className="text-sm text-gray-700">Gender: {person.gender}</p>
                <p className="text-xs text-gray-500">Last Seen: {"Main Block"}</p>
                <p className="text-xs text-gray-500">Height: {"5.8 Feet"}</p>
                <p className="text-xs text-gray-500">Reported By: {"Kishore"}, Relation : {"Friend"}</p>
                <p className="text-xs text-red-600">Contact: {"99988 76543"}</p>

              </div>
              <img src={alertGif} alt="Alert" className="w-6 h-auto ml-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Detection Grid */}
      <div className="border-t pt-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4">
          {selectedPerson
            ? `Detections for ${selectedPerson.fullName}`
            : "All Recent Detections"}
        </h4>

        {loading ? (
          <div className="flex justify-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : getFilteredDetections().length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {getFilteredDetections().map((det, i) => (
              <div key={i} className="relative group">
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={det.photo}
                    alt={`Detection-${i}`}
                    className="w-full h-24 object-cover cursor-pointer"
                    onClick={() => handleImageClick(det.photo)}
                  />
                  <div className="p-2 text-xs text-gray-700">
                    <div className="flex justify-between">
                      <span>{det.location}</span>
                      <span>{new Date(det.timestamp).toLocaleTimeString()}</span>
                    </div>
                    {det.cases && <p className="text-red-600">Case: {det.cases}</p>}
                  </div>
                </div>
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex space-x-1">
                  <button
                    onClick={() => handleImageClick(det.photo)}
                    className="bg-blue-600 text-white p-1 rounded"
                  >
                    <ZoomIn className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => downloadImage(det.photo, i)}
                    className="bg-green-600 text-white p-1 rounded"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Eye className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No detections found</p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">Detected Person Image</h3>
              <button onClick={() => setShowImageModal(false)}>✕</button>
            </div>
            <div className="p-4">
              <img src={selectedImage} alt="Detected" className="max-w-full h-auto mx-auto" />
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
