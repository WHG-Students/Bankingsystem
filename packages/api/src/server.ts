import http from 'http';
import express from 'express';
import {applyMiddleware, applyRoutes} from './helpers';
import middleware from './middleware';
import errorHandlers from './middleware/errorHandlers';
import {logger} from './lib/winston';
import routes from './controllers';
import dotenv from 'dotenv';

import './lib';

dotenv.config();

const router = express();
applyMiddleware(middleware, router);
applyRoutes(routes, router);
applyMiddleware(errorHandlers, router);

const {PORT = 3000} = process.env;

export const server = http.createServer(router);

server.listen(PORT, () => {
  logger.info(`Running server on http://localhost:${PORT}`);
});
