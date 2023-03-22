const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const cartItemSchema = Schema({
  name: {
    type: String,
    required: [true, "Nama cart harus diisi"],
    minlength: [5, "Panjang minimal nama cart adalah 5 karakter"],
  },
  qty: {
    type: Number,
    required: [true, "Qty harus diisi"],
    min: [1, "Minimal qty adalah 1"],
  },
  price: {
    type: Number,
    default: 0,
  },
  image_url: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
});

module.exports = model("CartItem", cartItemSchema);
