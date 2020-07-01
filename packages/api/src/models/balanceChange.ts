import {DataTypes, ModelCtor, Model, Optional} from 'sequelize';
import {sequelize} from '../lib/sequelize';

export enum BalanceChangeTypes {
  WITHDRAWAL = 'withdrawal',
  DEPOSIT = 'deposit',
}

type BalanceChangeAttributes = {
  id: number;
  type: BalanceChangeTypes;
  amount: number;
  creditAccount: number;
};

type BalanceChangeCreationAttributes = Optional<BalanceChangeAttributes, 'id'>;

export const BalanceChange: ModelCtor<Model<
  BalanceChangeAttributes,
  BalanceChangeCreationAttributes
>> = sequelize.define(
  'BalanceChange',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.ENUM('withdrawal', 'deposit'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    creditAccount: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: 'creditAccounts',
        key: 'id',
      },
      allowNull: false,
    },
  },
  {
    tableName: 'balanceChanges',
    updatedAt: false,
  }
);
