import client from '../database';

export type Product = {
  id?: number;
  name: string;
  description?: string;
  price: number;
};

export class ProductModel {
  /**
   * Retrieves all products from the database.
   * @returns A Promise containing an array of all products.
   */
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

  /**
   * Retrieves a product by its ID from the database.
   * @param id The ID of the product to retrieve.
   * @returns A Promise containing the product information.
   */
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

  /**
   * Creates a new product in the database.
   * @param product The product data to be created.
   * @returns A Promise containing the created product information.
   */
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

  /**
   * Updates an existing product in the database.
   * @param id The ID of the product to update.
   * @param product The updated product data.
   * @returns A Promise containing the updated product information.
   */
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

  /**
   * Deletes a product from the database.
   * @param id The ID of the product to delete.
   * @returns A Promise containing the deleted product information.
   */
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
