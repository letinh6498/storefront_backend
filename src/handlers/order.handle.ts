import express, { Request, Response } from 'express';
import { Order, OrderModel, OrderDetails } from '../models/order.model';
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
  const { status } = req.body;
  console.table({ userId, status });
  try {
    const updatedOrder = await orderInstance.updateStatus(+userId, status);
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
  console.table({ userId, productId });
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

const getOrderedProducts = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const orderedProducts = await orderInstance.getOrderedProducts(+userId);
    res.json(orderedProducts);
  } catch (err: unknown) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const getTotalAmountForAllOrders = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const totalAmountForAllOrders =
      await orderInstance.getTotalAmountForAllOrders(+userId);
    res.json(totalAmountForAllOrders);
  } catch (err: unknown) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const order_routes = (app: express.Application) => {
  app.post('/orders', verifyAuthToken, createOrder);
  app.put('/orders/:userId', verifyAuthToken, updateStatusOrder);
  app.get('/orders/:userId/active', verifyAuthToken, getActiveOrder);
  app.get('/orders/:userId/completed', verifyAuthToken, getCompeleteOrder);
  app.get(
    '/orders/:userId/orderedProducts',
    verifyAuthToken,
    getOrderedProducts,
  );
  app.get(
    '/orders/:userId/totalAmountForAllOrders',
    verifyAuthToken,
    getTotalAmountForAllOrders,
  );
  app.post('/orders/:userId/products', verifyAuthToken, addProductToOrder);
  app.delete(
    '/orders/:userId/products/:productId',
    verifyAuthToken,
    removeProductFromOrder,
  );
};

export default order_routes;
