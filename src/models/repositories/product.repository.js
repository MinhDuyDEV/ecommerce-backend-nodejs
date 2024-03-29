"use strict";

const { product } = require("../../models/product.model");
const { Types } = require("mongoose");
const {
  getSelectData,
  getUnSelectData,
  convertToObjectIdMongodb,
} = require("../../utils/index");
const { NotFoundError } = require("../../core/error.response");

// get all products for shop
const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const searchProducts = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product
    .find(
      {
        isDraft: false,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return results;
};

const searchProductsInShop = async ({ keySearch, product_shop }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product
    .find(
      {
        product_shop: convertToObjectIdMongodb(product_shop),
        isDraft: false,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return results;
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) throw new BadRequestError("Invalid product");
  foundShop.isDraft = false;
  foundShop.isPublished = true;
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) throw new BadRequestError("Invalid product");
  foundShop.isDraft = true;
  foundShop.isPublished = false;
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return products;
};

const findProduct = async ({ product_id, unSelect }) => {
  return await product
    .findOne({ _id: product_id })
    .select(getUnSelectData(unSelect))
    .lean();
};

const checkProductExist = async ({ product_id }) => {
  const foundProduct = await product.exists({
    _id: convertToObjectIdMongodb(product_id),
  });
  if (!foundProduct) throw new NotFoundError("Product not found");
};

const getProductById = async (product_id) => {
  return await product
    .findOne({ _id: convertToObjectIdMongodb(product_id) })
    .lean();
};

const updateProductById = async ({
  product_id,
  body_update,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(product_id, body_update, {
    new: isNew,
  });
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById(product.product_id);
      if (foundProduct) {
        return {
          product_price: foundProduct.product_price,
          product_quantity: product.product_quantity,
          product_id: product.product_id,
        };
      }
    })
  );
};

module.exports = {
  checkProductByServer,
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProducts,
  searchProductsInShop,
  findAllProducts,
  findProduct,
  updateProductById,
  getProductById,
  checkProductExist,
};
