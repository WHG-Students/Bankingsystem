import {DataTypes, ModelCtor, Model} from 'sequelize';
import {sequelize} from '../lib/sequelize';

type CustomerModel = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: Date;
  address: string;
  creditAccount?: number | null;
};

export const Customer: ModelCtor<Model<{}, CustomerModel>> = sequelize.define(
  'Customer',
  {
    email: {
      type: new DataTypes.STRING(320), // max possible email length
      primaryKey: true,
    },
    password: {
      type: new DataTypes.STRING(60), // bcrypt hashes are exactly 60 characters long
      allowNull: false,
    },
    firstName: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    lastName: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    age: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    address: {
      type: new DataTypes.STRING(512),
      allowNull: false,
    },
    creditAccount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
  },
  {
    tableName: 'customers',
    updatedAt: false,
  }
);

// creates the table if it doesn't exist
Customer.sync();
