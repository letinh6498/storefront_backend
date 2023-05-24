import client from '../database';

export type Product = {
  id?: number;
  name: string;
  description?: string;
  price: number;
};

export class ProductModel {
  async getAllProducts(): Promise<Product[] | undefined> {
    try {
      const conn = await client.connect();
      const query = 'SELECT * FROM products';
      const result = await conn.query(query);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to retrieve products. Error: ${error}`);
    }
  }

  async getProductById(id: string): Promise<Product | undefined> {
    try {
      const query = 'SELECT * FROM products WHERE id = $1';
      const conn = await client.connect();
      const result = await conn.query(query, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to retrieve product ${id}. Error: ${error}`);
    }
  }

  async createProduct(product: Product): Promise<Product | undefined> {
    try {
      const query =
        'INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *';
      const conn = await client.connect();
      const values = [product.name, product.description, product.price];
      const result = await conn.query(query, values);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create product. Error: ${error}`);
    }
  }

  async updateProduct(
    id: number,
    product: Product,
  ): Promise<Product | undefined> {
    try {
      const query =
        'UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *';
      const values = [product.name, product.description, product.price, id];
      const conn = await client.connect();
      const result = await conn.query(query, values);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to update product ${id}. Error: ${error}`);
    }
  }

  async deleteProduct(id: number): Promise<Product | undefined> {
    try {
      const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
      const conn = await client.connect();
      const result = await conn.query(query, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to delete product ${id}. Error: ${error}`);
    }
  }
}
