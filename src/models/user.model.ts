import client from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import _ from 'lodash';
dotenv.config();

export type User = {
  id?: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};
export type UserReturn = {
  id?: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
};

export interface DecodedToken {
  userId: string;
}

const PEPPER = process.env.PEPPER;
const TOKEN_SECRET = process.env.TOKEN_SECRET as string;
const SALT_ROUNDS = 10;

export class UserModel {
  async createUser(user: User): Promise<UserReturn> {
    try {
      const query = `INSERT INTO users (username, email, password, first_name, last_name)
                        SELECT $1, $2, $3, $4, $5
                        WHERE NOT EXISTS (
                            SELECT username FROM users WHERE username = $6
                        ) RETURNING *`;
      const conn = await client.connect();
      const salt = bcrypt.genSaltSync(SALT_ROUNDS);
      const passwordHash = bcrypt.hashSync(user.password + PEPPER, salt);
      const values = [
        user.username,
        user.email,
        passwordHash,
        user.first_name,
        user.last_name,
        user.username,
      ];
      const { rows } = await conn.query(query, values);
      conn.release();
      const returnData = _.pick(rows[0], [
        'id',
        'email',
        'first_name',
        'last_name',
        'username',
      ]);
      return returnData as UserReturn;
    } catch (error) {
      throw new Error(
        `Failed to create user ${user.username}. Error: ${error}`,
      );
    }
  }

  async getAllUsers(): Promise<UserReturn[]> {
    try {
      const conn = await client.connect();
      const query = 'SELECT * FROM users';
      const { rows } = await conn.query(query);
      conn.release();
      const userList: UserReturn[] = rows.map((row) => ({
        id: row.id,
        email: row.email,
        username: row.username,
        first_name: row.first_name,
        last_name: row.last_name,
      }));
      return userList;
    } catch (error) {
      throw new Error(`Failed to retrieve users. Error: ${error}`);
    }
  }

  async getUserById(id: number): Promise<UserReturn> {
    try {
      const query = 'SELECT * FROM users WHERE id = $1';
      const conn = await client.connect();
      const { rows } = await conn.query(query, [id]);
      conn.release();
      const returnData: UserReturn = _.pick(rows[0], [
        'id',
        'email',
        'first_name',
        'last_name',
        'username',
      ]);
      return returnData;
    } catch (error) {
      throw new Error(`Failed to retrieve user ${id}. Error: ${error}`);
    }
  }

  async updateUser(id: number, user: User): Promise<UserReturn> {
    try {
      const query = `UPDATE users SET username = $1, 
                                      email = $2, 
                                      password = $3, 
                                      first_name = $4, 
                                      last_name = $5 
                                  WHERE id = $6 RETURNING *`;
      const salt = bcrypt.genSaltSync(SALT_ROUNDS);
      const passwordHash = bcrypt.hashSync(user.password + PEPPER, salt);
      const values = [
        user.username,
        user.email,
        passwordHash,
        user.first_name,
        user.last_name,
        id,
      ];
      const conn = await client.connect();
      const { rows } = await conn.query(query, values);
      conn.release();
      const returnData: UserReturn = _.pick(rows[0], [
        'id',
        'email',
        'first_name',
        'last_name',
        'username',
      ]);
      return returnData;
    } catch (error) {
      throw new Error(
        `Failed to update user ${user.username}. Error: ${error}`,
      );
    }
  }

  async deleteUser(id: number): Promise<UserReturn> {
    try {
      const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
      const conn = await client.connect();
      const { rows } = await conn.query(query, [id]);
      conn.release();
      const returnData: UserReturn = _.pick(rows[0], [
        'id',
        'email',
        'first_name',
        'last_name',
        'username',
      ]);
      return returnData;
    } catch (error) {
      throw new Error(`Failed to delete user ${id}. Error: ${error}`);
    }
  }

  async authenticate(
    username: string,
    password: string,
  ): Promise<UserReturn | null> {
    const conn = await client.connect();
    const sql = 'SELECT * FROM users WHERE username = $1';
    const result = await conn.query(sql, [username]);

    if (result.rows.length) {
      const user = result.rows[0];
      if (bcrypt.compareSync(password + PEPPER, user.password)) {
        return _.pick(user, [
          'id',
          'email',
          'first_name',
          'last_name',
          'username',
        ]);
      }
    }
    return null;
  }

  async login(username: string, password: string) {
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
      user.password,
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
  }
}
