import {NextFunction, Response, Request} from 'express';
import {sign} from 'jsonwebtoken';
import {config} from 'dotenv';

config();

/**
 * using the accessToken for authentication
 *
 * @param req
 * @param res
 * @param next
 */
export const generateAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.accessToken = sign(
    {
      email: res.locals.customer.email,
    },
    process.env.RSA_PRIVATE_KEY as string,
    {
      algorithm: 'RS256',
      audience: 'https://students.trade/',
      expiresIn: '365 days',
    }
  );

  next();
};

/**
 * using the id token here because we want
 * to cache some private data on the clientside
 *
 * @param req
 * @param res
 * @param next
 */
export const generateIdToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.idToken = sign(
    {
      email: res.locals.customer.email,
      first_name: res.locals.customer.firstName,
      last_name: res.locals.customer.lastName,
      age: res.locals.customer.age,
      address: res.locals.customer.address,
      creditAccount: res.locals.customer.creditAccount,
    },
    process.env.RSA_PRIVATE_KEY as string,
    {
      algorithm: 'RS256',
      audience: 'https://students.trade/',
      expiresIn: '365 days',
    }
  );

  next();
};
