import {Customer} from './customer';
import {Transaction} from './transaction';
import {CreditAccount} from './creditAccount';
import {BalanceChange} from './balanceChange';
import {CreditAccountTransaction} from './relations/creditAccountToTransaction';
import {CreditAccountBalanceChange} from './relations/creditAccountToBalanceChange';
import {CustomerCreditAccount} from './relations/customerToCreditAccount';
import {logger} from '../lib/winston';

// created tables if they don't exist
// this function should only be called once
export const syncTables = async () => {
  logger.info('syncing Customer');
  await Customer.sync();

  logger.info('syncing CreditAccount');
  await CreditAccount.sync();

  logger.info('syncing Transaction');
  await Transaction.sync();

  logger.info('syncing BalanceChange');
  await BalanceChange.sync();

  logger.info('syncing CreditAccountTransaction');
  await CreditAccountTransaction.sync();

  logger.info('syncing CreditAccountBalanceChange');
  await CreditAccountBalanceChange.sync();

  logger.info('syncing CustomerCreditAccount');
  await CustomerCreditAccount.sync();
};
