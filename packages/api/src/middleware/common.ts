import {Router} from 'express';
import parser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

export const handleBodyRequestParsing = (router: Router) => {
  router.use(parser.urlencoded({extended: true}));
  router.use(parser.json());
};

export const handleCompression = (router: Router) => {
  router.use(compression());
};

export const handleHelmet = (router: Router) => {
  router.use(helmet());
};

export const handleCors = (router: Router) => {
  router.use(cors({credentials: true, origin: true}));
};

export const basePath = `${process.env.BASE_PATH}/${process.env.API_VERSION}`;
