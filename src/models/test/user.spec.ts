import supertest from 'supertest';
import client from '../../database';
import { UserModel } from '../user.model';
const base_url = 'http://localhost:3000';
const usertUrl = '/users/';

const request = supertest(base_url);
const userInstance = new UserModel();

describe('User model', () => {
  it('has an create method', () => {
    expect(userInstance.createUser).toBeDefined();
  });

  it('has a get product by id method', () => {
    expect(userInstance.getUserById).toBeDefined();
  });

  it('has a get all products method', () => {
    expect(userInstance.getAllUsers).toBeDefined();
  });

  it('has an update method', () => {
    expect(userInstance.updateUser).toBeDefined();
  });

  it('has an delete method', () => {
    expect(userInstance.deleteUser).toBeDefined();
  });
  it('has login method', () => {
    expect(userInstance.login).toBeDefined();
  });
  it('has authenticate method', () => {
    expect(userInstance.authenticate).toBeDefined();
  });
});

async function prepareDB() {
  try {
    const conn = await client.connect();
    await conn.query('DELETE FROM products');
    await conn.query('DELETE FROM users');
    await conn.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await conn.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
    conn.release();
  } catch (error) {
    console.log(error);
  }
}
