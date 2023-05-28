import express, { Request, Response } from 'express';
import { OrderModel } from '../models/order.model';
import { verifyAuthToken } from '../middleware/verifyAuthToken';

const orderInstance = new OrderModel();

const createOrder = async (req: Request, res: Response) => {
  const { userId } = req.body;
  console.log('userId', userId);
  try {
    const newOrder = await orderInstance.createOrder(+userId);
    res.json(newOrder);
  } catch (err: unknown) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const updateStatusOrder = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const updatedOrder = await orderInstance.updateStatus(+userId);
    res.json(updatedOrder);
  } catch (err: unknown) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const getActiveOrder = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const activeOrder = await orderInstance.getActiveOrder(+userId);
    res.json(activeOrder);
  } catch (err: unknown) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const getCompeleteOrder = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const completedOrders = await orderInstance.getCompletedOrders(+userId);
    res.json(completedOrders);
  } catch (err: unknown) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const addProductToOrder = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { product_id, quantity } = req.body;
  try {
    const updatedOrder = await orderInstance.addProductToOrder(
      +userId,
      product_id,
      quantity,
    );
    res.json(updatedOrder);
  } catch (err: unknown) {
    res.status(400).json({ error: (err as Error).message });
  }
};
const removeProductFromOrder = async (req: Request, res: Response) => {
  const { userId, productId } = req.params;
  try {
    const updatedOrder = await orderInstance.removeProductFromOrder(
      +userId,
      +productId,
    );
    res.json(updatedOrder);
  } catch (err: unknown) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const order_routes = (app: express.Application) => {
  app.post('/orders', verifyAuthToken, createOrder);
  app.put('/orders/users/:userId', verifyAuthToken, updateStatusOrder);
  app.get('/orders/users/:userId/active', verifyAuthToken, getActiveOrder);
  app.get(
    '/orders/users/:userId/completed',
    verifyAuthToken,
    getCompeleteOrder,
  );
  app.post(
    '/orders/users/:userId/products',
    verifyAuthToken,
    addProductToOrder,
  );
  app.delete(
    '/orders/users/:userId/products/:productId',
    verifyAuthToken,
    removeProductFromOrder,
  );
};

export default order_routes;
