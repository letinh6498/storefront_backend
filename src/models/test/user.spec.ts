import { User, UserModel } from '../../models/user.model';
import client from '../../database';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import _ from 'lodash';

dotenv.config();
const { PEPPER, SALT_ROUNDS } = process.env;

const store = new UserModel();
const user: User = {
  username: 'user',
  first_name: 'first_name',
  last_name: 'last_name',
  email: 'abc@gmail.com',
  password: 'password',
};

describe('User model', () => {
  it('has an index method', () => {
    expect(store.getAllUsers).toBeDefined();
  });

  it('has a show method', () => {
    expect(store.getUserById).toBeDefined();
  });

  it('has a create method', () => {
    expect(store.createUser).toBeDefined();
  });

  it('has an authenticate method', () => {
    expect(store.authenticate).toBeDefined();
  });
});

describe('User model method', () => {
  beforeAll(async () => {
    const conn = await client.connect();

    const hashedPassword = bcrypt.hashSync(
      user.password + PEPPER,
      parseInt(SALT_ROUNDS as unknown as string),
    );
    const sql =
      'INSERT INTO users (username, email, first_name, last_name, password) VALUES ($1, $2, $3, $4, $5);';

    await conn.query(sql, [
      user.username,
      user.email,
      user.first_name,
      user.last_name,
      hashedPassword,
    ]);

    conn.release();
  });

  afterAll(async () => {
    const conn = await client.connect();
    await conn.query('DELETE FROM users;');
    await conn.query('ALTER SEQUENCE users_id_seq RESTART WITH 1;');
    conn.release();
  });
});
