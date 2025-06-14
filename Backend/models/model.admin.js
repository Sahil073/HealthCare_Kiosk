const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { collection: "admin" }); // 🔥 explicitly point to "admin" collection

module.exports = mongoose.model("Admin", adminSchema);
