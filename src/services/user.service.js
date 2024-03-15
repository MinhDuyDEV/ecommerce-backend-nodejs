"use strict";

const User = require("../models/user.model");
const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const { sendEmailToken } = require("./email.service");

const newUserService = async ({ email = null, captcha = null }) => {
  try {
    // 1. check email exist or not
    const user = await User.findOne({ user_email: email }).lean();
    // 2. if email exist then return error
    if (user) return BadRequestError({ message: "Email already exist" });
    // 3. send token via email user
    const result = await sendEmailToken(email);
    return {
      message: "Verification link sent to your email",
      metadata: { token: result },
    };
  } catch (error) {}
};

module.exports = {
  newUserService,
};
