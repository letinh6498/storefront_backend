import supertest from 'supertest';
import client from '../../database';
import _ from 'lodash';
import { Product, ProductModel } from '../../models/product.model';
import { genToken } from '../../helpers/jwt';
const base_url = 'http://localhost:3000';
const productUrl = '/products/';

const request = supertest(base_url);
const productInstance = new ProductModel();

const products: Product[] = [
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
  {
    name: 'Product 4',
    description: 'description 4',
    price: 400000,
  },
];

const productsWithId = _.each(
  products,
  (product, index = 0) => (product.id = index + 1),
);

const productPut = {
  name: 'Product update',
  description: 'description update',
  price: 222,
};

const productPost = {
  name: 'Product update',
  description: 'description update',
  price: 111,
};

let productId: number;

describe('Product model', () => {
  it('has an create method', () => {
    expect(productInstance.createProduct).toBeDefined();
  });

  it('has get product by id method', () => {
    expect(productInstance.getProductById).toBeDefined();
  });

  it('has get all products method', () => {
    expect(productInstance.getAllProducts).toBeDefined();
  });

  it('has an update method', () => {
    expect(productInstance.updateProduct).toBeDefined();
  });

  it('has an delete method', () => {
    expect(productInstance.deleteProduct).toBeDefined();
  });
});

fdescribe('product handle', () => {
  let token: string;
  beforeAll(async () => {
    await prepareDB();
    await prepareProducts(products);
    token = `bearer ${await genToken('user')}`;
  });

  fit('should get all products', async () => {
    const response = await request.get(productUrl).set('Authorization', token);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(productsWithId);
  });

  fit('should get a product by id', async () => {
    const response = await request
      .get(`${productUrl}${1}`)
      .set('Authorization', token);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: 'Product 1',
      description: 'description 1',
      price: 100000,
    });
  });

  fit('should add new product', async () => {
    const response = await request
      .post(productUrl)
      .set('Authorization', token)
      .send(productPost);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: 5,
      name: 'Product update',
      description: 'description update',
      price: 111,
    });
    productId = response.body.id;
  });

  fit('should update a product', async () => {
    const response = await request
      .put(`${productUrl}${productId}`)
      .set('Authorization', token)
      .send(productPut);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: productId,
      name: 'Product update',
      description: 'description update',
      price: 222,
    });
  });

  fit('should delete a product', async () => {
    const response = await request
      .delete(`${productUrl}${productId}`)
      .set('Authorization', token);
    const products = await productInstance.getAllProducts();
    expect(products).not.toContain(response);
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toEqual(productId);
  });

  afterAll(async () => {
    await prepareDB();
  });
});

async function prepareDB() {
  try {
    const conn = await client.connect();
    await conn.query('DELETE FROM products');
    await conn.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
    conn.release();
  } catch (error) {
    console.log(error);
  }
}

async function prepareProducts(products: Product[]) {
  const conn = await client.connect();
  const sql =
    'INSERT INTO products (name, description, price) VALUES ($1, $2, $3);';
  for (const product of products) {
    await conn.query(sql, [product.name, product.description, product.price]);
  }
  conn.release();
}
