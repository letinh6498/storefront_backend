import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET as string;
export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    if (!token)
      return res
        .status(401)
        .send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, TOKEN_SECRET, (err: any, decoded: any) => {
      if (err)
        return res
          .status(500)
          .send({ auth: false, message: 'Failed to authenticate token.' });
      //req.userId = decoded.id;
      next();
    });
  } catch (error) {
    res.status(500).send({
      auth: false,
      message: 'An error occurred while authenticating the token.',
    });
  }
};
