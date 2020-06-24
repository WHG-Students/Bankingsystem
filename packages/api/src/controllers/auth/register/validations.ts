import {Request, Response, NextFunction} from 'express';
import {HTTPError, HTTPStatus} from '../../../helpers/httpErrors';
import validator from 'validator';

export const bodyValidations = (
  {body}: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    !validator.isEmail(body.email) ||
    !validator.isISO8601(body.age) ||
    !(body.password.length <= 128) ||
    !(body.first_name.length <= 128) ||
    !(body.last_name.length <= 128) ||
    !(body.address.length <= 512)
  ) {
    throw HTTPError(HTTPStatus.PRECONDITION_FAILED);
  }
  next();
};
