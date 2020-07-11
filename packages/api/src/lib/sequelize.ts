import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';
import {logger} from './winston';

dotenv.config({
  path: '../../.env',
});

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_ROOT_PASSWORD,
  MYSQL_USER,
  MYSQL_PASSWORD,
} = process.env;

// silence sequelize
process.on('unhandledRejection', () => {});

export const sequelize = new Sequelize({
  dialect: 'mysql',
  port: +(MYSQL_PORT || ''),
  host: MYSQL_HOST,
  username: MYSQL_USER,
  database: MYSQL_DATABASE,
  password: MYSQL_PASSWORD,
  //? deactivating sequelize logging for now completely NODE_ENV !== 'production' ? console.log :
  logging: false,
});

//! MUST import synctables here, as sequelize was not defined before but is used by children of models/index.ts
import {syncTables} from '../models';

const createConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('MySQL Authentication successful');
    await syncTables();
  } catch (e) {
    logger.warn('MySQL Authentication failed');
    logger.error(JSON.stringify(e));

    // if database doesn't exist create it
    if (e.parent.code === 'ER_BAD_DB_ERROR') {
      const setup = new Sequelize({
        dialect: 'mysql',
        port: 3306,
        host: MYSQL_HOST,
        username: 'root',
        password: MYSQL_ROOT_PASSWORD,
        logging: false,
      });

      await setup.authenticate();
      await setup.query(
        //! watch out what you enter as MYSQL_DATABASE env
        //! sql injection is possible here.
        `CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE};`
      );
    }

    // connection will be cut off by mysql on first startup.
    // this is why we try to receive a connection every 5 seconds
    // if an error occurs
    setTimeout(async () => await createConnection(), 5000);
  }
};

createConnection();
