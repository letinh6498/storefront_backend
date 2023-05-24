import request from 'request';
import client from '../../database';

const base_url = 'http://localhost:3000';
const loginAdmin = { user: 'user1', password: '123' };
let token: string;
const productUrl = '/products/';

describe('Admin product', () => {
  const data = {
    name: 'Product 1',
    description: 'cái gì gì đây 1',
    price: 10.99,
  };
  const dataPut = {
    name: 'Product 2',
    description: 'cái gì gì đây 2',
    price: 10.99,
  };

  let productId: number;

  beforeAll(async () => {
    await new Promise((resolve) => {
      request.post(
        `${base_url}/login`,
        { json: loginAdmin },
        (error, response, body) => {
          if (!error && response.statusCode === 200) {
            token = `bearer ${body.accessToken}`;
            resolve(token);
          } else {
            console.log(error);
            resolve(error);
          }
        },
      );
    });

    await prepareDB();
  });

  beforeEach(async () => {
    await prepareDB();
  });

  it('should add new product', async () => {
    await request.post(
      {
        url: `${base_url}${productUrl}`,
        headers: { Authorization: token },
        json: data,
      },
      (error, response, body) => {
        expect(response.statusCode).toBe(200);
        productId = body.id;
      },
    );
  });

  it('should get all products', async () => {
    await request.get(
      {
        url: `${base_url}${productUrl}`,
        headers: { Authorization: token },
        json: true,
      },
      (error, response, body) => {
        expect(response.statusCode).toBe(200);
      },
    );
  });

  it('should get product by id', async () => {
    await request.get(
      {
        url: `${base_url}${productUrl}${productId}`,
        headers: { Authorization: token },
        json: true,
      },
      (error, response, body) => {
        expect(response.statusCode).toBe(200);
        expect(body.id).toBe(productId);
      },
    );
  });

  it('should update product', async () => {
    await request.put(
      {
        url: `${base_url}${productUrl}${productId}`,
        headers: { Authorization: token },
        json: dataPut,
      },
      (error, response, body) => {
        expect(response.statusCode).toBe(200);
      },
    );
  });

  it('should delete product', async () => {
    await request.delete(
      {
        url: `${base_url}${productUrl}${productId}`,
        headers: { Authorization: token },
        json: true,
      },
      (error, response, body) => {
        expect(response.statusCode).toBe(200);
      },
    );
  });
});

async function prepareDB() {
  try {
    const query = 'DELETE FROM products';
    const conn = await client.connect();
    const result = await conn.query(query);
    conn.release();
  } catch (error) {
    console.log(error);
  }
}
