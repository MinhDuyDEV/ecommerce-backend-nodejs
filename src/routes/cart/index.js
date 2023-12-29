"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const cartController = require("../../controllers/cart.controller");

router.post("", asyncHandler(cartController.addToCart));
router.delete("", asyncHandler(cartController.deleteCartItem));
router.post("/update", asyncHandler(cartController.updateCart));
router.get("", asyncHandler(cartController.getCart));

module.exports = router;
