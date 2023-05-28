import supertest from 'supertest';
import client from '../../database';
import { verifyAuthToken } from '../../helpers/jwt';
import { genHashPassword } from '../../helpers/genHashPassword';
const base_url = 'http://localhost:3000';

const request = supertest(base_url);

fdescribe('Auth ', () => {
  beforeAll(async () => {
    await prepareDB();
    await prepareUsers();
  });

  fit('should login success return token', async () => {
    const response = await request
      .post(`/login/`)
      .send({ username: 'username', password: 123 });

    expect(response.status).toBe(200);
    expect(typeof response.body?.accessToken).toBe('string');
    expect(await verifyAuthToken(response.body?.accessToken)).toBe(true);
    expect(typeof response.body?.refreshToken).toBe('string');
    expect(await verifyAuthToken(response.body?.refreshToken)).toBe(true);
  });

  fit('should login with wrong pass return err', async () => {
    const response = await request
      .post(`/login/`)
      .send({ username: 'username', password: 1234 });

    expect(response.status).toBe(500);
    expect(response.body.err).toBe('Incorrect password');
  });

  fit('should login with invalid user return err', async () => {
    const response = await request
      .post(`/login/`)
      .send({ username: 'invaliduser', password: 1234 });

    expect(response.status).toBe(500);
    expect(response.body.err).toBe('User not found');
  });

  fit('should authenticate give info of user', async () => {
    const response = await request
      .post(`/authenticate/`)
      .send({ username: 'username', password: 123 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      username: 'username',
      email: 'test@gmail.com',
      first_name: 'first name',
      last_name: 'last name',
    });
  });

  afterAll(async () => {
    await prepareDB();
  });
});
const prepareDB = async () => {
  try {
    const conn = await client.connect();
    await conn.query('DELETE FROM users;');
    await conn.query('ALTER SEQUENCE users_id_seq RESTART WITH 1;');
    conn.release();
  } catch (error) {
    console.log(error);
  }
};

const prepareUsers = async () => {
  const conn = await client.connect();
  const sql =
    'INSERT INTO users (id, username, email, password, first_name, last_name) VALUES ($1, $2, $3, $4, $5, $6);';
  await conn.query(sql, [
    1,
    'username',
    'test@gmail.com',
    await genHashPassword('123'),
    'first name',
    'last name',
  ]);
  conn.release();
};
