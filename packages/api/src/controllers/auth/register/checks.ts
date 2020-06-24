import {Request, Response, NextFunction} from 'express';
import {HTTPError, HTTPStatus} from '../../../helpers/httpErrors';
import {Customer} from '../../../models/customer';
import {logger} from '../../../lib/winston';

export const preconditionRequiredCheck = (
  {body}: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    !body.email ||
    !body.password ||
    !body.first_name ||
    !body.last_name ||
    !body.age ||
    !body.address
  ) {
    throw HTTPError(HTTPStatus.PRECONDITION_REQUIRED);
  }

  next();
};

export const userExistsCheck = async (
  {body}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.locals.temp = await Customer.findOne({
      where: {
        email: body.email,
      },
    });
  } catch (e) {
    logger.error(JSON.stringify(e));
    throw HTTPError(HTTPStatus.INTERNAL_SERVER_ERROR);
  }

  // must check outside if it already existsm or otherwise
  // it would have been catched
  if (res.locals.temp) {
    throw HTTPError(HTTPStatus.CONFLICT);
  }

  next();
};
