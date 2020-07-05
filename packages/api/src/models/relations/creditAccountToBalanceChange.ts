import {DataTypes, Optional, ModelDefined} from 'sequelize';
import {sequelize} from '../../lib/sequelize';

type CreditAccountBalanceChangeAttributes = {
  id: number;
  balanceChangeId: number;
  creditAccountId: number;
};

type CreditAccountBalanceChangeCreationAttributes = Optional<
  CreditAccountBalanceChangeAttributes,
  'id'
>;

export const CreditAccountBalanceChange: ModelDefined<
  CreditAccountBalanceChangeAttributes,
  CreditAccountBalanceChangeCreationAttributes
> = sequelize.define(
  'CreditAccountToBalanceChange',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    balanceChangeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: 'balanceChanges',
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
    tableName: 'creditAccountToBalanceChange',
    updatedAt: false,
    createdAt: false,
  }
);
