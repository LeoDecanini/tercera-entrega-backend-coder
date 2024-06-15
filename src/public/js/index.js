const socket = io();

socket.emit("message", "Hola servidor te estoy enviando un mensaje");

const productForm = document.getElementById("productForm");
const productsList = document.getElementById("card");

if (productForm) {
  console.log("productForm");
  productForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(productForm);
    const jsonObject = {};

    formData.forEach((value, key) => {
      if (key === "stock") {
        jsonObject[key] = parseInt(value);
      } else if (
        key === "thumbnails" ||
        key === "details" ||
        key === "description" ||
        key === "dues"
      ) {
        jsonObject[key] = value.split(",").map((item) => item.trim());
      } else if (value === "true") {
        jsonObject[key] = true;
      } else if (value === "false") {
        jsonObject[key] = false;
      } else {
        jsonObject[key] = value;
      }
    });

    const data = {
      title: jsonObject["title"],
      thumbnails: jsonObject["thumbnails"],
      status: jsonObject["status"],
      brand: jsonObject["brand"],
      rating: jsonObject["rating"],
      color: jsonObject["color"],
      details: jsonObject["details"],
      description: jsonObject["description"],
      stock: jsonObject["stock"],
      freeshipping: jsonObject["freeshipping"],
      dues: jsonObject["dues"],
      price: jsonObject["price"],
      code: jsonObject["code"],
    };

    fetch("http://localhost:8082/crud/api/products", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        socket.emit("product", data);
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  });
}

if (productsList) {
  console.log("productsList");

  socket.on("products", (data) => {
    productsList.innerHTML = "";

    data.forEach((product, index) => {
      const productCardHTML = `
          <div class="product-card">
              <a href="#">
                  <img class="product-image" src="/${product.thumbnails[0]}" alt="${product.title}" />
              </a>
              <div class="product-details">
                  <a href="#">
                      <h5 class="product-title">${product.title}</h5>
                  </a>
                  <p class="product-description">${product.description[0]}</p>
                  <p class="product-description">${product.stock}</p>
              </div>
              <button class="buy-btn">Comprar</button>
          </div>
      `;
      productsList.innerHTML += productCardHTML;

      const buyBtns = document.querySelectorAll(".buy-btn");
      const btn = buyBtns[index];
      btn.addEventListener("click", () => {
        data[index].stock = data[index].stock - 1;

        productsList.innerHTML = "";
        data.forEach((product) => {
          const updatedProductCardHTML = `
              <div class="product-card">
                  <a href="#">
                      <img class="product-image" src="/${product.thumbnails[0]}" alt="${product.title}" />
                  </a>
                  <div class="product-details">
                      <a href="#">
                          <h5 class="product-title">${product.title}</h5>
                      </a>
                      <p class="product-description">${product.description[0]}</p>
                      <p class="product-description">${product.stock}</p>
                  </div>
                  <button class="buy-btn">Comprar</button>
              </div>
          `;
          productsList.innerHTML += updatedProductCardHTML;
        });

        socket.emit("updateStock", data);
      });
    });
});
}
