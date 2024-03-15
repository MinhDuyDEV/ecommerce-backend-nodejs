"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { newTemplate } = require("../../controllers/email.controller");

router.post("/new-template", asyncHandler(newTemplate));

module.exports = router;
