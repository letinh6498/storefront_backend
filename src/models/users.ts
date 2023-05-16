import client from './../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

dotenv.config();

export type User = {
  id?: number;
  username: string;
  password: string;
};

const PEPPER = process.env.PEPPER;
const TOKEN_SECRET = process.env.TOKEN_SECRET as string;
const SALTROUNDS = 10;

export class UserService {
  async create(u: User): Promise<User> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = `INSERT INTO users (username, password_digest)
      SELECT $1, $2
      WHERE NOT EXISTS (
          SELECT username FROM users WHERE username = ($3)
      ) RETURNING *`;
      const salt = bcrypt.genSaltSync(SALTROUNDS);
      console.log(u.username, u.password);

      const hash = bcrypt.hashSync(u.password + PEPPER, salt);

      const result = await conn.query(sql, [u.username, hash, u.username]);
      const user = result.rows[0];
      conn.release();

      return user;
    } catch (err) {
      throw new Error(`unable create user: ${err}`);
    }
  }
  async authenticate(username: string, password: string): Promise<User | null> {
    const conn = await client.connect();
    const sql = 'SELECT * FROM users WHERE username=($1)';

    const result = await conn.query(sql, [username]);

    if (result.rows.length) {
      const user = result.rows[0];

      if (bcrypt.compareSync(password + PEPPER, user.password_digest)) {
        return user;
      }
    }

    return null;
  }
  login = async (username: string, password: string) => {
    const conn = await client.connect();
    const result = await conn.query('SELECT * FROM users WHERE username = $1', [
      username,
    ]);
    conn.release();
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    const user = result.rows[0];
    const isPasswordCorrect = await bcrypt.compareSync(
      password + PEPPER,
      user.password_digest,
    );
    if (!isPasswordCorrect) {
      throw new Error('Incorrect password');
    }
    const accessToken = jwt.sign({ userId: user.id }, TOKEN_SECRET, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ userId: user.id }, TOKEN_SECRET, {
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  };

  logout = async (refreshToken: string) => {
    // Add the refresh token to a blacklist
  };

  refreshToken = async (oldRefreshToken: string) => {
    try {
      const decoded = jwt.verify(oldRefreshToken, TOKEN_SECRET) as any;
      const userId = decoded.userId;
      const newAccessToken = jwt.sign({ userId }, TOKEN_SECRET, {
        expiresIn: '15m',
      });
      const newRefreshToken = jwt.sign({ userId }, TOKEN_SECRET, {
        expiresIn: '7d',
      });
      return { newAccessToken, newRefreshToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  };
}
