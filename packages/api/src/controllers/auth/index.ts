import {Route} from '../../helpers';
import {Request, Response} from 'express';
import {
  createUser,
  createAgeDate,
  createPasswordHash,
  createCreditAccount,
  createCustomerCreditAccountRelation,
  registerPreconditionCheck,
  registerUserExistsCheck,
  registerBodyValidations,
} from './register';
import {
  loginBodyValidations,
  validateUserCredentials,
  loginPreconditionCheck,
  loginUserExistsCheck,
} from './login';
import {generateAccessToken, generateIdToken} from './shared';

export const authRoutes = [
  {
    path: '/register',
    method: 'post',
    handler: [
      registerPreconditionCheck,
      registerBodyValidations,
      createAgeDate,
      registerUserExistsCheck,
      createPasswordHash,
      createUser,
      createCreditAccount,
      createCustomerCreditAccountRelation,
      generateAccessToken,
      generateIdToken,
      async (req: Request, res: Response) => {
        res.status(201).send({
          access_token: res.locals.accessToken,
          id_token: res.locals.idToken,
        });
      },
    ],
  },
  {
    path: '/login',
    method: 'post',
    handler: [
      loginPreconditionCheck,
      loginBodyValidations,
      loginUserExistsCheck,
      validateUserCredentials,
      generateAccessToken,
      generateIdToken,
      async (req: Request, res: Response) => {
        res.status(200).send({
          access_token: res.locals.accessToken,
          id_token: res.locals.idToken,
        });
      },
    ],
  },
] as Route[];
