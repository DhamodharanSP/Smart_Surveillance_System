import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone'; // Import react-dropzone
import '../assets/AddCriminal.css';

const AddCriminal = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    alias: '',
    gender: '',
    estimatedAge: '',
    weight: '',
    height: '',
    bodyType: '',
    skinTone: '',
    hair: '',
    facialHair: '',
    eyeColor: '',
    scarsTattoos: '',
    photo: null,
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Handle change for input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file change for photo upload
  const handleFileChange = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setFormData({ ...formData, photo: file });
    setPhotoPreview(URL.createObjectURL(file)); // Preview selected image
  };

  // Open Camera
  const openCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Error accessing camera. Please ensure you have granted permissions.');
    }
  };

  // Capture Photo
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            // ✅ Convert Blob to File with a proper name
            const file = new File([blob], `${formData.fullName}_captured.jpg`, { type: "image/jpeg" });

            setFormData({ ...formData, photo: file });
            setPhotoPreview(URL.createObjectURL(file));
        }, "image/jpeg");

        // Stop the camera
        video.srcObject.getTracks().forEach((track) => track.stop());
        setShowCamera(false);
    }
};


const saveImageToLocalFolder = async () => {
  if (!formData.fullName || !formData.photo) {
      alert("Full Name and Photo are required!");
      return;
  }

  const data = new FormData();
  data.append("fullName", formData.fullName);
  
  // ✅ Rename the photo before sending
  const photoFile = new File([formData.photo], `${formData.fullName}.jpg`, { type: "image/jpeg" });

  data.append("photo", photoFile, photoFile.name);

  try {
      await axios.post("http://localhost:5000/api/save-image", data, {
          headers: { "Content-Type": "multipart/form-data" },
      });
  } 
  catch (error) {
      console.error("Error saving image:", error);
      alert("Failed to save image.");
  }
};





  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      await axios.post('http://localhost:5000/api/criminals', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Criminal added successfully');
      await saveImageToLocalFolder();
      // Reset form after successful submission
      setFormData({
        fullName: '',
        alias: '',
        gender: '',
        estimatedAge: '',
        weight: '',
        height: '',
        bodyType: '',
        skinTone: '',
        hair: '',
        facialHair: '',
        eyeColor: '',
        scarsTattoos: '',
        photo: null,
      });
      setPhotoPreview(null);
    } catch (err) {
      console.error(err);
      alert('Error adding criminal');
    }
  };

  // Use dropzone hook for drag-and-drop functionality
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: handleFileChange,
  });

  return (
    <div className="add-criminal-container">
      <h2>Add Criminal</h2>
      <form onSubmit={handleSubmit} className="criminal-form">
        <div className="form-row">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Alias</label>
            <input
              type="text"
              name="alias"
              value={formData.alias}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Gender</label>
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Estimated Age</label>
            <input
              type="text"
              name="estimatedAge"
              value={formData.estimatedAge}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Height</label>
            <input
              type="text"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Weight</label>
            <input
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Body Type</label>
            <input
              type="text"
              name="bodyType"
              value={formData.bodyType}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Skin Tone</label>
            <input
              type="text"
              name="skinTone"
              value={formData.skinTone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Hair</label>
            <input
              type="text"
              name="hair"
              value={formData.hair}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Facial Hair</label>
            <input
              type="text"
              name="facialHair"
              value={formData.facialHair}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Eye Color</label>
            <input
              type="text"
              name="eyeColor"
              value={formData.eyeColor}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Scars/Tattoos</label>
            <input
              type="text"
              name="scarsTattoos"
              value={formData.scarsTattoos}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Drag-and-Drop Section for Photo Upload */}
        <div {...getRootProps()} className="drag-drop-container">
          <input {...getInputProps()} name="photo" hidden />
          <p>Drag and drop an image here, or click to select</p>
        </div>

        {/* Show image preview if selected */}
        {photoPreview && (
          <img src={photoPreview} alt="Preview" className="image-preview" />
        )}

        {/* Capture from Camera */}
        <button type="button" onClick={openCamera} className="camera-button">
          Open Camera
        </button>

        {showCamera && (
          <div>
            <video ref={videoRef} autoPlay className="video-feed"></video>
            <canvas ref={canvasRef} width="300" height="200" style={{ display: 'none' }}></canvas>
            <button type="button" onClick={capturePhoto} className="capture-button">
              Capture Photo
            </button>
          </div>
        )}

        <button type="submit" className="submit-button">
          Add Criminal
        </button>
      </form>
    </div>
  );
};

export default AddCriminal;