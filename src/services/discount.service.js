"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discount = require("../models/discount.model");
const {
  findDiscount,
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
  checkDiscountExists,
} = require("../models/repositories/discount.repository");
const {
  findAllProducts,
} = require("../models/repositories/product.repository");
const { convertToObjectIdMongodb } = require("../utils");

/**
 * * Discount Service
 * @description CRUD Service for Discount
 * 1. Generator discount code [Shop | Admin]
 * 2. Get discount amount [User]
 * 3. Get all discount code [User | Shop]
 * 4. Verify discount code [User]
 * 5. Delete discount code [Shop | Admin]
 * 6. Cancel discount code [User]
 */

class DiscountService {
  static async createDiscountCode(body) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shop_id,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      users_used,
      max_uses,
      uses_count,
      max_uses_per_user,
    } = body;
    if (new Date() < new Date(start_date) || new Date(end_date) < new Date()) {
      throw new BadRequestError("Discount code has expired");
    }
    if (new Date(start_date) > new Date(end_date)) {
      throw new BadRequestError("Start date cannot be greater than end date");
    }
    const foundDiscount = await findDiscount({ code, shop_id });
    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount code already exists");
    }
    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_amount: min_order_value || 0,
      discount_max_amount: max_value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_shop_id: convertToObjectIdMongodb(shop_id),
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });
    return newDiscount;
  }

  static async updateDiscountCode(discount_code, body) {
    return await discount.findByIdAndUpdate(discount_code, body, {
      new: true,
    });
  }

  static async getAllDiscountCodesWithProduct({ code, shop_id, limit, page }) {
    const foundDiscount = await findDiscount({ code, shop_id });
    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount code not found");
    }
    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === "all") {
      products = await findAllProducts({
        filter: { product_shop: shop_id, isPublished: true },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    if (discount_applies_to === "specific") {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    return products;
  }

  static async getAllDiscountCodesByShop({ limit, page, shop_id }) {
    const discounts = await findAllDiscountCodesSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shop_id: convertToObjectIdMongodb(shop_id),
        discount_is_active: true,
      },
      select: ["discount_name", "discount_code"],
      model: discount,
    });
    return discounts;
  }

  static async getDiscountAmount({ code_id, user_id, shop_id, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: code_id,
        discount_shop_id: convertToObjectIdMongodb(shop_id),
      },
    });
    if (!foundDiscount) {
      throw new NotFoundError(`Discount code ${code_id} not found`);
    }
    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_amount,
      discount_users_used,
      discount_type,
      discount_value,
      discount_max_uses_per_user,
      discount_product_ids,
    } = foundDiscount;
    if (!discount_is_active) {
      throw new NotFoundError("Discount code has expired");
    }
    if (!discount_max_uses) {
      throw new NotFoundError("Discount code has been used up");
    }
    if (
      new Date() < new Date(discount_start_date) ||
      new Date(discount_end_date) < new Date(discount_end_date)
    ) {
      throw new NotFoundError("Discount code has expired");
    }
    const listProduct = products.filter((element) =>
      discount_product_ids.includes(element.product_id)
    );
    let total_order = 0;
    if (discount_min_order_amount > 0) {
      total_order = listProduct.reduce((acc, cur) => {
        return acc + cur.product_price * cur.product_quantity;
      }, 0);
    }
    if (total_order < discount_min_order_amount) {
      throw new BadRequestError(
        `Minimum order amount is ${discount_min_order_amount}`
      );
    }
    if (discount_max_uses_per_user > 0) {
      const userDiscount = discount_users_used.find(
        (user) => user._id === user_id
      );
      if (userDiscount) {
        throw new BadRequestError("You have used up this discount code");
      }
    }
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : total_order * (discount_value / 100);
    return {
      total_order,
      discount_amount: amount,
      total_price: total_order - amount,
    };
  }

  static async deleteDiscount({ shop_id, code_id }) {
    const deleted = await discount.findByIdAndDelete({
      discount_id: code_id,
      discount_shop: convertToObjectIdMongodb(shop_id),
    });
    return deleted;
  }

  static async cancelDiscountCode({ code_id, shop_id, user_id }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: code_id,
        discount_shop_id: convertToObjectIdMongodb(shop_id),
      },
    });
    if (!foundDiscount) {
      throw new NotFoundError(`Discount code ${code_id} not found`);
    }
    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: user_id,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });
    return result;
  }
}

module.exports = DiscountService;
