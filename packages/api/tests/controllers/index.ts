import Axios from 'axios';
import {config} from 'dotenv';
import './iconv';

config();

const {PORT, BASE_PATH, API_VERSION} = process.env;

export const axios = Axios.create({
  baseURL: `http://localhost:${PORT}${BASE_PATH}/${API_VERSION}`,
});
