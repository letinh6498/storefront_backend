import express, { Request, Response } from 'express';
import { User, UserModel } from '../models/user.model';
import { verifyAuthToken } from '../middleware/verifyAuthToken';

const UserInstance = new UserModel();

const getAllUser = async (req: Request, res: Response) => {
  const products = await UserInstance.getAllUser();
  res.json(products);
};

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await UserInstance.getUserById(id as string);
  res.json(user);
};

const createUser = async (req: Request, res: Response) => {
  const { username, email, password, first_name, last_name } = req.body;
  const user = { username, email, password, first_name, last_name };
  const newUser = await UserInstance.createUser(user);
  res.json(newUser);
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await UserInstance.deleteUser(+id);
  res.json(user);
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, email, password, first_name, last_name } = req.body;
  const user = { username, email, password, first_name, last_name };

  const newUser = await UserInstance.updateUser(+id, user);
  res.json(newUser);
};

const users_routes = (app: express.Application) => {
  app.get('/users', getAllUser);
  app.post('/users', createUser);
  app.get('/users/:id', getUserById);
  app.put('/users/:id', updateUser);
  app.delete('/users/:id', deleteUser);
};

export default users_routes;
