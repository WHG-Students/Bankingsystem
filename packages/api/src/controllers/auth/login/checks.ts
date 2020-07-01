import {Request, Response, NextFunction} from 'express';
import {HTTPError, HTTPStatus} from '../../../helpers/httpErrors';
import {Customer} from '../../../models/customer';
import {logger} from '../../../lib/winston';

export const loginPreconditionCheck = (
  {body}: Request,
  res: Response,
  next: NextFunction
) => {
  if (!body.email || !body.password) {
    throw HTTPError(HTTPStatus.PRECONDITION_REQUIRED);
  }

  next();
};

export const loginUserExistsCheck = async (
  {body}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.locals.customer = await Customer.findOne({
      where: {
        email: body.email,
      },
    });
  } catch (e) {
    logger.error(JSON.stringify(e));
    throw HTTPError(HTTPStatus.INTERNAL_SERVER_ERROR);
  }

  // checks if the customer even exists
  if (!res.locals.customer) {
    throw HTTPError(HTTPStatus.NOT_FOUND);
  }

  next();
};
