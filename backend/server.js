const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const Criminal = require('./models/Criminal');

dotenv.config(); 
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/videos", express.static(path.join(__dirname, "public/videos")));
app.use("/uploads", express.static("uploads"));

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Crime_Info", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Schema Definitions
const detectionSchema = new mongoose.Schema({
  name: String,
  location: String,
  cameraId: String,
  timestamp: { type: Date, default: Date.now },
  photo: String,
  cases: String, // Add case details if required
  lastSeen: String, // Last seen details
});

const cameraSchema = new mongoose.Schema({
  cameraId: String, // Unique Camera Identifier
  latitude: Number,
  longitude: Number,
  location: String, // Readable place name
});

const Detection = mongoose.model("detections", detectionSchema);
const Camera = mongoose.model("cameras", cameraSchema);

// Routes for Criminal Management
app.use("/api/criminals", require("./routes/criminalRoutes"));

// ==============================
// 🚀 Fetch Suspect by Name (NEW API)
// ==============================

app.get("/fetch-person", async (req, res) => {
  try {
    const { name } = req.query;  // Get name from query parameters
    console.log(`🔍 Searching for suspect: ${name}`);

    // Use Criminal Schema to fetch the suspect by fullName
    const suspect = await Criminal.findOne({ fullName: name });

    if (!suspect) {
      console.log(`❌ Suspect ${name} not found`);
      return res.status(404).json({ error: `Suspect ${name} not found` });
    }

    console.log(`✅ Found suspect:`, suspect);

    // Return the full suspect details including estimatedAge, gender, etc.
    res.json({
      fullName: suspect.fullName,
      photo: suspect.photo,
      estimatedAge: suspect.estimatedAge || "N/A",  // Add estimatedAge
      gender: suspect.gender || "N/A",              // Add gender
      height: suspect.height || "N/A",              // Add height
      weight: suspect.weight || "N/A",              // Add weight
      cases: suspect.cases || "N/A",                // Add cases
      lastSeen: suspect.lastSeen || "Unknown",      // Add lastSeen
    });
  } catch (err) {
    console.error("❌ Error fetching suspect details:", err);
    res.status(500).json({ error: "Error fetching suspect details" });
  }
});

const storage = multer.diskStorage({
  destination: "uploads/", // Temporary folder for uploads
  filename: (req, file, cb) => {
      cb(null, file.originalname); // Keep original filename
  },
});

const upload = multer({ storage });

app.post("/api/save-image", upload.single("photo"), (req, res) => {
  const { fullName } = req.body;
  if (!req.file) {
      return res.status(400).json({ message: "❌ No file uploaded" });
  }

  const tempPath = req.file.path;
  const fileExt = path.extname(req.file.originalname) || ".jpg";
  
  // ✅ Save image in ../face_recognition/images/ with the name {fullName}.jpg
  const targetFolder = path.join(__dirname, "../face_recognition/images");
  const targetPath = path.join(targetFolder, fullName + fileExt);

  // ✅ Ensure the images folder exists
  if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
  }

  // ✅ Move file from temp folder to images/
  fs.rename(tempPath, targetPath, (err) => {
      if (err) {
          return res.status(500).json({ message: "❌ Error saving image" });
      }
      res.json({ message: `✅ Image saved successfully at: ${targetPath}` });
  });
});


// ==============================
// 🚀 Video Handling API (Updated with Timestamp)
// ==============================
app.get("/api/videos", (req, res) => {
  const directoryPath = path.join(__dirname, "public/videos");

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Unable to scan directory" });
    }

    const videoData = files
      .filter((file) => file.endsWith(".mp4"))
      .map((file) => {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          recordedTime: stats.birthtime.toISOString(),
        };
      });

    res.json(videoData);
  });
});

// 📌 Receive Recognized Names & Associated Videos
app.post("/api/recognition", (req, res) => {
  const { name, video } = req.body;
  console.log(`Received: ${name} - ${video}`);
  res.json({ message: "Recognition received successfully" });
});

// 📌 Get Recognized Names
app.get("/api/recognized-names", (req, res) => {
  res.json(recognizedNames);
});

// ==============================
// 🚀 Detection History API
// ==============================
app.get("/api/detection-history", async (req, res) => {
  try {
    const detections = await Detection.find().sort({ timestamp: -1 });

    // Fetch camera details for each detection
    const updatedDetections = await Promise.all(
      detections.map(async (detection) => {
        const camera = await Camera.findOne({ cameraId: detection.cameraId });
        if (camera) {
          return {
            ...detection._doc,
            latitude: camera.latitude,
            longitude: camera.longitude,
            location: camera.location,
          };
        }
        return {
          ...detection._doc,
          latitude: null,
          longitude: null,
        };
      })
    );

    res.json(updatedDetections);
  } catch (err) {
    res.status(500).json({ error: "Error fetching detection history" });
  }
});


app.post("/api/add-detection", async (req, res) => {
  try {
    const { name, cameraId, photo, cases, lastSeen } = req.body;

    const camera = await Camera.findOne({ cameraId });

    const newDetection = new Detection({
      name,
      location: camera ? camera.location : "Unknown Location",
      cameraId,
      photo,
      cases,
      lastSeen,
    });

    await newDetection.save();
    res.status(201).json({ message: "Detection record added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error adding detection record" });
  }
});

// ==============================
// 📌 Camera Location Management API
// ==============================

// ✅ Add New Camera with Location Details
app.post("/api/add-camera", async (req, res) => {
  try {
    const { cameraId, latitude, longitude, location } = req.body;

    const existingCamera = await Camera.findOne({ cameraId });

    if (existingCamera) {
      return res.status(400).json({ error: "Camera ID already exists" });
    }

    const newCamera = new Camera({
      cameraId,
      latitude,
      longitude,
      location,
    });

    await newCamera.save();
    res.status(201).json({ message: "Camera added successfully" });
  } catch (error) {
    console.error("Error adding camera:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ==============================
// 🚀 Start Server
// ==============================
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
