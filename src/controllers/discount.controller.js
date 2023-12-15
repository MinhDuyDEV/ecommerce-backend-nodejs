"use strict";

const DiscountService = require("../services/discount.service");
const { SuccessResponse } = require("../core/success.response");

class DiscountController {
  /**
   * @description Create discount code
   * @param { Discount } discount
   * @returns { JSON }
   */
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Discount Code created successfully",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shop_id: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @description Get all discount code
   * @param { String } shop_id
   * @returns { JSON }
   */
  getAllDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Discount Code fetched successfully",
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shop_id: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @description Get discount amount
   * @param { String } discount_code
   * @param { Array } products
   * @returns { JSON }
   */
  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "Discount amount fetched successfully",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };

  /**
   * @description Get all discount code with product
   * @param { String } shop_id
   * @returns { JSON }
   */
  getAllDiscountCodesWithProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Discount Code fetched successfully",
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
