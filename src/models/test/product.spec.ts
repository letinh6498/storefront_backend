import supertest from 'supertest';
import client from '../../database';
import { ProductModel } from '../product.model';
const base_url = 'http://localhost:3000';
const productUrl = '/products/';

const request = supertest(base_url);
const productInstance = new ProductModel();

describe('Product model', () => {
  it('has an create method', () => {
    expect(productInstance.createProduct).toBeDefined();
  });

  it('has a get product by id method', () => {
    expect(productInstance.getProductById).toBeDefined();
  });

  it('has a get all products method', () => {
    expect(productInstance.getAllProducts).toBeDefined();
  });

  it('has an update method', () => {
    expect(productInstance.updateProduct).toBeDefined();
  });

  it('has an delete method', () => {
    expect(productInstance.deleteProduct).toBeDefined();
  });
});

describe('test handle', () => {
  const data = {
    name: 'Product test',
    description: 'description',
    price: 100000,
  };
  const dataPut = {
    name: 'Product updated',
    description: 'description update',
    price: 200000,
  };

  let temporaryProductId: number;
  let token: string;

  beforeAll(async () => {
    await prepareDB();
    const res = await request.post('/users').send({
      username: 'usertest',
      email: 'abc@gmail.com',
      password: '123',
      first_name: 'Tinh',
      last_name: 'Le',
    });

    const response = await request
      .post('/login')
      .send({ username: res.body.username, password: '123' });
    token = `bearer ${response.body.accessToken}`;
  });

  beforeEach(async () => {
    const response = await request
      .post(productUrl)
      .set('Authorization', token)
      .send(data);
    expect(response.statusCode).toBe(200);
    temporaryProductId = response.body.id;
  });

  it('should get all products', async () => {
    const response = await request.get(productUrl).set('Authorization', token);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get a product by id', async () => {
    const response = await request
      .get(`${productUrl}${temporaryProductId}`)
      .set('Authorization', token);
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(temporaryProductId);
    expect(response.body.name).toBe(data.name);
    expect(response.body.description).toBe(data.description);
    expect(parseFloat(response.body.price)).toBe(data.price);
  });

  it('should update a product', async () => {
    const response = await request
      .put(`${productUrl}${temporaryProductId}`)
      .set('Authorization', token)
      .send(dataPut);
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(temporaryProductId);
    expect(response.body.name).toBe(dataPut.name);
    expect(response.body.description).toBe(dataPut.description);
    expect(parseFloat(response.body.price)).toBe(dataPut.price);
  });

  it('should delete a product', async () => {
    const response = await request
      .delete(`${productUrl}${temporaryProductId}`)
      .set('Authorization', token);
    expect(response.statusCode).toBe(200);
  });

  afterAll(async () => {
    await prepareDB();
  });
});

async function prepareDB() {
  try {
    const conn = await client.connect();
    await conn.query('DELETE FROM products');
    await conn.query('DELETE FROM users');
    await conn.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await conn.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
    conn.release();
  } catch (error) {
    console.log(error);
  }
}
