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
  searchProducts,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repository");
const { removeUndefinedData, updateNestedObjectParser } = require("../utils");
const {
  insertInventory,
} = require("../models/repositories/inventory.repository");

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

  // update
  static async updateProduct(category, product_id, payload) {
    const productClass = ProductFactory.productRegistry[category];
    if (!productClass) throw new BadRequestError("Invalid product category");
    return new productClass(payload).updateProduct(product_id);
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

  static async getListSearchProduct({ keySearch }) {
    return await searchProducts({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumbnail"],
    });
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ["__v"] });
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
    const newProduct = await product.create({ ...this, _id: product_id });
    if (newProduct) {
      await insertInventory({
        product_id: newProduct._id,
        shop_id: this.product_shop,
        quantity: this.product_quantity,
      });
    }
    return newProduct;
  }
  async updateProduct(product_id, body_update) {
    return await updateProductById({ product_id, body_update, model: product });
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

  async updateProduct(product_id) {
    const objectParams = removeUndefinedData(this);
    if (objectParams.product_attributes) {
      await updateProductById({
        product_id,
        body_update: updateNestedObjectParser(objectParams),
        model: clothing,
      });
    }
    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
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

  async updateProduct(product_id) {
    const objectParams = removeUndefinedData(this);
    if (objectParams.product_attributes) {
      await updateProductById({
        product_id,
        body_update: updateNestedObjectParser(objectParams),
        model: electronics,
      });
    }
    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
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

  async updateProduct(product_id) {
    const objectParams = removeUndefinedData(this);
    if (objectParams.product_attributes) {
      await updateProductById({
        product_id,
        body_update: updateNestedObjectParser(objectParams),
        model: furniture,
      });
    }
    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

// register product categories
ProductFactory.registerProductCategory("Clothing", Clothing);
ProductFactory.registerProductCategory("Electronics", Electronics);
ProductFactory.registerProductCategory("Furniture", Furniture);

module.exports = ProductFactory;
