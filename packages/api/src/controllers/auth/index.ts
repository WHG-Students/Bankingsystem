import {Route} from '../../helpers';
import {Request, Response} from 'express';
import {
  registerPreconditionCheck,
  registerUserExistsCheck,
} from './register/checks';
import {registerBodyValidations} from './register/validations';
import {
  createUser,
  createAgeDate,
  createPasswordHash,
  createCreditAccount,
  createCustomerCreditAccountRelation,
} from './register/functions';
import {loginPreconditionCheck, loginUserExistsCheck} from './login/checks';
import {
  loginBodyValidations,
  validateUserCredentials,
} from './login/validations';
import {generateAccessToken, generateIdToken} from '../shared/functions';

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
