"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const uploadController = require("../../controllers/upload.controller");

router.post("/product", asyncHandler(uploadController.uploadImageFromUrl));

module.exports = router;
