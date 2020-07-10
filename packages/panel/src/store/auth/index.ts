import {Module} from 'vuex';
import {decode} from 'jsonwebtoken';
import {logger} from '@/plugins/winston';
import {AxiosResponse} from 'axios';

export enum Key {
  ACCESS_TOKEN = 'accessToken',
  ID_TOKEN = 'idToken',
}

// msut import api after exporting key
import {api} from '@/plugins/axios';

export enum Auth {
  CHECK_IS_AUTHENTICATED = 'checkIsAuthenticated',
  SET_IS_AUTHENTICATED = 'setIsAuthenticated',
  GET_IS_AUTHENTICATED = 'getIsAuthenticated',
  DECODE_ID_TOKEN = 'decodeIdToken',
  SET_USER = 'setUser',
  GET_USER = 'getUser',
  STORE_TOKENS = 'storeTokens',
  REMOVE_TOKENS = 'removeTokens',
  FETCH_CREDIT_ACCOUNT = 'fetchCreditAccount',
  SET_CREDIT_ACCOUNT = 'setCreditAccount',
  GET_CREDIT_ACCOUNT = 'getCreditAccount',
}

type UserShared = {
  email: string;
  address: string;
};

type UserTokenPayload = UserShared & {
  first_name: string;
  last_name: string;
  age: string;
};

export type CreditAccountState = {
  balance: number;
  maxAllowance: number;
  createdAt: string;
  updatedAt: string;
};

export type UserState = UserShared & {
  firstName: string;
  lastName: string;
  age: Date;
};

type AuthState = {
  isAuthenticated: boolean;
  user: UserState;
  creditAccount: CreditAccountState;
};

export const auth = {
  namespaced: true,
  state: {
    isAuthenticated: false,
    user: {} as UserState,
    creditAccount: {} as CreditAccountState,
  },
  getters: {
    [Auth.GET_IS_AUTHENTICATED](state) {
      return state.isAuthenticated;
    },
    [Auth.GET_USER](state) {
      return state.user;
    },
    [Auth.GET_CREDIT_ACCOUNT](state) {
      return state.creditAccount;
    },
  },
  mutations: {
    [Auth.SET_IS_AUTHENTICATED](state, payload: boolean) {
      state.isAuthenticated = payload;
    },
    [Auth.SET_USER](state, payload: UserState) {
      logger.info(payload);
      state.user = payload;
    },
    [Auth.SET_CREDIT_ACCOUNT](state, payload: CreditAccountState) {
      logger.info(payload);
      state.creditAccount = payload;
    },
  },
  actions: {
    [Auth.CHECK_IS_AUTHENTICATED]({commit}) {
      const accessToken = localStorage.getItem(Key.ACCESS_TOKEN);

      // need to do this ternary check as accessToken is not a boolean
      commit(Auth.SET_IS_AUTHENTICATED, accessToken ? true : false);
    },
    async [Auth.DECODE_ID_TOKEN]({commit}) {
      const idToken = localStorage.getItem(Key.ID_TOKEN);

      // if this error occurs we only log it to the console
      if (!idToken) {
        logger.error(
          `vuex/auth/${Auth.DECODE_ID_TOKEN}: idToken is invalid, but user is authenticated`
        );
      } else {
        const user = decode(idToken) as UserTokenPayload;

        commit(Auth.SET_USER, {
          email: user.email,
          address: user.address,
          age: new Date(user.age),
          firstName: user.first_name,
          lastName: user.last_name,
        } as UserState);
      }
    },
    async [Auth.STORE_TOKENS](
      {dispatch},
      tokens: {access_token: string; id_token: string}
    ) {
      const {access_token: accessToken, id_token: idToken} = tokens;

      localStorage.setItem(Key.ACCESS_TOKEN, accessToken);
      localStorage.setItem(Key.ID_TOKEN, idToken);

      dispatch(Auth.CHECK_IS_AUTHENTICATED);
      await dispatch(Auth.DECODE_ID_TOKEN);
    },
    [Auth.REMOVE_TOKENS]({commit}) {
      localStorage.removeItem(Key.ACCESS_TOKEN);
      localStorage.removeItem(Key.ID_TOKEN);

      commit(Auth.SET_IS_AUTHENTICATED, false);
    },
    async [Auth.FETCH_CREDIT_ACCOUNT]({commit}) {
      try {
        const response: AxiosResponse<CreditAccountState> = await api.get(
          '/creditAccount'
        );
        logger.info(
          `vuex/auth/${Auth.FETCH_CREDIT_ACCOUNT}: fetched credit account`
        );
        commit(Auth.SET_CREDIT_ACCOUNT, response.data);
      } catch (e) {
        logger.error(e);
      }
    },
  },
} as Module<AuthState, {}>;
