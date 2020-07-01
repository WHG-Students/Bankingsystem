import {Route} from '../../helpers';
import {Request, Response} from 'express';
import {
  transactionPreconditionCheck,
  transactionBodyValidations,
  validateSenderHasRequiredBalance,
  loadReceiver,
  loadReceiverCreditAccount,
  createTransaction,
  createTransactionRelations,
  updateBalances,
  loadTransactions,
  loadTransactionRelations,
} from './transactions';
import {checkIsAuthenticated, loadCreditAccount} from '../shared';

export const exchangeRoutes = [
  {
    path: '/transactions',
    method: 'post',
    handler: [
      transactionPreconditionCheck,
      transactionBodyValidations,
      checkIsAuthenticated,
      loadReceiver,
      loadCreditAccount,
      validateSenderHasRequiredBalance,
      loadReceiverCreditAccount,
      createTransaction,
      createTransactionRelations,
      updateBalances,
      async (req: Request, res: Response) => {
        res.status(201).send(res.locals.transaction);
      },
    ],
  },
  {
    path: '/transactions',
    method: 'get',
    handler: [
      checkIsAuthenticated,
      loadCreditAccount,
      loadTransactionRelations,
      loadTransactions,
      async (req: Request, res: Response) => {
        res.status(200).send(res.locals.transactions);
      },
    ],
  },
] as Route[];
