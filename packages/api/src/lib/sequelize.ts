import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({
  path: '../../.env',
});

const {
  MYSQL_HOST,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  NODE_ENV,
} = process.env;

export const sequelize = new Sequelize({
  dialect: 'mysql',
  port: 3306,
  host: MYSQL_HOST,
  username: MYSQL_USER,
  database: MYSQL_DATABASE,
  password: MYSQL_PASSWORD,
  logging: NODE_ENV !== 'production' ? console.info : false,
});

const createConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Authentication successful');
  } catch (e) {
    console.warn('MySQL Authentication failed');
    console.error(e);
    // connection will be cut off by mysql on first startup.
    // this is why we try to receive a connection every 5 seconds
    // if an error occurs
    setTimeout(async () => await createConnection(), 5000);
  }
};

createConnection();
