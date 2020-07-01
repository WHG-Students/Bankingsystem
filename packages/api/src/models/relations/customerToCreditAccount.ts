import {DataTypes, ModelCtor, Model, Optional} from 'sequelize';
import {sequelize} from '../../lib/sequelize';

type CustomerCreditAccountAttributes = {
  id: number;
  customerEmail: string;
  creditAccountId: number;
};

type CustomerCreditAccountCreationAttributes = Optional<
  CustomerCreditAccountAttributes,
  'id'
>;

export const CustomerCreditAccount: ModelCtor<Model<
  CustomerCreditAccountAttributes,
  CustomerCreditAccountCreationAttributes
>> = sequelize.define(
  'CustomerToCreditAccount',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    customerEmail: {
      type: new DataTypes.STRING(320),
      references: {
        model: 'customers',
        key: 'email',
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
    tableName: 'customerToCreditAccount',
    updatedAt: false,
    createdAt: false,
  }
);
