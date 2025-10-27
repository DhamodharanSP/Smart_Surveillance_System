import React, { useEffect, useState } from "react";
import "../assets/VideoComponent.css"; // Import the updated styles

const VideoComponent = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/videos");
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  return (
    <div className="video-page">
      <h1 className="page-title">Crime Video Reports</h1>
      <div className="crime-reports">
        {videos.length === 0 ? (
          <p className="no-videos">No videos available.</p>
        ) : (
          videos.map((video, index) => (
            <div key={index} className="crime-section">
              <div className="video-info-container">
                <div className="video-container">
                  <video controls className="video-player">
                    <source src={`http://localhost:5000/videos/${video.name}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="timing">
                    <p><strong>⏳ RECORDED ON:</strong> {new Date(video.recordedTime).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VideoComponent;
