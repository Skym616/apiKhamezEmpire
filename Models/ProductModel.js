const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  name: { type: String, require: true },
  price: { type: Number, require: true },
  weight: { type: Number, require: true },
  quantity: { type: Number, require: true },
  size: { type: String, require: true },
  matter: { type: String, require: true },
  image: { type: String, require: true },
  category: { type: String, require: true },
  available: { type: Boolean, require: true },
  quantitySell: { type: Number, require: false },
  description: { type: String, require: true },
});

module.exports = mongoose.model("Product", ProductSchema);
