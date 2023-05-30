import supertest from 'supertest';
import client from '../../database';
import _ from 'lodash';
import { User, UserModel } from '../../models/user.model';
import { genToken } from '../../helpers/jwt';
import { genHashPassword } from '../../helpers/genHashPassword';

const base_url = 'http://localhost:3000';
const userUrl = '/users/';

const request = supertest(base_url);
const userInstance = new UserModel();

const users: User[] = [
  {
    username: 'user1',
    email: 'user1@gmail.com',
    password: '123',
    first_name: 'first name 1',
    last_name: 'last name 1',
  },
  {
    username: 'user2',
    email: 'user2@gmail.com',
    password: '1234',
    first_name: 'first name 2',
    last_name: 'last name 2',
  },
  {
    username: 'user3',
    email: 'user3@gmail.com',
    password: '12345',
    first_name: 'first name 3',
    last_name: 'last name 3',
  },
  {
    username: 'user4',
    email: 'user4@gmail.com',
    password: '123456',
    first_name: 'first name 4',
    last_name: 'last name 4',
  },
];

const usersWithId = _.each(users, (user, index = 0) => {
  user.id = index + 1;
});

const userPut = {
  username: 'user update',
  email: 'user1@gmail.com',
  password: '123',
  first_name: 'first name update',
  last_name: 'last name update',
};

const userPost = {
  username: 'user create',
  email: 'user1@gmail.com',
  password: '123',
  first_name: 'first name create',
  last_name: 'last name create',
};
let token: string;
fdescribe('User model', () => {
  it('has an create method', () => {
    expect(userInstance.createUser).toBeDefined();
  });

  it('has get user by id method', () => {
    expect(userInstance.getUserById).toBeDefined();
  });

  it('has get all users method', () => {
    expect(userInstance.getAllUsers).toBeDefined();
  });

  it('has an update user method', () => {
    expect(userInstance.updateUser).toBeDefined();
  });

  it('has an delete user method', () => {
    expect(userInstance.deleteUser).toBeDefined();
  });
});

fdescribe('user handle', () => {
  beforeAll(async () => {
    await prepareDB();
    await prepareUsers(users);
    token = `bearer ${await genToken('user test')}`;
  });

  fit('should get all users', async () => {
    const response = await request.get(userUrl).set('Authorization', token);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      usersWithId.map((user) => _.omit(user, ['password'])),
    );
  });

  fit('should get user by id', async () => {
    const response = await request
      .get(`${userUrl}${3}`)
      .set('Authorization', token);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: 3,
      username: 'user3',
      email: 'user3@gmail.com',
      first_name: 'first name 3',
      last_name: 'last name 3',
    });
  });

  fit('should add new user', async () => {
    const response = await request
      .post(userUrl)
      .set('Authorization', token)
      .send(userPost);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: 5,
      username: 'user create',
      email: 'user1@gmail.com',
      first_name: 'first name create',
      last_name: 'last name create',
    });
  });

  fit('should update user', async () => {
    const response = await request
      .put(`${userUrl}${4}`)
      .set('Authorization', token)
      .send(userPut);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: 4,
      username: 'user update',
      email: 'user1@gmail.com',
      first_name: 'first name update',
      last_name: 'last name update',
    });
  });

  fit('should delete user', async () => {
    const response = await request
      .delete(`${userUrl}${2}`)
      .set('Authorization', token);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: 2,
      username: 'user2',
      email: 'user2@gmail.com',
      first_name: 'first name 2',
      last_name: 'last name 2',
    });
  });

  afterAll(async () => {
    await prepareDB();
  });
});

const prepareDB = async () => {
  try {
    const conn = await client.connect();
    await conn.query('DELETE FROM users');
    await conn.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    conn.release();
  } catch (error) {
    console.log(error);
  }
};

const prepareUsers = async (users: User[]) => {
  const conn = await client.connect();
  const sql =
    'INSERT INTO users (username, email, password, first_name, last_name) VALUES ($1, $2, $3, $4, $5);';
  for (const user of users) {
    await conn.query(sql, [
      user.username,
      user.email,
      await genHashPassword(user.password),
      user.first_name,
      user.last_name,
    ]);
  }
  conn.release();
};
