"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");

// middleware authentication
router.use(authenticationV2);

// create product
router.post("/", asyncHandler(productController.createProduct));

module.exports = router;
