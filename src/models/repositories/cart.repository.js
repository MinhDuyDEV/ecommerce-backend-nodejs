"use strict";

const cart = require("../../models/cart.model");
const { convertToObjectIdMongodb } = require("../../utils");

const findCartById = async (cart_id) => {
  return await cart
    .findOne({ _id: convertToObjectIdMongodb(cart_id), cart_state: "active" })
    .lean();
};

module.exports = {
  findCartById,
};
