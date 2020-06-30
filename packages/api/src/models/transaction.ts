import {DataTypes, ModelCtor, Model, Optional} from 'sequelize';
import {sequelize} from '../lib/sequelize';

type TransactionAttributes = {
  id: number;
  exchangedAmount: number;
  sender: string;
  receiver: string;
  title: string;
};

type TransactionCreationAttributes = Optional<
  TransactionAttributes,
  'id' | 'title'
>;

export const Transaction: ModelCtor<Model<
  TransactionAttributes,
  TransactionCreationAttributes
>> = sequelize.define(
  'Transaction',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    exchangedAmount: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    sender: {
      type: new DataTypes.STRING(320),
      references: 'customers',
      allowNull: false,
    },
    receiver: {
      type: new DataTypes.STRING(320),
      references: 'customers',
      allowNull: false,
    },
    title: {
      type: new DataTypes.STRING(1024),
      allowNull: true,
    },
  },
  {
    tableName: 'transactions',
    updatedAt: false,
  }
);

// creates the table if it doesn't exist
Transaction.sync();
