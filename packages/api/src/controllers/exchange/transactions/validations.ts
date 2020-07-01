import {Response, Request, NextFunction} from 'express';
import {HTTPError, HTTPStatus} from '../../../helpers/httpErrors';
import validator from 'validator';

export const transactionBodyValidations = (
  {body}: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    !validator.isEmail(body.receiver_email) ||
    body.amount <= 0 ||
    (body.title || '').length > 1024
  ) {
    throw HTTPError(HTTPStatus.PRECONDITION_FAILED);
  }

  next();
};
