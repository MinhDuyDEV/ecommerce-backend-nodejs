"use strict";

const { findShopById } = require("../models/repositories/shop.repository");
const { NotFoundError } = require("../core/error.response");
const SpuModel = require("../models/spu.model");
const { randomProductId } = require("../utils");
const {newSku} = require("./sku.service");

const newSpu = async ({
  product_id,
  product_name,
  product_thumbnail,
  product_description,
  product_price,
  product_category,
  product_shop,
  product_attributes,
  product_quantity,
  product_variations,
  sku_list = [],
}) => {
  try {
    // 1. check shop exist
    const foundShop = await findShopById({ shop_id: product_shop });
    if (!foundShop) throw new NotFoundError("Shop not found");
    // 2. check product_id exist
    const foundSpu = await SpuModel.findOne({ product_id });
    if (foundSpu) throw new NotFoundError("Product already exists");
    const spu = await SpuModel.create({
      product_id: randomProductId(),
      product_name,
      product_thumbnail,
      product_description,
      product_price,
      product_category,
      product_shop,
      product_attributes,
      product_quantity,
      product_variations,
    });
    if (spu && sku_list.length > 0) {
      // 3. add sku
      newSku({sku_list, spu_id: spu.product_id});
    }

    // 4. sync to elastic search

    // 5. response result object
    return !!spu;
  } catch (error) {}
};

module.exports = {
    newSpu,
}
