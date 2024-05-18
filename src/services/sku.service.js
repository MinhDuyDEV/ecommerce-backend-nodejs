"use strict";

const { randomProductId } = require("../utils");
const SkuModel = require("../models/sku.model");

const newSku = async ({ spu_id, sku_list }) => {
  try {
    const convert_sku_list = sku_list.map((sku) => {
      return {
        ...sku,
        product_id: spu_id,
        sku_id: `${spu_id}.${randomProductId()}`,
      };
    });

    const skus = await SkuModel.create(convert_sku_list);

    return skus;
  } catch (error) {
    return [];
  }
};

module.exports = {
  newSku,
};
