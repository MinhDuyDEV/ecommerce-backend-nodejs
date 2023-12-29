"use strict";

const { findCartById } = require("../models/repositories/cart.repository");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const {
  checkProductByServer,
} = require("../models/repositories/product.repository");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");
const order = require("../models/order.model");

class CheckoutService {
  /*
    {
      cart_id: ...,
      user_id: ...,
      shop_order_ids: [
        {
          shop_id: ...,
          shop_discounts: [
            {
              shop_id: ...,
              discount_id: ...,
              code_id: ...,
            }
          ],
          item_products: [
            {
              product_id: ...,
              product_quantity: ...,
              product_price: ...,
            }
          ],
        }
      ]
    }
  */
  static async checkoutReview({ cart_id, user_id, shop_order_ids = [] }) {
    const foundCart = await findCartById(cart_id);
    if (!foundCart) throw new BadRequestError("Cart not found");
    const checkout_order = {
        total_price: 0, // total price of all shop orders
        fre_ship: 0, // total fre ship of all shop orders
        total_discount: 0, // total discount of all shop orders
        total_checkout: 0, // total checkout of all shop orders
      },
      shop_order_ids_new = [];
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shop_id,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];
      const checkProductServer = await checkProductByServer(item_products);
      if (!checkProductServer[0])
        throw new BadRequestError("Product not found");
      const checkout_price = checkProductServer.reduce((total, product) => {
        return total + product.product_price * product.product_quantity;
      }, 0);
      // total price before handling
      checkout_order.total_price += checkout_price;
      const itemCheckout = {
        shop_id,
        shop_discounts,
        priceRaw: checkout_price, // price before handling discount
        price_apply_discount: checkout_price, // price after handling discount
        item_products: checkProductServer,
      };
      // if shop_discounts exists, check valid
      if (shop_discounts.length > 0) {
        // have one discount
        // get discount amount
        const { discount_amount = 0, total_price = 0 } =
          await getDiscountAmount({
            code_id: shop_discounts[0].code_id,
            user_id,
            shop_id,
            products: checkProductServer,
          });
        // total price after handling discount
        checkout_order.total_discount += discount_amount;
        // if discount amount > 0
        if (discount_amount > 0) {
          itemCheckout.price_apply_discount = checkout_price - discount_amount;
        }
      }
      checkout_order.total_checkout += itemCheckout.price_apply_discount;
      shop_order_ids_new.push(itemCheckout);
    }
    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  static async orderByUser({
    shop_order_ids,
    cart_id,
    user_id,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({
        cart_id,
        user_id,
        shop_order_ids,
      });
    // check one more product exits in inventory?
    // get new array product
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    console.log(`[1]::`, products);
    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { product_id, product_quantity } = products[i];
      const keyLock = await acquireLock(product_id, product_quantity, cart_id);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
      // check if have one product not exits in inventory
      if (acquireProduct.includes(false)) {
        throw new BadRequestError(
          "Some products have been updated. Please back to cart and checkout again"
        );
      }
    }
    const newOrder = await order.create({
      order_user_id: user_id,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });
    if (newOrder) {
      // remove product in cart
    }
    return newOrder;
  }

  /*
    Query Orders [Users]
  */
  static async getOrdersByUser() {}

  /*
    Query Orders using id [Users]
  */
  static async getOneOrderByUser() {}

  /*
    Cancel Order [Users]
  */
  static async cancelOrderByUser() {}

  /*
    Update Orders Status [Shop | Admin]
  */
  static async updateOrderStatusShop() {}
}

/*
  orders: [
    {
      orderId: ...,
      products: [
        {
          productId: ...,
          productName: ...,
          quantity: ...,
          price: ...,
        }
        {
          productId: ...,
          productName: ...,
          quantity: ...,
          price: ...,
        }
      ]
      totalAmount: ...,
    },
    {
      ...
    }
  ]
*/

module.exports = CheckoutService;
