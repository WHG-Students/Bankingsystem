import http from 'http';
import express from 'express';
import {applyMiddleware, applyRoutes} from './helpers';
import middleware from './middleware';
import errorHandlers from './middleware/errorHandlers';
import routes from './controllers';
import dotenv from 'dotenv';

import './lib';

dotenv.config();

const router = express();
applyMiddleware(middleware, router);
applyRoutes(routes, router);
applyMiddleware(errorHandlers, router);

const {PORT = 3000} = process.env;

// ssl will be handled from reverse proxy
http.createServer(router).listen(PORT, () => {
  console.info(`Running server on http://localhost:${PORT}`);
});
