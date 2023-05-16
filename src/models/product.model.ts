import client from '../database';

export type Product = {
  id?: number;
  name: string;
  description?: string;
  price: number;
};

export class ProductModel {
  async getAllProduct(): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const query = 'SELECT * FROM products';
      const result = await conn.query(query);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Could not get products. Error: ${error}`);
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const query = 'SELECT * FROM products WHERE id = $1';
      const conn = await client.connect();
      const result = await conn.query(query, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not find product ${id}. Error: ${error}`);
    }
  }

  async createProduct(product: Product): Promise<Product> {
    try {
      const query =
        'INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *';
      const conn = await client.connect();
      const values = [product.name, product.description, product.price];

      const { rows } = await conn.query(query, values);
      conn.release();
      return rows[0];
    } catch (error) {
      throw new Error(
        `Could not add new product ${product.name}. Error: ${error}`,
      );
    }
  }

  async updateProduct(id: number, product: Product): Promise<Product> {
    try {
      const query =
        'UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *';
      const values = [product.name, product.description, product.price, id];
      const conn = await client.connect();
      const { rows } = await conn.query(query, values);
      conn.release();
      return rows[0];
    } catch (error) {
      throw new Error(
        `Could not alter product ${product.name}. Error: ${error}`,
      );
    }
  }

  async deleteProduct(id: number): Promise<Product> {
    try {
      const query = 'DELETE FROM products WHERE id = $1';
      const conn = await client.connect();
      const { rows } = await conn.query(query, [id]);
      conn.release();
      return rows[0];
    } catch (error) {
      throw new Error(`Could not delete product ${id}. Error: ${error}`);
    }
  }
}
