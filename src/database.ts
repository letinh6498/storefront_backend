import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASS,
  POSTGRES_DB_TEST,
  ENV,
} = process.env;

let postgresDB;
if (ENV === 'test') {
  postgresDB = POSTGRES_DB_TEST;
}
if (ENV === 'dev') {
  postgresDB = POSTGRES_DB;
}
const client = new Pool({
  host: POSTGRES_HOST,
  database: postgresDB,
  user: POSTGRES_USER,
  password: POSTGRES_PASS,
});

export default client;
