"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Spu";
const COLLECTION_NAME = "Spus";

const ProductSchema = new Schema(
  {
    product_id: { type: String, default: "" },
    product_name: { type: String, required: true },
    product_thumbnail: { type: String, required: true },
    product_price: { type: Number, required: true },
    product_category: { type: Array, required: [] },
    product_description: { type: String, required: true },
    product_slug: { type: String },
    // product_category: {
    //   type: String,
    //   required: true,
    //   enum: ["Electronics", "Clothing", "Furniture"],
    // },
    product_quantity: { type: Number, required: true },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    /*
      {
        attribute_id: 12345, // style ao [han quoc, thoi trang, mua he]
        attribute_value: [
          {
            value_id: 12345, // han quoc
            value_name: "Han Quoc"
          },
          {
            value_id: 12346, // thoi trang
            value_name: "Thoi Trang"
          }
        ]
      }
    */
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    product_rating: {
      type: Number,
      required: true,
      default: 4.5,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
      set: (value) => Math.round(value * 10) / 10,
    },
    product_variations: { type: Array, default: [] },
    /*
      product_variations: [
        {
          images: [],
          name: 'color',
          options: ['red', 'blue', 'green']
        },
        {
          images: [],
          name: 'size',
          options: ['S', 'M', 'L']
        }
      ]
    */
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    isDeleted: { type: Boolean, default: false, index: true, select: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, ProductSchema);
