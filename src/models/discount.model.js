"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

const discountSchema = new Schema(
  {
    discount_name: { type: string, required: true },
    discount_description: { type: string, required: true },
    discount_type: { type: string, default: "fixed_amount" }, // percentage, fixed_amount
    discount_value: { type: Number, required: true }, // 10.000 , 10%
    discount_code: { type: string, required: true }, // discount code
    discount_start_date: { type: Date, required: true }, // start date
    discount_end_date: { type: Date, required: true }, // end date
    discount_max_uses: { type: Number, required: true }, // maximum uses
    discount_uses_count: { type: Number, default: 0 }, // how many discount used
    discount_users_used: { type: Array, default: [] }, // users used
    discount_max_uses_per_user: { type: Number, default: 1, require: true }, // maximum uses per user
    discount_min_order_amount: { type: Number, default: 0 }, // minimum order amount
    discount_shop_id: { type: Schema.Types.ObjectId, ref: "Shop" }, // shop id
    discount_is_active: { type: Boolean, default: true }, // is active
    discount_applies_to: {
      type: string,
      required: true,
      enum: ["all", "specific"],
    }, // applies to all products or specific products
    discount_product_ids: { type: Array, required: true }, // product ids
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, discountSchema);
