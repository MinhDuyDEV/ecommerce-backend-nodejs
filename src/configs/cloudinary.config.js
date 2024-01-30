"use strict";

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // api_key: process.env.CLOUDINARY_API_KEY,
  // api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: "minhduyshopdev",
  api_key: "153481364232674",
  api_secret: "8YInz0nZFTuHDY3gX7lFoPiFwcQ",
});

module.exports = cloudinary;
