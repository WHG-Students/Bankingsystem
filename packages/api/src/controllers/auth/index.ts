import {Route} from '../../helpers';
import {Request, Response} from 'express';
import {
  preconditionRequiredCheck as registerPreconditionCheck,
  userExistsCheck,
} from './register/checks';
import {bodyValidations} from './register/validations';
import {
  createUser,
  createAgeDate,
  createPasswordHash,
} from './register/functions';
import {generateAccessToken, generateIdToken} from '../shared/functions';

export const authRoutes = [
  {
    path: '/register',
    method: 'post',
    handler: [
      registerPreconditionCheck,
      bodyValidations,
      createAgeDate,
      userExistsCheck,
      createPasswordHash,
      createUser,
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
] as Route[];
