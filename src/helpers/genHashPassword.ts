import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const PEPPER = process.env.PEPPER;
const SALT_ROUNDS = 10;

export const genHashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSaltSync(SALT_ROUNDS);
  const passwordHash = await bcrypt.hashSync(password + PEPPER, salt);
  return passwordHash.toString();
};
