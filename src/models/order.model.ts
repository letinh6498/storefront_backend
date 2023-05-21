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
  /**
   * Create a new order for a user.
   * @param userId The ID of the user.
   * @returns A Promise containing the created order information.
   */
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

  /**
   * Update the status of an order for a user.
   * @param userId The ID of the user.
   * @returns A Promise containing the updated order information.
   */
  async updateStatus(
    userId: number,
    status: string,
  ): Promise<Order | undefined> {
    try {
      const conn = await client.connect();
      const checkActiveQuery =
        'SELECT id FROM orders WHERE user_id = $1 AND current_status = $2;';
      const checkActiveQueryRes = await conn.query(checkActiveQuery, [
        userId,
        status,
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

  /**
   * Get the active order for a user.
   * @param userId The ID of the user.
   * @returns A Promise containing the active order information.
   */
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

  /**
   * Get the completed orders for a user.
   * @param userId The ID of the user.
   * @returns A Promise containing an array of completed orders.
   */
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

  /**
   * Add a product to the active order of a user.
   * @param userId The ID of the user.
   * @param productId The ID of the product.
   * @param quantityInput The quantity of the product to add.
   * @returns A Promise containing the details of the updated order.
   */
  async addProductToOrder(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<OrderDetails | undefined> {
    try {
      const conn = await client.connect();

      // Start a transaction
      await conn.query('BEGIN');

      // Check if there is an active order for the user
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

      // Check if the product already exists in order_details table
      const checkProductQuery =
        'SELECT * FROM order_details WHERE order_id = $1 AND product_id = $2;';
      const checkProductResult = await conn.query(checkProductQuery, [
        orderId,
        productId,
      ]);

      if (checkProductResult.rows.length > 0) {
        // Product already exists, update the quantity
        const updateProductQuery =
          'UPDATE order_details SET quantity = $1 WHERE order_id = $2 AND product_id = $3 RETURNING *;';
        const updateResult = await conn.query(updateProductQuery, [
          quantity,
          orderId,
          productId,
        ]);

        // Commit the transaction
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
        // Product does not exist, insert a new entry
        const addProductQuery =
          'INSERT INTO order_details (product_id, quantity, order_id) VALUES ($1, $2, $3) RETURNING *;';
        const insertResult = await conn.query(addProductQuery, [
          productId,
          quantity,
          orderId,
        ]);

        // Commit the transaction
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

  /**
   * Remove a product from the active order of a user.
   * @param userId The ID of the user.
   * @param productId The ID of the product.
   * @returns A Promise containing the details of the updated order.
   */
  async removeProductFromOrder(
    userId: number,
    productId: number,
  ): Promise<OrderDetails | undefined> {
    try {
      const conn = await client.connect();

      // Start a transaction
      await conn.query('BEGIN');

      // Check if there is an active order for the user
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

      // Delete the product from the order_details table
      const deleteProductQuery =
        'DELETE FROM order_details WHERE order_id = $1 AND product_id = $2 RETURNING *;';
      const result = await conn.query(deleteProductQuery, [orderId, productId]);

      // Commit the transaction
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
  /**
   * Get all products that a user has ordered along with quantity and total amount.
   * @param userId The ID of the user.
   * @returns A Promise containing an array of products with quantity and total amount.
   */
  async getOrderedProducts(userId: number): Promise<OrderedProducts[]> {
    try {
      const conn = await client.connect();
      const sql = `
        SELECT p.id AS product_id, p.name AS product_name, od.quantity, p.price, (od.quantity * p.price) AS total_amount
        FROM orders o
        JOIN order_details od ON o.id = od.order_id
        JOIN products p ON p.id = od.product_id
        WHERE o.user_id = $1;
      `;
      const result = await conn.query(sql, [userId]);
      conn.release();

      const productList: OrderedProducts[] = result.rows.map((row) => ({
        product_id: row.product_id,
        product_name: row.product_name,
        quantity: row.quantity,
        price: row.price,
        total_amount: row.total_amount,
      }));

      return productList;
    } catch (err) {
      throw new Error(`Failed to retrieve ordered products: ${err}`);
    }
  }

  /**
   * Get the total amount for all orders of a user.
   * @param userId The ID of the user.
   * @returns A Promise containing the total amount of all orders.
   */
  async getTotalAmountForAllOrders(userId: number): Promise<number> {
    try {
      const conn = await client.connect();
      const sql = `
        SELECT SUM(od.quantity * p.price) AS total_amount
        FROM orders o
        JOIN order_details od ON o.id = od.order_id
        JOIN products p ON p.id = od.product_id
        WHERE o.user_id = $1;
      `;
      const result = await conn.query(sql, [userId]);
      conn.release();

      const totalAmount: number = result.rows[0]?.total_amount || 0;

      return totalAmount;
    } catch (err) {
      throw new Error(`Failed to retrieve total amount for all orders: ${err}`);
    }
  }
}
