import client from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

dotenv.config();

export type User = {
  id?: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export interface DecodedToken {
  userId: string;
}

const PEPPER = process.env.PEPPER;
const TOKEN_SECRET = process.env.TOKEN_SECRET as string;
const SALT_ROUNDS = 10;

export class UserModel {
  /**
   * Creates a new user in the database.
   * @param user The user data to be created.
   * @returns A Promise containing the created user information.
   */
  async createUser(user: User): Promise<User> {
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
      return rows[0];
    } catch (error) {
      throw new Error(
        `Failed to create user ${user.username}. Error: ${error}`,
      );
    }
  }

  /**
   * Retrieves all users from the database.
   * @returns A Promise containing an array of all users.
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const conn = await client.connect();
      const query = 'SELECT * FROM users';
      const result = await conn.query(query);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to retrieve users. Error: ${error}`);
    }
  }

  /**
   * Retrieves a user by their ID from the database.
   * @param id The ID of the user to retrieve.
   * @returns A Promise containing the user information.
   */
  async getUserById(id: number): Promise<User> {
    try {
      const query = 'SELECT * FROM users WHERE id = $1';
      const conn = await client.connect();
      const result = await conn.query(query, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to retrieve user ${id}. Error: ${error}`);
    }
  }

  /**
   * Updates an existing user in the database.
   * @param id The ID of the user to update.
   * @param user The updated user data.
   * @returns A Promise containing the updated user information.
   */
  async updateUser(id: number, user: User): Promise<User> {
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
      return rows[0];
    } catch (error) {
      throw new Error(
        `Failed to update user ${user.username}. Error: ${error}`,
      );
    }
  }

  /**
   * Deletes a user from the database.
   * @param id The ID of the user to delete.
   * @returns A Promise containing the deleted user information.
   */
  async deleteUser(id: number): Promise<User> {
    try {
      const query = 'DELETE FROM users WHERE id = $1';
      const conn = await client.connect();
      const result = await conn.query(query, [id]);
      const rows = result.rows[0];
      conn.release();
      return rows;
    } catch (error) {
      throw new Error(`Failed to delete user ${id}. Error: ${error}`);
    }
  }

  /**
   * Authenticates a user based on the provided username and password.
   * @param username The username of the user.
   * @param password The password of the user.
   * @returns A Promise containing the authenticated user information or null if authentication fails.
   */
  async authenticate(username: string, password: string): Promise<User | null> {
    const conn = await client.connect();
    const sql = 'SELECT * FROM users WHERE username = $1';
    const result = await conn.query(sql, [username]);

    if (result.rows.length) {
      const user = result.rows[0];
      if (bcrypt.compareSync(password + PEPPER, user.password)) {
        return user;
      }
    }
    return null;
  }

  /**
   * Logs in a user and generates access and refresh tokens.
   * @param username The username of the user.
   * @param password The password of the user.
   * @returns A Promise containing the access and refresh tokens.
   */
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

  /**
   * Refreshes the access and refresh tokens using the old refresh token.
   * @param oldRefreshToken The old refresh token.
   * @returns A Promise containing the new access and refresh tokens.
   * @throws Error if the old refresh token is invalid.
   */
  refreshToken = async (oldRefreshToken: string) => {
    try {
      const decoded = jwt.verify(oldRefreshToken, TOKEN_SECRET) as DecodedToken;
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
