import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/Violence.css"; // Import styles

const Violence = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("http://localhost:5003/api/videos");
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="violence-container">
      <header className="violence-header">
        <h1>🔴 Violence Detection Videos</h1>
        <p>Recorded instances of detected violence</p>
      </header>

      <main className="video-grid">
        {videos.length === 0 ? (
          <p className="no-videos">No videos recorded yet.</p>
        ) : (
          videos.map((video, index) => (
            <div key={index} className="video-card">
              <video controls className="video-player">
                <source
                  src={`http://localhost:5003/videos/${video.name}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <p className="video-timestamp">
                📅 Recorded at: {new Date(video.recordedTime).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default Violence;
