import express from 'express';
import bodyParser from 'body-parser';
import product_routes from './handlers/product.handle';
import users_routes from './handlers/user.handle';
import order_routes from './handlers/order.handle';
import dotenv from 'dotenv';
dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

product_routes(app);
users_routes(app);
order_routes(app);

app.listen(PORT, function () {
  console.log(`App listening on PORT:::${PORT}`);
});
