import {axios} from '..';
import {AxiosError, AxiosResponse} from 'axios';
import {server} from '../../../src/server';
import {randomBytes} from 'crypto';

const route = '/register';
const customerMockData = {
  email: randomBytes(8).toString('hex') + '@students.trade',
  password: 'studentstrade',
  first_name: 'John',
  last_name: 'Smith',
  age: '2020-06-24T08:45:15.769Z',
  address: 'Deutschland, München, Am Weg 1',
} as const;

describe('registration route tests', () => {
  beforeAll(() => {
    // making sure the server is running before executing any http requests
    server.on('listening', () => {});
  });

  test('send without data', async () => {
    try {
      await axios.post(route);
    } catch (e) {
      expect((e as AxiosError).response?.status).toBe(428);
    }
  });

  test('send with missing data', async () => {
    try {
      await axios.post(route, {
        ...customerMockData,
        last_name: '',
      });
    } catch (e) {
      expect((e as AxiosError).response?.status).toBe(428);
    }
  });

  test('send with invalid email', async () => {
    try {
      await axios.post(route, {
        ...customerMockData,
        email: 'notAnEmail@',
      });
    } catch (e) {
      expect((e as AxiosError).response?.status).toBe(412);
    }
  });

  test('send password with length over 128', async () => {
    try {
      await axios.post(route, {
        ...customerMockData,
        password: Array(132).join('_'),
      });
    } catch (e) {
      expect((e as AxiosError).response?.status).toBe(412);
    }
  });

  test('successfully create user', async () => {
    const response: AxiosResponse<{
      access_token: string;
      id_token: string;
    }> = await axios.post(route, {
      ...customerMockData,
    });

    expect(response.status).toBe(201);
  });

  test('check user exists', async () => {
    try {
      await axios.post(route, {
        ...customerMockData,
      });
    } catch (e) {
      expect((e as AxiosError).response?.status).toBe(409);
    }
  });

  afterAll(async () => {
    server.close();
  });
});
