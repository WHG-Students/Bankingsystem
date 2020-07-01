import {Request, Response, NextFunction} from 'express';
import {HTTPError, HTTPStatus} from '../../../helpers/httpErrors';

export const depositBodyValidations = (
  {body}: Request,
  res: Response,
  next: NextFunction
) => {
  if (body.amount <= 0) {
    throw HTTPError(HTTPStatus.PRECONDITION_FAILED);
  }

  next();
};
