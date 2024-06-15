import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  _id: String,
  items: [{
    product: String,
    quantity: Number
  }]
});

const CartModel = mongoose.model('Cart', cartSchema);

export default CartModel;