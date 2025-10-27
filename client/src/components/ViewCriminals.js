import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../assets/ViewCriminal.css'; // Import the updated styling

const ViewCriminals = () => {
  const [criminals, setCriminals] = useState([]);

  useEffect(() => {
    const fetchCriminals = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/criminals');
        console.log("Fetched Criminals Data:", res.data);
        setCriminals(res.data);
      } catch (err) {
        console.error("Error fetching criminals:", err);
      }
    };
  
    fetchCriminals();
  }, []);

  return (
    <div className="criminals-container">
      <h1 className="page-title">Criminals List</h1>
      <div className="criminals-cards">
        {criminals.map((criminal) => (
          <div key={criminal._id} className="criminal-card">
            <img src={criminal.photo} alt={criminal.fullName} className="criminal-photo" />
            <h3>{criminal.fullName}</h3>
            <p>{criminal.alias}</p>
            <Link to={`/criminal/${criminal._id}`} className="view-details-link">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewCriminals;
