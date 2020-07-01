import {handleDatabaseFaltyError} from '../../../helpers';
import {Request, Response, NextFunction} from 'express';
import {CreditAccount} from '../../../models/creditAccount';
import {Customer} from '../../../models/customer';
import {HTTPError, HTTPStatus} from '../../../helpers/httpErrors';
import {Transaction} from '../../../models/transaction';
import {CreditAccountTransaction} from '../../../models/relations/creditAccountToTransaction';
import {loadCreditAccountByEmail} from '../shared';

export const loadReceiver = async (
  {body}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.locals.receiver = await Customer.findOne({
      where: {
        email: body.receiver_email,
      },
    });
  } catch (e) {
    handleDatabaseFaltyError(e);
  }

  // receiver doesn't exist
  if (!res.locals.receiver) {
    throw HTTPError(HTTPStatus.NOT_FOUND);
  }

  next();
};

export const loadReceiverCreditAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.receiverCreditAccount = await loadCreditAccountByEmail(
    res.locals.receiver.email
  );

  next();
};

export const createTransaction = async (
  {body}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.locals.transaction = await Transaction.create({
      exchangedAmount: body.amount,
      receiver: res.locals.receiver.email,
      sender: res.locals.customer.email,
      title: body.title,
    });
  } catch (e) {
    handleDatabaseFaltyError(e);
  }

  next();
};

export const createTransactionRelations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await CreditAccountTransaction.create({
      creditAccountId: res.locals.creditAccount.id,
      transactionId: res.locals.transaction.id,
    });

    await CreditAccountTransaction.create({
      creditAccountId: res.locals.receiverCreditAccount.id,
      transactionId: res.locals.transaction.id,
    });
  } catch (e) {
    handleDatabaseFaltyError(e);
  }

  next();
};

export const updateBalances = async (
  {body}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // removing amount from sender's balance
    await CreditAccount.update(
      {
        balance: +res.locals.creditAccount.balance - body.amount,
      },
      {
        where: {
          id: res.locals.creditAccount.id,
        },
      }
    );

    // adding amount to receiver's balance
    await CreditAccount.update(
      {
        balance: +res.locals.receiverCreditAccount.balance + body.amount,
      },
      {
        where: {
          id: res.locals.receiverCreditAccount.id,
        },
      }
    );
  } catch (e) {
    handleDatabaseFaltyError(e);
  }

  next();
};

export const loadTransactionRelations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.locals.creditAccountTransactions = await CreditAccountTransaction.findAll(
      {
        where: {
          creditAccountId: res.locals.creditAccount.id,
        },
      }
    );
  } catch (e) {
    handleDatabaseFaltyError(e);
  }

  res.locals.creditAccountTransactions =
    res.locals.creditAccountTransactions || [];

  next();
};

export const loadTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transactionIds = res.locals.creditAccountTransactions.map(
    (e: {id: number}) => e.id
  );

  try {
    res.locals.transactions = await Transaction.findAll({
      where: {
        id: transactionIds,
      },
    });
  } catch (e) {
    handleDatabaseFaltyError(e);
  }

  next();
};
