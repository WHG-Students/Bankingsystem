import {CreditAccountBalanceChange} from './../../../models/relations/creditAccountToBalanceChange';
import {CustomerCreditAccount} from './../../../models/relations/customerToCreditAccount';
import {Customer} from './../../../models/customer';
import {logger} from './../../../lib/winston';
import {verify} from 'jsonwebtoken';
import {HTTPError, HTTPStatus} from './../../../helpers/httpErrors';
import {Request, Response, NextFunction} from 'express';
import {CreditAccount} from '../../../models/creditAccount';
import {handleDatabaseFaltyError} from '../../../helpers';

/**
 * Authorizing with the Bearer Authentication Method
 * and the user's access token.
 * Also retrieving the customer from the database
 * and storing him in locals as customer
 *
 * @param req
 * @param res
 * @param next
 */
export const checkIsAuthenticated = async (
  {headers}: Request,
  res: Response,
  next: NextFunction
) => {
  // check if Authorization header exists
  const authorization = headers.authorization;

  // only allowing bearer authentication
  if (!authorization || !/Bearer/.test(authorization)) {
    throw HTTPError(HTTPStatus.UNAUTHORIZED);
  }

  // retrieve the accessToken
  const accessToken = authorization.split(' ')[1];

  try {
    res.locals.token = verify(
      accessToken,
      process.env.RSA_PUBLIC_KEY as string,
      {
        //! enforce RS256 algorithm on verification
        //! or otherwise any token signature will be accepted
        algorithms: ['RS256'],
      }
    );
  } catch (e) {
    logger.warn(JSON.stringify(e));
    throw HTTPError(HTTPStatus.UNAUTHORIZED);
  }

  // check if the user with this email exists
  try {
    res.locals.customer = await Customer.findOne({
      where: {
        email: res.locals.token.email,
      },
    });
  } catch (e) {
    handleDatabaseFaltyError(e);
  }

  if (!res.locals.customer) {
    throw HTTPError(HTTPStatus.NOT_FOUND);
  }

  next();
};

/**
 * helper function.
 * loads a credit account by it's email by id.
 * !MUST NOT be used as direct middleware
 *
 * @param customerEmail
 */
export const loadCreditAccountByEmail = async (customerEmail: string) => {
  // retrieve credit account id by it's customer relation
  try {
    const relation = await CustomerCreditAccount.findOne({
      where: {
        customerEmail,
      },
    });

    return await CreditAccount.findOne({
      where: {
        id: (relation as null | {creditAccountId: number})?.creditAccountId,
      },
    });
  } catch (e) {
    handleDatabaseFaltyError(e);
    return;
  }
};

/**
 * loading a credit account by the local customers email
 *
 * @param req
 * @param res
 * @param next
 */
export const loadCreditAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.creditAccount = await loadCreditAccountByEmail(
    res.locals.customer.email
  );

  next();
};

export const updateBalanceByAmount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await CreditAccount.update(
      {
        balance: res.locals.creditAccount.balance + res.locals.amount,
      },
      {
        where: {
          id: res.locals.creditAccount.id,
        },
      }
    );
  } catch (e) {
    handleDatabaseFaltyError(e);
  }

  next();
};

export const createBalanceChangeRelation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await CreditAccountBalanceChange.create({
      balanceChangeId: res.locals.balanceChange.id,
      creditAccountId: res.locals.creditAccount.id,
    });
  } catch (e) {
    handleDatabaseFaltyError(e);
  }

  next();
};

export const loadBalanceChangeRelations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.locals.creditAccountBalanceChanges = await CreditAccountBalanceChange.findAll(
      {
        where: {
          creditAccountId: res.locals.creditAccount.id,
        },
      }
    );
  } catch (e) {
    handleDatabaseFaltyError(e);
  }

  res.locals.creditAccountBalanceChanges =
    res.locals.creditAccountBalanceChanges || [];

  next();
};
