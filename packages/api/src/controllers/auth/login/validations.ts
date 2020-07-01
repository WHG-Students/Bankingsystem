import {Request, Response, NextFunction} from 'express';
import {HTTPError, HTTPStatus} from '../../../helpers/httpErrors';
import validator from 'validator';
import {compare} from 'bcrypt';
import {promisify} from 'util';

export const loginBodyValidations = (
  {body}: Request,
  res: Response,
  next: NextFunction
) => {
  if (!validator.isEmail(body.email) || !(body.password.length <= 128)) {
    throw HTTPError(HTTPStatus.PRECONDITION_FAILED);
  }

  next();
};

export const validateUserCredentials = async (
  {body}: Request,
  res: Response,
  next: NextFunction
) => {
  const isEqual = await promisify(compare)(
    body.password,
    res.locals.customer.password
  );

  if (!isEqual) {
    throw HTTPError(HTTPStatus.UNAUTHORIZED);
  }

  next();
};
