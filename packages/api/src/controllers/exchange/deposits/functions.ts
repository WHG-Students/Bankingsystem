import {Request, Response, NextFunction} from 'express';
import {handleDatabaseFaltyError} from '../../../helpers';
import {BalanceChange, BalanceChangeTypes} from '../../../models/balanceChange';

export const createDeposit = async (
  {body}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.locals.balanceChange = await BalanceChange.create({
      amount: body.amount,
      creditAccount: res.locals.creditAccount.id,
      type: BalanceChangeTypes.DEPOSIT,
    });
  } catch (e) {
    handleDatabaseFaltyError(e);
  }

  // will set the amount to negative if it's a withdrawal here.
  // a solution to keep the dry princible
  res.locals.amount = body.amount;

  next();
};

export const loadDeposits = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const balanceChangeIds = res.locals.creditAccountBalanceChanges.map(
    (e: {id: number}) => e.id
  );

  try {
    res.locals.deposits = await BalanceChange.findAll({
      where: {
        id: balanceChangeIds,
        type: BalanceChangeTypes.DEPOSIT,
      },
    });
  } catch (e) {
    handleDatabaseFaltyError(e);
  }

  next();
};
