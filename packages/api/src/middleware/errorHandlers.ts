import {Request, Response, NextFunction, Router} from 'express';
import {HTTPError, HTTPStatus, HTTPErrorResponse} from '../helpers/httpErrors';

const handleMethodNotFoundError = (router: Router) => {
  router.use((req: Request) => {
    throw HTTPError(
      HTTPStatus.NOT_FOUND,
      `${req.method} ${req.url || req.originalUrl} (Not Found)`
    );
  });
};

const handleHTTPError = (router: Router) => {
  router.use(
    (
      err: Error | HTTPErrorResponse,
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      if ((err as HTTPErrorResponse).status) {
        res.type('application/json');
        res
          .status((err as HTTPErrorResponse).status)
          .send({message: (err as HTTPErrorResponse).message});
      } else {
        next();
      }
    }
  );
};

export = [handleMethodNotFoundError, handleHTTPError];
