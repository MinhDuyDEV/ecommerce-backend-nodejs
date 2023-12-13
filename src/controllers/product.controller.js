"use strict";

const ProductService = require("../services/product.service");
const { SuccessResponse } = require("../core/success.response");
const {
  publishProductByShop,
} = require("../models/repositories/product.repository");
const reasonPhrases = require("../utils/reasonPhrases");

class ProductController {
  /**
   * @description Create product
   * @param {Product} product
   * @returns { JSON }
   */
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Product created successfully",
      metadata: await ProductService.createProduct(req.body.product_category, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @description Publish product by shop
   * @param { String } product_id
   * @param { String } product_shop
   * @return { JSON }
   */
  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Product published successfully",
      metadata: await ProductService.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @description Unpublish product by shop
   * @param { String } product_id
   * @param { String } product_shop
   * @return { JSON }
   */
  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Product unpublished successfully",
      metadata: await ProductService.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @description Get all draft products for shop
   * @param { Number } limit
   * @param { Number } skip
   * @returns { JSON }
   */
  getAllDraftsShop = async (req, res, next) => {
    new SuccessResponse({
      message: "All draft products for shop",
      metadata: await ProductService.findAllDraftForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @description Get all published products for shop
   * @param { Number } limit
   * @param { Number } skip
   * @returns { JSON }
   */
  findAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "All published products for shop",
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @description Search products
   * @param { String } keySearch
   * @returns { JSON }
   */
  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Search products",
      metadata: await ProductService.getListSearchProduct(req.params),
    }).send(res);
  };
}

module.exports = new ProductController();
