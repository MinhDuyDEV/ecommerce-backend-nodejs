"use strict";

const {
  convertToObjectIdMongodb,
  getUnSelectData,
  getSelectData,
} = require("../../utils");
const discount = require("../discount.model");

const findDiscount = async ({ code, shop_id }) => {
  return await discount
    .findOne({
      discount_code: code,
      discount_shop_id: convertToObjectIdMongodb(shop_id),
    })
    .lean();
};

const checkDiscountExists = async ({ model, filter }) => {
  return await model.findOne(filter).lean();
};

const findAllDiscountCodesUnSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unselect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unselect))
    .lean();
  return documents;
};

const findAllDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return documents;
};

module.exports = {
  findDiscount,
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
  checkDiscountExists,
};
