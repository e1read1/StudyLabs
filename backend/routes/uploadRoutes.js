const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

require("dotenv").config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// @route POST /api/upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    // function to handle the stream upload to cloudinary
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        // Pass the file buffer to the stream using streamifier
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    // call streamUpload function
    const result = await streamUpload(req.file.buffer);

    // respond with the upload image url
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading file" });
  }
});

module.exports = router;
