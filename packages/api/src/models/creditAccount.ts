import {DataTypes, Optional, ModelDefined} from 'sequelize';
import {sequelize} from '../lib/sequelize';

type CreditAccountAttributes = {
  id: number;
  balance: number;
  maxAllowance: number;
};

type CreditAccountCreationAttributes = Optional<
  CreditAccountAttributes,
  'id' | 'balance' | 'maxAllowance'
>;

export const CreditAccount: ModelDefined<
  CreditAccountAttributes,
  CreditAccountCreationAttributes
> = sequelize.define(
  'CreditAccount',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    balance: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      allowNull: false,
    },
    maxAllowance: {
      type: DataTypes.BIGINT,
      defaultValue: -5000,
      allowNull: false,
    },
  },
  {
    tableName: 'creditAccounts',
  }
);
