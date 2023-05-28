import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const { TOKEN_SECRET } = process.env;

export const genToken = async (username: string): Promise<string> => {
  return await jwt.sign(
    { username: username },
    TOKEN_SECRET as unknown as string,
  );
};

export const verifyAuthToken = (token: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      TOKEN_SECRET as unknown as string,
      (err: any, decoded: any) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      },
    );
  });
};
