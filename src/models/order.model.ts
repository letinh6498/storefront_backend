import client from '../database';
import _ from 'lodash';

export interface Order {
  id?: number;
  user_id: number;
  current_status: string;
  created_at?: Date;
}

export interface OrderDetails {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
}

export type OrderedProducts = {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  total_amount: number;
};
export class OrderModel {
  async createOrder(userId: number): Promise<Order | undefined> {
    try {
      const conn = await client.connect();
      console.log('userID:model:::', userId);
      const sql = `
        INSERT INTO orders (user_id, current_status, created_at)
        SELECT $1, 'active', NOW()
        WHERE NOT EXISTS (
          SELECT id FROM orders WHERE user_id = $1 AND current_status = 'active'
        )
        RETURNING *;
      `;
      const result = await conn.query(sql, [userId]);
      conn.release();

      if (result.rows.length === 0) {
        throw new Error('An active order already exists for this user.');
      }

      const resData = _.pick(result.rows[0], [
        'id',
        'user_id',
        'current_status',
        'created_at',
      ]);

      return resData as Order;
    } catch (err) {
      throw new Error(`Failed to create order: ${err}`);
    }
  }

  async updateStatus(userId: number): Promise<Order | undefined> {
    try {
      const conn = await client.connect();
      const checkActiveQuery =
        'SELECT id FROM orders WHERE user_id = $1 AND current_status = $2;';
      const checkActiveQueryRes = await conn.query(checkActiveQuery, [
        userId,
        'active',
      ]);

      if (!checkActiveQueryRes.rows[0]) {
        conn.release();
        throw new Error(`There are no active orders for user ${userId}`);
      }

      const orderId = checkActiveQueryRes.rows[0].id;
      const sql = `
        UPDATE orders 
        SET current_status = $1 
        WHERE id = $2 
        RETURNING *;
      `;
      const result = await conn.query(sql, ['complete', orderId]);
      conn.release();

      const resData = _.pick(result.rows[0], [
        'id',
        'user_id',
        'current_status',
        'created_at',
      ]);

      return resData as Order;
    } catch (err) {
      throw new Error(`Failed to update order status: ${err}`);
    }
  }

  async getActiveOrder(userId: number): Promise<Order | undefined> {
    try {
      const conn = await client.connect();
      const sql =
        'SELECT * FROM orders WHERE user_id = $1 AND current_status = $2';
      const result = await conn.query(sql, [userId, 'active']);
      conn.release();

      if (result.rows.length === 0) {
        throw new Error(`No active order found for user ${userId}`);
      }

      const resData = _.pick(result.rows[0], [
        'id',
        'user_id',
        'current_status',
        'created_at',
      ]);

      return resData as Order;
    } catch (err) {
      throw new Error(`Failed to retrieve active order: ${err}`);
    }
  }

  async getCompletedOrders(userId: number): Promise<Order[] | undefined> {
    try {
      const conn = await client.connect();
      const sql =
        'SELECT * FROM orders WHERE user_id = $1 AND current_status = $2';
      const result = await conn.query(sql, [userId, 'complete']);
      conn.release();

      const orderList: Order[] = result.rows.map((order) => ({
        id: order.id,
        user_id: order.user_id,
        current_status: order.current_status,
        created_at: order.created_at,
      }));

      return orderList;
    } catch (err) {
      throw new Error(`Failed to retrieve completed orders: ${err}`);
    }
  }

  async addProductToOrder(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<OrderDetails | undefined> {
    try {
      const conn = await client.connect();
      await conn.query('BEGIN');
      const orderQuery =
        "SELECT id FROM orders WHERE user_id = $1 AND current_status = 'active' FOR UPDATE;";
      const orderResult = await conn.query(orderQuery, [userId]);
      const orderId: number = orderResult.rows[0]?.id;

      if (!orderId) {
        await conn.query('ROLLBACK');
        conn.release();
        console.error(`There are no active orders for user ${userId}`);
        return undefined;
      }
      const checkProductQuery =
        'SELECT * FROM order_details WHERE order_id = $1 AND product_id = $2;';
      const checkProductResult = await conn.query(checkProductQuery, [
        orderId,
        productId,
      ]);

      if (checkProductResult.rows.length > 0) {
        const updateProductQuery =
          'UPDATE order_details SET quantity = $1 WHERE order_id = $2 AND product_id = $3 RETURNING *;';
        const updateResult = await conn.query(updateProductQuery, [
          quantity,
          orderId,
          productId,
        ]);
        await conn.query('COMMIT');
        conn.release();

        const resData = _.pick(updateResult.rows[0], [
          'id',
          'product_id',
          'quantity',
          'order_id',
        ]);
        return resData as OrderDetails;
      } else {
        const addProductQuery =
          'INSERT INTO order_details (product_id, quantity, order_id) VALUES ($1, $2, $3) RETURNING *;';
        const insertResult = await conn.query(addProductQuery, [
          productId,
          quantity,
          orderId,
        ]);

        await conn.query('COMMIT');
        conn.release();

        const resData = _.pick(insertResult.rows[0], [
          'id',
          'product_id',
          'quantity',
          'order_id',
        ]);
        return resData as OrderDetails;
      }
    } catch (err) {
      throw new Error(`Cannot add product ${productId} to order: ${err}`);
    }
  }

  async removeProductFromOrder(
    userId: number,
    productId: number,
  ): Promise<OrderDetails | undefined> {
    try {
      const conn = await client.connect();
      await conn.query('BEGIN');
      const orderQuery =
        "SELECT id FROM orders WHERE user_id = $1 AND current_status = 'active' FOR UPDATE;";
      const orderResult = await conn.query(orderQuery, [userId]);
      const orderId: number = orderResult.rows[0]?.id;

      if (!orderId) {
        await conn.query('ROLLBACK');
        conn.release();
        console.error(`There are no active orders for user ${userId}`);
        return undefined;
      }

      const deleteProductQuery =
        'DELETE FROM order_details WHERE order_id = $1 AND product_id = $2 RETURNING *;';
      const result = await conn.query(deleteProductQuery, [orderId, productId]);
      await conn.query('COMMIT');
      conn.release();
      const resData = _.pick(result.rows[0], [
        'id',
        'product_id',
        'quantity',
        'order_id',
      ]);

      return resData as OrderDetails;
    } catch (err) {
      throw new Error(
        `Could not delete product ${productId} from order: ${err}`,
      );
    }
  }
}
