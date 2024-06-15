# Configuración

- **Puerto:** 8080
- **Rutas:** `/crud/api/products` y `/crud/api/carts`

## Configuración de la ruta "/api/products":

- **GET /api/products**: Obtiene una lista de todos los productos, con la opción de paginación, limit, category utilizando `"?page=1&limit=1&query=asd&sort=asc"`.
- **GET /api/products/:id**: Recupera el producto específico identificado por el ID proporcionado.
- **POST /api/products**: Crea un nuevo producto.
- **PUT /api/products/:id**: Actualiza un producto existente, excepto su ID.
- **DELETE /api/products/:id**: Elimina el producto específico identificado por el ID proporcionado.

## Configuración de la ruta "/api/carts":

- **GET /api/carts**: Obtiene una lista de todos los carritos, con la opción de paginación utilizando `"?page=1"`.
- **GET /api/carts/:userId**: Recupera el carrito específico del usuario identificado por el ID del usuario.
- **POST /api/carts**: Añade un producto al carrito.
- **Delete /api/carts**: Elimina un producto del carrito.
- **PUT /api/carts**: Edita la cantidad de un producto en el carrito.

## Rutas visuales:

- **Listado de productos:** `/`
- **Listado de productos realtime:** `/realtime`
- **Carrito:** `/cart`

## Rutas dashboard:
- **Crear producto:** `/create-product`
- **Eliminar producto:** `/delete-product`T