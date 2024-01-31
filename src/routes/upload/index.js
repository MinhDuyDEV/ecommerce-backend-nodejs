"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const uploadController = require("../../controllers/upload.controller");
const { uploadDisk } = require("../../configs/multer.config");

router.post("/product", asyncHandler(uploadController.uploadImageFromUrl));
router.post(
  "/product/thumb",
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadFileThumb)
);

module.exports = router;
