import Product from "../model/product-schema.js";

class ProductController {
  async getAllProducts(request, response) {
    try {
      const page = parseInt(request.query.page) || 1;
      const limit = parseInt(request.query.limit) || 10;
      const query = request.query.query || "";
      const sort = request.query.sort || "";
      const skip = (page - 1) * limit;

      let filter = {};
      if (query) {
        filter = { category: query };
      }

      let sortOption = {};
      if (sort === "asc") {
        sortOption = { price: 1 };
      } else if (sort === "desc") {
        sortOption = { price: -1 };
      }

      const products = await Product.find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sortOption)
        .exec();

      const totalItems = await Product.countDocuments(filter).exec();
      const totalPages = Math.ceil(totalItems / limit);

      const meta = {
        totalItems: totalItems,
        itemCount: products.length,
        itemsPerPage: limit,
        totalPages: totalPages,
        currentPage: page,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
      };

      response.status(200).json({ data: products, meta: meta });
    } catch (error) {
      response.status(500).send(error);
    }
  }

  async getProduct(request, response) {
    try {
      const productId = request.params.id;
      const product = await Product.findById(productId).exec();

      if (!product) {
        return response.sendStatus(404);
      }

      response.status(200).json({ data: product });
    } catch (error) {
      response.status(500).send(error);
    }
  }

  async createProduct(request, response) {
    try {
      const newProduct = new Product(request.body);
      const savedProduct = await newProduct.save();

      response
        .status(201)
        .json({ message: "Producto creado", data: savedProduct });
    } catch (error) {
      response.status(500).send(error);
    }
  }

  async createMasiveProducts(request, response) {
    try {
      const productsArray = request.body;
      if (!Array.isArray(productsArray) || productsArray.length === 0) {
        return response
          .status(400)
          .json({
            message:
              "El cuerpo de la solicitud debe ser un array de productos y no puede estar vacío.",
          });
      }

      const createdProducts = await Product.insertMany(productsArray);

      response
        .status(201)
        .json({ message: "Productos creados", data: createdProducts });
    } catch (error) {
      response.status(500).send(error);
    }
  }

  async updateProduct(request, response) {
    try {
      const productId = request.params.id;
      const updatedProduct = request.body;

      const result = await Product.findByIdAndUpdate(
        productId,
        updatedProduct,
        { new: true }
      ).exec();

      if (!result) {
        return response.sendStatus(404);
      }

      response
        .status(200)
        .json({ message: "Producto actualizado", data: result });
    } catch (error) {
      response.status(500).send(error);
    }
  }

  async deleteProduct(request, response) {
    try {
      const productId = request.params.id;

      const result = await Product.findByIdAndDelete(productId).exec();

      if (!result) {
        return response.sendStatus(404);
      }

      response.status(200).json({ message: "Producto eliminado" });
    } catch (error) {
      response.status(500).send(error);
    }
  }
}

export default new ProductController();
