import {DataTypes, Optional, ModelDefined} from 'sequelize';
import {sequelize} from '../../lib/sequelize';

type CreditAccountTransactionAttributes = {
  id: number;
  transactionId: number;
  creditAccountId: number;
};

type CreditAccountTransactionCreationAttributes = Optional<
  CreditAccountTransactionAttributes,
  'id'
>;

export const CreditAccountTransaction: ModelDefined<
  CreditAccountTransactionAttributes,
  CreditAccountTransactionCreationAttributes
> = sequelize.define(
  'CreditAccountToTransaction',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    transactionId: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: 'transactions',
        key: 'id',
      },
      allowNull: false,
    },
    creditAccountId: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: 'creditAccounts',
        key: 'id',
      },
      allowNull: false,
    },
  },
  {
    tableName: 'creditAccountToTransaction',
    updatedAt: false,
    createdAt: false,
  }
);
