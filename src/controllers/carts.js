import CartModel from "../model/cart-shema.js";

let cartId = null;

if (cartId === null) {
  const id = generateCartId();
  cartId = id;
}

function generateCartId() {
  return Math.random().toString(36).substr(2, 9);
}

class CartController {
  constructor() {}

  getAllCarts = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 20;
      const skip = (page - 1) * limit;

      const totalItems = await CartModel.countDocuments();
      const carts = await CartModel.find().skip(skip).limit(limit);

      const meta = {
        totalItems: totalItems,
        itemCount: carts.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      };

      res.status(200).json({ data: carts, meta: meta });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  getUserCart = async (req, res) => {
    try {
      if (!cartId) {
        return res
          .status(404)
          .json({ message: "El carrito del usuario no fue encontrado" });
      }
      const cart = await CartModel.findOne({ _id: cartId });
      if (!cart) {
        return res
          .status(404)
          .json({ message: "El carrito del usuario no fue encontrado" });
      }
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
      let cart = await CartModel.findOne({ _id: cartId });
      if (!cart) {
        const newCart = new CartModel({
          _id: cartId,
          items: [{ product: productId, quantity: quantity }],
        });
        await newCart.save();
      } else {
        const existingItemIndex = cart.items.findIndex(
          (item) => item.product === productId
        );
        if (existingItemIndex !== -1) {
          cart.items[existingItemIndex].quantity += quantity;
        } else {
          cart.items.push({ product: productId, quantity: quantity });
        }
        await cart.save();
      }

      res.status(201).json({ message: "Producto agregado al carrito" });
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      res.status(500).json({ message: "Error al agregar al carrito" });
    }
  };

  removeFromCart = async (req, res) => {
    const { productId } = req.body;
    try {
      const cart = await CartModel.findOne({ _id: cartId });
      if (!cart) {
        return res
          .status(404)
          .json({ message: "El carrito del usuario no fue encontrado" });
      }

      const updatedItems = cart.items.filter(
        (item) => item.product !== productId
      );
      cart.items = updatedItems;
      await cart.save();

      res.status(200).json({ message: "Producto eliminado del carrito" });
    } catch (error) {
      console.error("Error al eliminar del carrito:", error);
      res.status(500).json({ message: "Error al eliminar del carrito" });
    }
  };

  editCartItemQuantity = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
      console.log(cartId);
      const cart = await CartModel.findOne({ _id: cartId });
      if (!cart) {
        return res
          .status(404)
          .json({ message: "El carrito del usuario no fue encontrado" });
      }

      const itemToUpdate = cart.items.find(
        (item) => item.product === productId
      );
      if (!itemToUpdate) {
        return res
          .status(404)
          .json({ message: "El producto no está en el carrito" });
      }

      itemToUpdate.quantity = quantity;
      await cart.save();

      res
        .status(200)
        .json({ message: "Cantidad de producto en el carrito actualizada" });
    } catch (error) {
      console.error(
        "Error al editar la cantidad del producto en el carrito:",
        error
      );
      res.status(500).json({
        message: "Error al editar la cantidad del producto en el carrito",
      });
    }
  };
}

export default new CartController();
