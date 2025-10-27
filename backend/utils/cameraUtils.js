const cameraLocations = {
    "Camera 0": { lat: 11.286052, lng: 77.621025 },
    "Camera 1": { lat: 12.971598, lng: 77.594562 },
    // "Camera_2": { lat: 28.704060, lng: 77.102493 },
  };
  
  const getCameraLocation = (cameraId) => {
    return cameraLocations[cameraId] || { lat: 0, lng: 0 };
  };
  
  module.exports = { getCameraLocation };
  