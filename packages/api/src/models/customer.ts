import {Model, DataTypes} from 'sequelize';
import {sequelize} from '../lib/sequelize';

export class Customer extends Model {
  public email!: string;
  public name!: string;
  public firstName!: string;
  public lastName!: string;
  public age!: Date;
  public address!: string;
  public creditAccount!: number;

  public readonly createdAt!: Date;
}

Customer.init(
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
    sequelize,
    tableName: 'customers',
    updatedAt: false,
  }
);

// creates the table if it doesn't exist
Customer.sync();
