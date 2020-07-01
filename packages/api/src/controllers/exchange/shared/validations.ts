import {Request, Response, NextFunction} from 'express';
import {HTTPError, HTTPStatus} from '../../../helpers/httpErrors';

export const balanceChangeBodyValidations = (
  {body}: Request,
  res: Response,
  next: NextFunction
) => {
  if (body.amount <= 0) {
    throw HTTPError(HTTPStatus.PRECONDITION_FAILED);
  }

  next();
};

export const validateSenderHasRequiredBalance = (
  {body}: Request,
  res: Response,
  next: NextFunction
) => {
  const {amount}: {amount: number} = body;
  const {
    balance,
    maxAllowance,
  }: {balance: number; maxAllowance: number} = res.locals.creditAccount;

  // max allowance is negative
  const budget = maxAllowance * -1 + balance;

  if (budget - amount < 0) {
    throw HTTPError(HTTPStatus.BAD_REQUEST);
  }

  next();
};
