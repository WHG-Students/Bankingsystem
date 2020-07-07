import {Route} from '../../helpers';
import {Request, Response} from 'express';
import {
  transactionPreconditionCheck,
  transactionBodyValidations,
  loadReceiver,
  loadReceiverCreditAccount,
  createTransaction,
  createTransactionRelations,
  updateBalances,
  loadTransactions,
  loadTransactionRelations,
} from './transactions';
import {createDeposit, loadDeposits} from './deposits';
import {
  checkIsAuthenticated,
  loadCreditAccount,
  createBalanceChangeRelation,
  updateBalanceByAmount,
  validateSenderHasRequiredBalance,
  loadBalanceChangeRelations,
  balanceChangeBodyValidations,
  balanceChangePreconditionCheck,
} from './shared';
import {createWithdrawal, loadWithdrawals} from './withdrawals';

export const exchangeRoutes = [
  {
    // not following our rest naming convention here
    // as the user does not know the internal id of the creditAccount
    path: '/creditAccount',
    method: 'get',
    handler: [
      checkIsAuthenticated,
      loadCreditAccount,
      async (req: Request, res: Response) => {
        res.status(200).send(res.locals.creditAccount);
      },
    ],
  },
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
  {
    path: '/deposits',
    method: 'post',
    handler: [
      balanceChangePreconditionCheck,
      balanceChangeBodyValidations,
      checkIsAuthenticated,
      loadCreditAccount,
      createDeposit,
      updateBalanceByAmount,
      createBalanceChangeRelation,
      async (req: Request, res: Response) => {
        res.status(201).send(res.locals.balanceChange);
      },
    ],
  },
  {
    path: '/deposits',
    method: 'get',
    handler: [
      checkIsAuthenticated,
      loadCreditAccount,
      loadBalanceChangeRelations,
      loadDeposits,
      async (req: Request, res: Response) => {
        res.status(200).send(res.locals.deposits);
      },
    ],
  },
  {
    path: '/withdrawals',
    method: 'post',
    handler: [
      balanceChangePreconditionCheck,
      balanceChangeBodyValidations,
      checkIsAuthenticated,
      loadCreditAccount,
      validateSenderHasRequiredBalance,
      createWithdrawal,
      updateBalanceByAmount,
      createBalanceChangeRelation,
      async (req: Request, res: Response) => {
        res.status(201).send(res.locals.balanceChange);
      },
    ],
  },
  {
    path: '/withdrawals',
    method: 'get',
    handler: [
      checkIsAuthenticated,
      loadCreditAccount,
      loadBalanceChangeRelations,
      loadWithdrawals,
      async (req: Request, res: Response) => {
        res.status(200).send(res.locals.withdrawals);
      },
    ],
  },
] as Route[];
