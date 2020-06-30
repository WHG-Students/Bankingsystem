import {Request, Response, NextFunction} from 'express';
import {Customer} from '../../../models/customer';
import {CreditAccount} from '../../../models/creditAccount';
import {CustomerCreditAccount} from '../../../models/relations/customerToCreditAccount';
import {HTTPError, HTTPStatus} from '../../../helpers/httpErrors';
import {hash, genSalt} from 'bcrypt';
import {handleDatabaseFaltyError} from '../../../helpers';

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
  try {
    // hardcoding this as we will never change it
    const salt = await genSalt(10);
    res.locals.passwordHash = await hash(body.password, salt);
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
    });
  } catch (e) {
    handleDatabaseFaltyError(e);
  }

  next();
};

export const createCreditAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.locals.creditAccount = await CreditAccount.create();
  } catch (e) {
    handleDatabaseFaltyError(e);
  }

  next();
};

export const createCustomerCreditAccountRelation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await CustomerCreditAccount.create({
      creditAccountId: res.locals.creditAccount.id,
      customerEmail: res.locals.customer.email,
    });
  } catch (e) {
    handleDatabaseFaltyError(e);
  }

  next();
};
