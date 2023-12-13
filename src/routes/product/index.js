"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");

// middleware authentication
router.use(authenticationV2);

// create product
router.post("/", asyncHandler(productController.createProduct));
// publish product
router.post(
  "/publish/:id",
  asyncHandler(productController.publishProductByShop)
);
router.post(
  "/unpublish/:id",
  asyncHandler(productController.unPublishProductByShop)
);

// Query
router.get("/drafts/all", asyncHandler(productController.getAllDraftsShop));
router.get(
  "/published/all",
  asyncHandler(productController.findAllPublishForShop)
);

module.exports = router;
