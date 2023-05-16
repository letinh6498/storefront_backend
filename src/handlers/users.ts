import express, { Request, Response } from 'express';
import { User, UserService } from '../models/users';

const users = new UserService();

const create = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = {
    username,
    password,
  };
  const userresult = await users.create(user as User);
  if (!userresult) {
    res.status(409).send('Conflict');
  }
  res.json(userresult);
};

const authenticate = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const result = await users.authenticate(
    username as string,
    password as string,
  );
  res.json(result);
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const result = await users.login(username as string, password as string);
  res.json(result);
};

const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).send('Bad Request');
  }
  const result = await users.refreshToken(refreshToken as string);
  res.json(result);
};

const users_routes_backup = (app: express.Application) => {
  app.post('/users', create);
  app.post('/authenticate', authenticate);
  app.post('/login', login);
  app.post('/refreshtoken', refreshToken);
};

export default users_routes_backup;
