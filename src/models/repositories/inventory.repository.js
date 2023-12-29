"use strict";

const { convertToObjectIdMongodb } = require("../../utils");
const inventory = require("../inventory.model");
const { Types } = require("mongoose");

const insertInventory = async ({
  product_id,
  shop_id,
  quantity,
  location = "unknown",
}) => {
  return await inventory.create({
    inventory_product_id: new Types.ObjectId(product_id),
    inventory_shop: new Types.ObjectId(shop_id),
    inventory_stock: quantity,
    inventory_location: location,
  });
};

const reservationInventory = async ({
  product_id,
  product_quantity,
  cart_id,
}) => {
  const query = {
      inventory_product_id: convertToObjectIdMongodb(product_id),
      inventory_stock: { $gte: product_quantity },
    },
    updateSet = {
      $inc: {
        inventory_stock: -product_quantity,
      },
      $push: {
        inventory_reservations: {
          product_quantity,
          cart_id,
          createOn: new Date(),
        },
      },
    },
    options = {
      upsert: true,
      new: true,
    };
  return await inventory.updateOne(query, updateSet, options);
};

module.exports = { insertInventory, reservationInventory };
