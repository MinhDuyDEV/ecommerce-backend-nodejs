"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const discountController = require("../../controllers/discount.controller");

// get amount a discount
router.post("/amount", asyncHandler(discountController.getDiscountAmount));
router.get(
  "/list_product_code",
  asyncHandler(discountController.getAllDiscountCodesWithProduct)
);

router.use(authenticationV2);

// create discount
router.post("/", asyncHandler(discountController.createDiscountCode));
// get discount
router.get("/", asyncHandler(discountController.getAllDiscountCode));

module.exports = router;
