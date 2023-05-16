import express, { Request, Response } from 'express';
import { Product, ProductModel } from '../models/product.model';
import { verifyAuthToken } from '../middleware/verifyAuthToken';

const productInstance = new ProductModel();

const getAllProduct = async (req: Request, res: Response) => {
  const products = await productInstance.getAllProduct();
  res.json(products);
};

const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log('ID:::', id);
  const product = await productInstance.getProductById(id as string);
  res.json(product);
};

const createProduct = async (req: Request, res: Response) => {
  const { name, description, price } = req.body;
  const product = { name, description, price };
  const newProduct = await productInstance.createProduct(product);
  res.json(newProduct);
};

const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productInstance.deleteProduct(+id);
  res.json(product);
};

const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  const product = { name, description, price };

  const newProduct = await productInstance.updateProduct(+id, product);
  res.json(newProduct);
};

const product_routes = (app: express.Application) => {
  app.get('/products', getAllProduct);
  app.post('/products', createProduct);
  app.get('/products/:id', getProductById);
  app.put('/products/:id', updateProduct);
  app.delete('/products/:id', deleteProduct);
};

export default product_routes;
