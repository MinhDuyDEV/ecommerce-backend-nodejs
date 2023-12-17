"use strict";

const CartService = require("../services/cart.service");
const { SuccessResponse } = require("../core/success.response");

class CartController {
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Cart added successfully",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  updateCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Cart updated successfully",
      metadata: await CartService.updateCart(req.body),
    }).send(res);
  };

  deleteCartItem = async (req, res, next) => {
    new SuccessResponse({
      message: "Cart deleted successfully",
      metadata: await CartService.deleteUserCartItem(req.body),
    }).send(res);
  };

  getCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Cart get successfully",
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
