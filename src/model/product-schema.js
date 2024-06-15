import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const ProductSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  thumbnails: { type: [String], default: [] },
  status: { type: Boolean, required: true },
  brand: { type: String, required: true },
  rating: { type: String },
  color: { type: String, required: true },
  details: { type: [String], required: true },
  description: { type: [String], required: true },
  stock: { type: Number, required: true },
  freeshipping: { type: Boolean, required: true },
  dues: { type: [Number], required: true },
  price: { type: Number, required: true },
  code: { type: String, required: true },
});

const Product = models.Product || model("Product", ProductSchema);

export default Product;
