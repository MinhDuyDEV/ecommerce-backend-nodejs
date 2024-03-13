"use strict";

const express = require("express");
const {
  newRole,
  newResource,
  listRole,
  listResource,
} = require("../../controllers/rbac.controller");
const asyncHandler = require("../../helpers/asyncHandler");

const router = express.Router();

router.post("/role", asyncHandler(newRole));
router.get("/roles", asyncHandler(listRole));

router.post("/resource", asyncHandler(newResource));
router.get("/resources", asyncHandler(listResource));

module.exports = router;
