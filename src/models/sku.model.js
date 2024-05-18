const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Sku";
const COLLECTION_NAME = "Skus";

const SkuSchema = new Schema({
  sku_id: { type: String, required: true, unique: true },
  sku_tier_idx: { type: Array, default: [] }, //[1, 0], [1, 1]
  /*
    color: [red, blue, green] = [0, 1, 2]
    size: [S, M, L] = [0, 1, 2]

    => red + S = [0, 0]
    => red + M = [0, 1]
    => red + L = [0, 2]
    => blue + S = [1, 0]
    => blue + M = [1, 1]
    => blue + L = [1, 2]
    => green + S = [2, 0]
    => green + M = [2, 1]
    => green + L = [2, 2]
  */
  sku_default: { type: Boolean, default: false },
  sku_slug: { type: String, default: "" },
  sku_sort: { type: Number, default: 0 },
  sku_price: { type: String, required: true },
  sku_stock: { type: Number, default: 0 }, // array in of stock
  product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true }, //ref to spu product
  isDraft: { type: Boolean, default: true, index: true, select: false },
  isPublished: { type: Boolean, default: false, index: true, select: false },
  isDeleted: { type: Boolean, default: false, index: true, select: false },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, SkuSchema);