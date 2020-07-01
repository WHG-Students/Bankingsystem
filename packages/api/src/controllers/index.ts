import {Route} from '../helpers';
import {authRoutes} from './auth';
import {exchangeRoutes} from './exchange';

export = [...authRoutes, ...exchangeRoutes] as Route[];
