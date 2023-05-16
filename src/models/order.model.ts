import client from '../database';

export type Order = {
  id?: number;
  user_id: number;
  total: number;
  created_at?: Date;
};

export class ProductModel {
  async getAllOrder(): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const query = 'SELECT * FROM orders';
      const result = await conn.query(query);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Could not get orders. Error: ${error}`);
    }
  }

  async getOrderById(id: string): Promise<Order> {
    try {
      const query = 'SELECT * FROM orders WHERE id = $1';
      const conn = await client.connect();
      const result = await conn.query(query, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not find Order ${id}. Error: ${error}`);
    }
  }

  async createOrder(order: Order): Promise<Order> {
    try {
      const query =
        'INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING *';
      const conn = await client.connect();
      const values = [order.user_id, order.total];

      const { rows } = await conn.query(query, values);
      conn.release();
      return rows[0];
    } catch (error) {
      throw new Error(
        `Could not add new Order ${order.user_id}. Error: ${error}`,
      );
    }
  }

  async updateOrder(order: Order): Promise<Order> {
    try {
      const query =
        'UPDATE orders SET user_id = $1, total = $2 WHERE id = $3 RETURNING *';
      const values = [order.user_id, order.total, order.id ?? 1];
      const conn = await client.connect();
      const { rows } = await conn.query(query, values);
      conn.release();
      return rows[0];
    } catch (error) {
      throw new Error(`Could not alter Order ${order.id}. Error: ${error}`);
    }
  }

  async deleteOrder(id: number): Promise<Order> {
    try {
      const query = 'DELETE FROM orders WHERE id = $1';
      const conn = await client.connect();
      const result = await conn.query(query, [id]);
      const rows = result.rows[0];
      conn.release();
      return rows;
    } catch (error) {
      throw new Error(`Could not delete Order ${id}. Error: ${error}`);
    }
  }
}
