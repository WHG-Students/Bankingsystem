import {axios} from '.';
import {AxiosError} from 'axios';
import {server} from '../../src/server';
import {config} from 'dotenv';

config();

const {BASE_PATH, API_VERSION} = process.env;

describe('global server tests', () => {
  beforeAll(() => {
    server.on('listening', () => {});
  });

  test('send without data', async () => {
    try {
      await axios.get('/not_found');
    } catch (e) {
      expect((e as AxiosError).response).toMatchObject({
        status: 404,
        data: {
          message: `GET ${BASE_PATH}/${API_VERSION}/not_found (Not Found)`,
        },
      });
    }
  });

  afterAll(() => {
    server.close();
  });
});
