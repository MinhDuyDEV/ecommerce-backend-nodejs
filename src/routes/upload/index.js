"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const uploadController = require("../../controllers/upload.controller");
const { uploadDisk, uploadMemory } = require("../../configs/multer.config");

router.post("/product", asyncHandler(uploadController.uploadImageFromUrl));
router.post(
  "/product/thumb",
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadFileThumb)
);

// upload to S3
router.post(
  "/product/bucket",
  uploadMemory.single("file"),
  asyncHandler(uploadController.uploadImageFromLocalS3)
);

module.exports = router;
