import supertest from 'supertest';
import client from '../../database';
import { genToken } from '../../helpers/jwt';
import { Product } from '../../models/product.model';
import { OrderModel } from '../../models/order.model';
import { genHashPassword } from '../../helpers/genHashPassword';
const base_url = 'http://localhost:3000';
const orderUrl = '/orders/';

const request = supertest(base_url);

const orderInstance = new OrderModel();

fdescribe('Order model', () => {
  it('has an create method', () => {
    expect(orderInstance.createOrder).toBeDefined();
  });

  it('has get active order', () => {
    expect(orderInstance.getActiveOrder).toBeDefined();
  });

  it('has change status order', () => {
    expect(orderInstance.updateStatus).toBeDefined();
  });

  it('has get complete orders', () => {
    expect(orderInstance.getCompletedOrders).toBeDefined();
  });

  it('has an add product to order method', () => {
    expect(orderInstance.addProductToOrder).toBeDefined();
  });

  it('has an remove product from order method', () => {
    expect(orderInstance.removeProductFromOrder).toBeDefined();
  });
});

fdescribe('Orders Handler', () => {
  let token: string;
  beforeAll(async () => {
    await prepareDB();
    await prepareUsers();
    await prepareProducts(products);
    token = `Bearer ${await genToken('user test')}`;
  });

  fit('should add new order', async () => {
    const response = await request
      .post(orderUrl)
      .set('Authorization', token)
      .send({ userId: 1 });

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(1);
    expect(response.body.user_id).toEqual(1);
    expect(response.body.current_status).toEqual('active');
  });

  fit('should get active order of user', async () => {
    const response = await request
      .get(`/orders/users/${1}/active`)
      .set('Authorization', token);
    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(1);
    expect(response.body.user_id).toEqual(1);
    expect(response.body.current_status).toEqual('active');
  });

  // it('should change status of user order', async () => {
  //   const response = await request
  //     .put(`/orders/users/${1}/`)
  //     .set('Authorization', token);
  //   expect(response.status).toBe(200);
  //   expect(response.body.id).toEqual(1);
  //   expect(response.body.user_id).toEqual(1);
  //   expect(response.body.current_status).toEqual('complete');
  // });

  fit('should add product to order details', async () => {
    const response = await request
      .post('/orders/users/1/products')
      .set('Authorization', token)
      .send({ product_id: 1, quantity: 2 });

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(1);
    expect(response.body.order_id).toEqual(1);
    expect(response.body.product_id).toEqual(1);
    expect(response.body.quantity).toEqual(2);
  });

  fit('should remove product to order details', async () => {
    const response = await request
      .delete('/orders/users/1/products/1/')
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(1);
    expect(response.body.order_id).toEqual(1);
    expect(response.body.product_id).toEqual(1);
    expect(response.body.quantity).toEqual(2);
  });

  // it('should get complete order', async () => {
  //   const response = await request
  //     .get(`/orders/users/${1}/completed`)
  //     .set('Authorization', token);

  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual([
  //     jasmine.objectContaining({
  //       id: 1,
  //       user_id: 1,
  //       current_status: 'complete',
  //     }),
  //   ]);
  // });

  afterAll(async () => {
    await prepareDB();
  });
});
const prepareDB = async () => {
  try {
    const conn = await client.connect();
    await conn.query('DELETE FROM users;');
    await conn.query('ALTER SEQUENCE users_id_seq RESTART WITH 1;');
    await conn.query('DELETE FROM products;');
    await conn.query('ALTER SEQUENCE products_id_seq RESTART WITH 1;');
    await conn.query('DELETE FROM orders;');
    await conn.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1;');
    await conn.query('DELETE FROM order_details;');
    await conn.query('ALTER SEQUENCE order_details_id_seq RESTART WITH 1;');
    conn.release();
  } catch (error) {
    console.log(error);
  }
};

const prepareUsers = async () => {
  const conn = await client.connect();
  const sql =
    'INSERT INTO users (id, username, email, password, first_name, last_name) VALUES ($1, $2, $3, $4, $5, $6);';
  await conn.query(sql, [
    1,
    'username',
    'test@gmail.com',
    await genHashPassword('123'),
    'first name',
    'last name',
  ]);
  conn.release();
};
const products = [
  {
    name: 'Product 1',
    description: 'description 1',
    price: 100000,
  },
  {
    name: 'Product 2',
    description: 'description 2',
    price: 200000,
  },
  {
    name: 'Product 3',
    description: 'description 3',
    price: 300000,
  },
];
async function prepareProducts(products: Product[]) {
  const conn = await client.connect();
  const sql =
    'INSERT INTO products (name, description, price) VALUES ($1, $2, $3);';
  for (const product of products) {
    await conn.query(sql, [product.name, product.description, product.price]);
  }
  conn.release();
}
