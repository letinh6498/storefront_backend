## API Endpoints
#### Products
- GetAllProduct [token required] : `'/products' [GET]`
- AddNewProduct (args: name, description, price) [token required] : `'/products' [POST]`
- GetProductById (args: productid) [token required] : `'/products/:id' [GET]`
- GetAllProduct (args: productid,  name, description, price) [token required] : `'/products/:id' [PUT]`
- GetAllProduct (args: productid) [token required] : `'/products/:id' [DELETE]`

#### Users

- GetAllUser [token required] : `'/users' [GET]`
- AddNewUser (args: username,email,firstname, lastname, password) : `'/users' [POST]`
- GetUserById (args: userid) [token required] : `'/users/:id' [GET]`
- UpdateUser (args: userid, username,email,firstname, lastname, password) [token required] : `'/users/:id' [PUT]`
- DeleteUser (args: userid) [token required] : `'/users/:id' [DELETE]`
- Login (args: username, password) [token required] : `'/login' [POST]`
- Authenticate (args: username, password) [token required] : `'/authenticate' [POST]`


#### Orders
- AddNewOrder (args: userid) [token required] : `'/orders' [POST]`
- UpdateStatus (args: userid) [token required] : `'/orders/users/:userId' [POST]`
- GetCompeleteOrder (args: userid) [token required] : `'/orders/users/:userId/completed' [GET]`
- GetActiveOrder (args: userid) [token required] : `'/orders/users/:userId/active' [GET]`
- AddProductToOrder (args: userid, productid) [token required] : `'/orders/users/:userId/products' [POST]`
- RemoveProductFromOrder (args: userid, productid) [token required] : `'/orders/users/:userId/products/:productId' [DELETE]`


## Data Shapes

### Users

| Column       | Type                |
| ------------ | ------------------- |
| id           | SERIAL PRIMARY KEY  |
| username     | VARCHAR(255)        |
| first_name   | VARCHAR(255)        |
| last_name    | VARCHAR(255)        |
| email        | VARCHAR(255)        |
| password     | VARCHAR(255)        |

### Products

| Column       | Type                |
| ------------ | ------------------- |
| id           | SERIAL PRIMARY KEY  |
| name         | VARCHAR(255)        |
| description  | TEXT                |
| price        | INTEGER             |

### Orders

| Column           | Type                |
| ---------------- | ------------------- |
| id               | SERIAL PRIMARY KEY  |
| user_id          | INT                 |
| created_at       | TIMESTAMP           |
| current_status   | status ENUM         |

### Order_details

| Column        | Type                |
| ------------- | ------------------- |
| id            | SERIAL PRIMARY KEY  |
| order_id      | INT                 |
| product_id    | INT                 |
| quantity      | INT                 |
