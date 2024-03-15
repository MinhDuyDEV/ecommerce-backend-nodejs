"use strict";

const { randomInt } = require("crypto");
const OTP = require("../models/otp.model");

const generatorTokenRandom = async () => {
  const token = randomInt(0, Math.pow(2, 32));
  return token;
};

const newOtp = async (email) => {
  const token = await generatorTokenRandom();
  const newToken = await OTP.create({
    otp_token: token,
    otp_email: email,
  });
  return newToken;
};

module.exports = {
  newOtp,
  generatorTokenRandom,
};
