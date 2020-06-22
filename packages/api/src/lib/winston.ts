import winston from 'winston';
import {format as logFormFormat} from 'logform';
import dotenv from 'dotenv';
dotenv.config();

const {NODE_ENV} = process.env;
const {combine, colorize, printf, timestamp} = logFormFormat;
const tsColorizer = colorize();

tsColorizer.addColors({
  TIMESTAMP: 'grey',
});

const colorizeTimestamp = (timestamp: string) =>
  tsColorizer.colorize('TIMESTAMP', timestamp);

const format = combine(
  logFormFormat(info => {
    info.level = info.level.toUpperCase();
    return info;
  })(),
  timestamp({
    format: 'HH:mm:ss',
  }),
  colorize({
    colors: {
      DEBUG: 'seagreen',
      INFO: 'darkturquoise',
      WARN: 'khaki',
      ERROR: 'tomato',
    },
    level: true,
  }),
  printf(
    ({message, level, timestamp}) =>
      `[${colorizeTimestamp(timestamp)}] [${level}]: ${message}`
  )
);

export const logger = winston.createLogger({
  transports: [
    // these transportation configs will show all 4 log levels
    // during development, but only the error level will be
    // logged to the console (and picked up by pm2) if
    // the application is in production mode
    new winston.transports.Console({
      format,
      silent: NODE_ENV === 'production',
      level: 'debug',
    }),
    new winston.transports.Console({
      format,
      silent: NODE_ENV !== 'production',
      level: 'error',
    }),
  ],
});
