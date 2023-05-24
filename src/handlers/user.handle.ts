import express, { Request, Response } from 'express';
import { User, UserModel } from '../models/user.model';
import { verifyAuthToken } from '../middleware/verifyAuthToken';

const userInstance = new UserModel();

const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await userInstance.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ err: (err as Error).message });
  }
};

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await userInstance.getUserById(+id);
    if (!user) {
      res.status(404).json({ err: 'User not found.' });
    } else {
      res.json(user);
    }
  } catch (err) {
    res.status(500).json({ err: (err as Error).message });
  }
};

const createUser = async (req: Request, res: Response) => {
  const { username, email, password, first_name, last_name } = req.body;
  const user = { username, email, password, first_name, last_name };
  try {
    const newUser = await userInstance.createUser(user);
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ err: (err as Error).message });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await userInstance.deleteUser(+id);
    if (!user) {
      res.status(404).json({ err: 'User not found.' });
    } else {
      res.json(user);
    }
  } catch (err) {
    res.status(500).json({ err: (err as Error).message });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, email, password, first_name, last_name } = req.body;
  const user = { username, email, password, first_name, last_name };
  try {
    const updatedUser = await userInstance.updateUser(+id, user);
    if (!updatedUser) {
      res.status(404).json({ err: 'User not found.' });
    } else {
      res.json(updatedUser);
    }
  } catch (err) {
    res.status(500).json({ err: (err as Error).message });
  }
};

const authenticate = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const result = await userInstance.authenticate(
      username as string,
      password as string,
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ err: (err as Error).message });
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const result = await userInstance.login(
      username as string,
      password as string,
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ err: (err as Error).message });
  }
};

const users_routes = (app: express.Application) => {
  app.get('/users', verifyAuthToken, getAllUser);
  app.post('/users', createUser);
  app.get('/users/:id', verifyAuthToken, getUserById);
  app.put('/users/:id', verifyAuthToken, updateUser);
  app.delete('/users/:id', verifyAuthToken, deleteUser);
  app.post('/authenticate', authenticate);
  app.post('/login', login);
};

export default users_routes;
