import {Request, Response, NextFunction} from 'express';
import {Customer} from '../../../models/customer';
import {HTTPError, HTTPStatus} from '../../../helpers/httpErrors';
import {logger} from '../../../lib/winston';
import {hash, genSalt} from 'bcrypt';

export const createAgeDate = (
  {body}: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.age = new Date(body.age);

  next();
};

export const createPasswordHash = async (
  {body}: Request,
  res: Response,
  next: NextFunction
) => {
  // generating salt and saving to locals as temp
  try {
    // hardcoding this as we will never change it
    res.locals.temp = await genSalt(10);
  } catch (e) {
    throw HTTPError(HTTPStatus.INTERNAL_SERVER_ERROR);
  }

  try {
    res.locals.passwordHash = await hash(body.password, res.locals.temp);
  } catch (e) {
    throw HTTPError(HTTPStatus.INTERNAL_SERVER_ERROR);
  }

  next();
};

export const createUser = async (
  {body}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.locals.customer = await Customer.create({
      email: body.email,
      password: res.locals.passwordHash,
      firstName: body.first_name,
      lastName: body.last_name,
      age: res.locals.age,
      address: body.address,
      creditAccount: null,
    });
  } catch (e) {
    logger.info('failed on create');
    console.error(JSON.stringify(e));
    throw HTTPError(HTTPStatus.INTERNAL_SERVER_ERROR);
  }

  next();
};
