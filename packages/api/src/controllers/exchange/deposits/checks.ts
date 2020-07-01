import {Request, Response, NextFunction} from 'express';
import {HTTPError, HTTPStatus} from '../../../helpers/httpErrors';

export const depositPreconditionCheck = (
  {body}: Request,
  res: Response,
  next: NextFunction
) => {
  if (!body.amount) {
    throw HTTPError(HTTPStatus.PRECONDITION_REQUIRED);
  }

  next();
};
