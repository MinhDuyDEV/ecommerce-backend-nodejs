"use strict";

const {
  product,
  clothing,
  electronics,
  furniture,
} = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
const {
  findAllDraftForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
} = require("../models/repositories/product.repository");

class ProductFactory {
  static productRegistry = {}; // key-class

  // register
  static registerProductCategory(category, classRef) {
    ProductFactory.productRegistry[category] = classRef;
  }

  // create
  static async createProduct(category, payload) {
    const productClass = ProductFactory.productRegistry[category];
    if (!productClass) throw new BadRequestError("Invalid product category");
    return new productClass(payload).createProduct();
  }

  // put
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }

  // query
  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftForShop({ query, limit, skip });
  }
  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }
}

// define base product class
class Product {
  constructor({
    product_name,
    product_thumbnail,
    product_price,
    product_description,
    product_category,
    product_quantity,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumbnail = product_thumbnail;
    this.product_price = product_price;
    this.product_description = product_description;
    this.product_category = product_category;
    this.product_quantity = product_quantity;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }
  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }
}

// define sub-class for different product categories (clothing, electronics, furniture, etc.)
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing)
      throw new BadRequestError("Clothing could not be created");
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Product could not be created");
    return newProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronics = await electronics.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronics)
      throw new BadRequestError("Electronics could not be created");
    const newProduct = await super.createProduct(newElectronics._id);
    if (!newProduct) throw new BadRequestError("Product could not be created");
    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture)
      throw new BadRequestError("Furniture could not be created");
    const newProduct = await super.createProduct(newFurniture._id);
    if (!product) throw new BadRequestError("Product could not be created");
    return newProduct;
  }
}

// register product categories
ProductFactory.registerProductCategory("Clothing", Clothing);
ProductFactory.registerProductCategory("Electronics", Electronics);
ProductFactory.registerProductCategory("Furniture", Furniture);

module.exports = ProductFactory;
