"use strict";

const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "email-smtp.ap-southeast-1.amazonaws.com",
  port: 465,
  secure: true,
  auth: {
    user: "AKIA4SW7WGZBCLIDGPGC",
    pass: "BK9TllDhe+6nBtD27dpJSAM+gTTL+vJ2imrVS+0qfLYk",
  },
});

module.exports = transport;
