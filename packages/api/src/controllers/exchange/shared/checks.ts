import {Request, Response, NextFunction} from 'express';
import {HTTPError, HTTPStatus} from '../../../helpers/httpErrors';

export const balanceChangePreconditionCheck = (
  {body}: Request,
  res: Response,
  next: NextFunction
) => {
  if (!body.amount) {
    throw HTTPError(HTTPStatus.PRECONDITION_REQUIRED);
  }

  next();
};
