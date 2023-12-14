"use strict";

const inventory = require("../inventory.model");
const { Types } = require("mongoose");

const insertInventory = async ({
  product_id,
  shop_id,
  quantity,
  location = "unknown",
}) => {
  return await inventory.create({
    inventory_product: new Types.ObjectId(product_id),
    inventory_shop: new Types.ObjectId(shop_id),
    inventory_quantity: quantity,
    inventory_location: location,
  });
};

module.exports = { insertInventory };
