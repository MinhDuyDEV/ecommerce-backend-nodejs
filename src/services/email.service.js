"use strict";

const { NotFoundError } = require("../core/error.response");
const { transporter } = require("../database/init.nodemailer");
const { replacePlaceholder } = require("../utils");
const { newOtp } = require("./otp.service");
const { getTemplate } = require("./template.service");

const sendEmailLinkVerify = async ({
  html,
  toEmail,
  subject = "Xac nhan Email dang ky!",
  text = "xac nhan...",
}) => {
  try {
    const mailOptions = {
      from: ' "ShopDEV" <anonystick@gmail.com> ',
      to: toEmail,
      subject,
      text,
      html,
    };
    transporter.send(mailOptions, (error, info) => {
      if (error) console.log(error);
      else console.log("Email sent: " + info.response);
    });
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return error;
  }
};

const sendEmailToken = async (email = null) => {
  try {
    // 1. get Token
    const token = await newOtp(email);
    // 2. get template
    const template = await getTemplate({ tem_name: "HTML EMAIL TOKEN" });
    if (!template) return NotFoundError({ message: "Template not found" });
    // 3. replace placeholder with params
    const content = replacePlaceholder(template.tem_html, {
      link_verify: `http://localhost:2201/cgp/welcome-back?token=${token.otp_token}`,
    });
    // 4. send email
    sendEmailLinkVerify({
      html: content,
      toEmail: email,
      subject: "Vui long xac nhan dia chi Email dang ky",
      text: "xac nhan...",
    }).catch((error) => {
      console.error("🚀 ~ error:", error);
    });
    return 1;
  } catch (error) {}
};

module.exports = {
  sendEmailToken,
  sendEmailLinkVerify,
};
