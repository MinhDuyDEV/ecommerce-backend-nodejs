"use strict";

const { NotFoundError } = require("../core/error.response");
const cart = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repository");

class CartService {
  /// START REPO CART ///
  static async createUserCart({ user_id, product }) {
    const query = { cart_user_id: user_id, cart_state: "active" },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = {
        upsert: true,
        new: true,
      };
    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ user_id, product }) {
    const { product_id, product_quantity } = product;
    const query = {
        cart_user_id: user_id,
        "cart_products.product_id": product_id,
        cart_state: "active",
      },
      updateSet = {
        $inc: {
          "cart_products.$.product_quantity": product_quantity,
        },
      },
      options = {
        upsert: true,
        new: true,
      };
    return await cart.findOneAndUpdate(query, updateSet, options);
  }
  /// END REPO CART ///

  // {
  //   "user_id": 1111,
  //   "product": {
  //       "product_id": "657ac36c670cf14550275c6b",
  //       "shop_id": "65539fc92500bf661e4aafda",
  //       "product_quantity": 4,
  //       "name": "",
  //       "product_price": 111
  //   }
  // }
  static async addToCart({ user_id, product = {} }) {
    const userCart = await cart.findOne({ cart_user_id: user_id });
    if (!userCart) {
      return await CartService.createUserCart({ user_id, product });
    }
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }
    return await CartService.updateUserCartQuantity({ user_id, product });
  }

  // update cart
  /*
    shop_order_ids: [
      {
        shop_id: "60f9d4e8e0b6b5a9d8b4a2b0",
        item_product: [
          {
            product_id: "60f9d4e8e0b6b5a9d8b4a2b1",
            product_price: 100,
            product_quantity: 1,
            old_quantity: 1,
          },
        ],
      },
    ]
  */
  static async updateCart({ user_id, shop_order_ids }) {
    const { product_id, product_quantity, old_quantity } =
      shop_order_ids[0]?.item_product[0];
    const foundProduct = await getProductById(product_id);
    if (!foundProduct) throw new NotFoundError("Product not found");
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shop_id) {
      throw new NotFoundError("Product not found");
    }
    if (product_quantity === 0 || product_quantity < 0) {
      return await CartService.deleteUserCartItem({ user_id, product_id });
    }
    return await CartService.updateUserCartQuantity({
      user_id,
      product: {
        product_id,
        product_quantity: product_quantity - old_quantity,
      },
    });
  }

  static async deleteUserCartItem({ user_id, product_id }) {
    const query = { cart_user_id: user_id, cart_state: "active" },
      updateSet = {
        $pull: {
          cart_products: {
            product_id,
          },
        },
      };
    const deleteCart = await cart.updateOne(query, updateSet);
    return deleteCart;
  }

  static async getListUserCart({ user_id }) {
    return await cart
      .findOne({
        cart_user_id: user_id,
      })
      .lean();
  }
}

module.exports = CartService;
