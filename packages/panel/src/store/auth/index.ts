import {Module} from 'vuex';
import {decode} from 'jsonwebtoken';
import {logger} from '@/plugins/winston';

export enum Key {
  ACCESS_TOKEN = 'accessToken',
  ID_TOKEN = 'idToken',
}

export enum Auth {
  CHECK_IS_AUTHENTICATED = 'checkIsAuthenticated',
  SET_IS_AUTHENTICATED = 'setIsAuthenticated',
  GET_IS_AUTHENTICATED = 'getIsAuthenticated',
  DECODE_ID_TOKEN = 'decodeIdToken',
  SET_USER = 'setUser',
  GET_USER = 'getUser',
  STORE_TOKENS = 'storeTokens',
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

export type UserState = UserShared & {
  firstName: string;
  lastName: string;
  age: Date;
};

type AuthState = {
  isAuthenticated: boolean;
  user?: UserState;
};

export const auth = {
  namespaced: true,
  state: {
    isAuthenticated: false,
  },
  getters: {
    [Auth.GET_IS_AUTHENTICATED](state) {
      return state.isAuthenticated;
    },
    [Auth.GET_USER](state) {
      return state.user;
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
  },
  actions: {
    [Auth.CHECK_IS_AUTHENTICATED]({commit}) {
      const accessToken = localStorage.getItem(Key.ACCESS_TOKEN);

      // need to do this ternary check as accessToken is not a boolean
      commit(Auth.SET_IS_AUTHENTICATED, accessToken ? true : false);
    },
    [Auth.DECODE_ID_TOKEN]({commit}) {
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
    [Auth.STORE_TOKENS](
      {dispatch},
      tokens: {access_token: string; id_token: string}
    ) {
      const {access_token: accessToken, id_token: idToken} = tokens;

      localStorage.setItem(Key.ACCESS_TOKEN, accessToken);
      localStorage.setItem(Key.ID_TOKEN, idToken);

      dispatch(Auth.CHECK_IS_AUTHENTICATED);
      dispatch(Auth.DECODE_ID_TOKEN);
    },
  },
} as Module<AuthState, {}>;
