import {Response, Request, NextFunction} from 'express';
import {HTTPError, HTTPStatus} from '../../../helpers/httpErrors';

export const transactionPreconditionCheck = (
  {body}: Request,
  res: Response,
  next: NextFunction
) => {
  if (!body.receiver_email || !body.amount) {
    throw HTTPError(HTTPStatus.PRECONDITION_REQUIRED);
  }

  next();
};
