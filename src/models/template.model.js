"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "template";
const COLLECTION_NAME = "templates";

const templateSchema = new Schema(
  {
    tem_id: { type: Number, required: true, unique: true },
    tem_name: { type: String, required: true },
    tem_state: { type: String, default: "active" },
    tem_html: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, templateSchema);
