import client from '../database';

export type OrderItem = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
};

export class OrderItemModel {
  async getAllOrderItem(): Promise<OrderItem[]> {
    try {
      const conn = await client.connect();
      const query = 'SELECT * FROM order_item';
      const result = await conn.query(query);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Could not get order_item. Error: ${error}`);
    }
  }

  async getOrderById(id: string): Promise<OrderItem> {
    try {
      const query = 'SELECT * FROM order_item WHERE id = $1';
      const conn = await client.connect();
      const result = await conn.query(query, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not find order_item ${id}. Error: ${error}`);
    }
  }

  async createOrderItem(order_item: OrderItem): Promise<OrderItem> {
    try {
      const query =
        'INSERT INTO order_item (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *';
      const conn = await client.connect();
      const values = [
        order_item.order_id,
        order_item.product_id,
        order_item.quantity,
      ];

      const { rows } = await conn.query(query, values);
      conn.release();
      return rows[0];
    } catch (error) {
      throw new Error(
        `Could not add new order_item ${order_item.order_id}. Error: ${error}`,
      );
    }
  }

  async updateOrderItem(order_item: OrderItem): Promise<OrderItem> {
    try {
      const query =
        'UPDATE order_item SET order_id = $1, product_id = $2, quantity = $3 WHERE id = $4 RETURNING *';
      const values = [
        order_item.order_id,
        order_item.product_id,
        order_item.quantity,
        order_item.id,
      ];
      const conn = await client.connect();
      const { rows } = await conn.query(query, values);
      conn.release();
      return rows[0];
    } catch (error) {
      throw new Error(
        `Could not alter order_item ${order_item.id}. Error: ${error}`,
      );
    }
  }

  async deleteOrderItem(id: number): Promise<OrderItem> {
    try {
      const query = 'DELETE FROM order_item WHERE id = $1';
      const conn = await client.connect();
      const result = await conn.query(query, [id]);
      const rows = result.rows[0];
      conn.release();
      return rows;
    } catch (error) {
      throw new Error(`Could not delete order_item ${id}. Error: ${error}`);
    }
  }
}
