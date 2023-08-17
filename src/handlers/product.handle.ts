import express, { Request, Response } from 'express';
import { Product, ProductModel } from '../models/product.model';
import { verifyAuthToken } from '../middleware/verifyAuthToken';

const productInstance = new ProductModel();

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productInstance.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await productInstance.getProductById(id as string);
    if (!product) {
      res.status(404).json({ error: 'Product not found.' });
    } else {
      res.json(product);
    }
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const createProduct = async (req: Request, res: Response) => {
  const { name, description, price } = req.body;
  const product = { name, description, price };
  try {
    const newProduct = await productInstance.createProduct(product);
    res.json(newProduct);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await productInstance.deleteProduct(+id);
    if (!product) {
      res.status(404).json({ error: 'Product not found.' });
    } else {
      res.json(product);
    }
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  const product = { name, description, price };
  try {
    const updatedProduct = await productInstance.updateProduct(+id, product);
    if (!updatedProduct) {
      res.status(404).json({ error: 'Product not found.' });
    } else {
      res.json(updatedProduct);
    }
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const product_routes = (app: express.Application) => {
  app.get('/products', getAllProducts);
  app.post('/products', verifyAuthToken, createProduct);
  app.get('/products/:id', verifyAuthToken, getProductById);
  app.put('/products/:id', verifyAuthToken, updateProduct);
  app.delete('/products/:id', verifyAuthToken, deleteProduct);
};

export default product_routes;
