import express from "express";
import mongoose from "mongoose";
import router from "./routes/index.js";
import { engine } from "express-handlebars";
import __dirname from "./utils.js";
import * as path from "path";
import Product from "./model/product-schema.js";
import { Server } from "socket.io";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", path.resolve(__dirname + "/views"));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("view options", { layout: "main" });
app.use("/", express.static(__dirname + "/public"));

const PORT = 8080;
const db =
  "mongodb+srv://leodede04:SYZ8HuLNTzstzwpu@cluster0.dnb3kpq.mongodb.net/coderback?retryWrites=true&w=majority";

mongoose
  .connect(db)
  .then(() => console.log("Base de datos conectada"))
  .catch((e) => console.error(`Base de datos no conectada, error: ${e}`));

app.use("/crud", router);

app.get("/", async (req, res) => {
  try {
    const products = await Product.find().lean();

    res.render("home", {
      title: "Listado de productos",
      products: products,
    });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

app.get("/realtime", async (req, res) => {
  try {
    const products = await Product.find().lean();
    /* console.log(products); */

    res.render("realtime", {
      title: "Listado de productos en tiempo real",
      products: products,
    });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

app.get("/create-product", async (req, res) => {
  try {
    const products = await Product.find().lean();
    /* console.log(products); */

    res.render("create-product", {
      title: "Crear productos",
      products: products,
    });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

app.get("/delete-product", async (req, res) => {
  try {
    const products = await Product.find().lean();
    /* console.log(products); */

    res.render("delete-product", {
      title: "Eliminar productos",
      products: products,
    });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log("nuevo cliente conectado");

  socket.on("product", async (data) => {
    const products = await Product.find().lean();

    console.log("products", products);

    socketServer.emit("products", products);
  });

  socket.on("updateStock", async (updatedProducts) => {
    try {
      for (const updatedProduct of updatedProducts) {
        await Product.findByIdAndUpdate(updatedProduct._id, {
          stock: updatedProduct.stock,
        });
      }

      const products = await Product.find().lean();

      socketServer.emit("products", products);
    } catch (error) {
      console.error("Error al actualizar el stock:", error);
    }
  });
});
