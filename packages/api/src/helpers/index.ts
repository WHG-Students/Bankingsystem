import {Router, Request, Response, NextFunction} from 'express';
import {basePath} from '../middleware/common';
import {logger} from '../lib/winston';
import {HTTPError, HTTPStatus} from './httpErrors';

type Wrapper = (router: Router) => void;

export const handleDatabaseFaltyError = (e: Error) => {
  logger.error(JSON.stringify(e));
  throw HTTPError(HTTPStatus.INTERNAL_SERVER_ERROR);
};

export const applyMiddleware = (
  middlewareWrappers: Wrapper[],
  router: Router
) => {
  for (const wrapper of middlewareWrappers) {
    wrapper(router);
  }
};

type Handler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

export interface Route {
  path: string;
  method: 'get' | 'post' | 'put' | 'delete';
  handler: Handler | Handler[];
}

export const applyRoutes = (routes: Route[], router: Router) => {
  for (const route of routes) {
    const {method, path, handler} = route;
    (handler as Handler[]).unshift(setJson);
    const newPath = basePath + path;
    router[method](newPath, handler);
  }
};

const setJson = async (req: Request, res: Response, next: NextFunction) => {
  res.type('application/json');
  next();
};
