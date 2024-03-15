"use strict";

const Template = require("../models/template.model");
const { BadRequestError } = require("../core/error.response");
const { htmlEmailToken } = require("../utils/tem.html");

const newTemplate = async ({ tem_name, tem_html, tem_id = 0 }) => {
  try {
    // 1. check if template exist or not
    const template = await Template.findOne({ tem_name }).lean();
    if (template) {
      return BadRequestError({ message: "Template already exist" });
    }
    console.log("test");
    // 2. create new template
    const newTemplate = await Template.create({
      tem_id,
      tem_name,
      tem_html: htmlEmailToken(),
    });
    return newTemplate;
  } catch (error) {
    console.log("🚀 ~ error:", error);
  }
};

const getTemplate = async ({ tem_name }) => {
  const template = await Template.findOne({ tem_name });
  return template;
};

module.exports = {
  newTemplate,
  getTemplate,
};
