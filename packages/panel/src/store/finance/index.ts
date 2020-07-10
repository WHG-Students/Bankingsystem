import {Module} from 'vuex';
import {api} from '@/plugins/axios';
import {logger} from '@/plugins/winston';
import {AxiosResponse} from 'axios';

export enum Finance {
  FETCH_TRANSACTIONS = 'fetchTransactions',
  SET_TRANSACTIONS = 'setTransactions',
  GET_TRANSACTIONS = 'getTransactions',
  FETCH_WITHDRAWALS = 'fetchWithdrawals',
  SET_WITHDRAWALS = 'setWithdrawals',
  GET_WITHDRAWALS = 'getWithdrawals',
  FETCH_DEPOSITS = 'fetchDeposits',
  SET_DEPOSITS = 'setDeposits',
  GET_DEPOSITS = 'getDeposits',
}

export type DepositState = {
  amount: number;
  createdAt: string;
};

export type WithdrawalState = DepositState;

export type TransactionState = {
  exchangedAmount: number;
  sender: string;
  receiver: string;
  createdAt: string;
  title: string | null;
};

type FinanceState = {
  deposits: DepositState[];
  withdrawals: WithdrawalState[];
  transactions: TransactionState[];
};

export const finance = {
  namespaced: true,
  state: {
    deposits: [] as DepositState[],
    withdrawals: [] as WithdrawalState[],
    transactions: [] as TransactionState[],
  },
  getters: {
    [Finance.GET_DEPOSITS](state) {
      return state.deposits;
    },
    [Finance.GET_WITHDRAWALS](state) {
      return state.withdrawals;
    },
    [Finance.GET_TRANSACTIONS](state) {
      return state.transactions;
    },
  },
  mutations: {
    [Finance.SET_DEPOSITS](state, payload: DepositState[]) {
      logger.info(payload);
      state.deposits = payload;
    },
    [Finance.SET_WITHDRAWALS](state, payload: WithdrawalState[]) {
      logger.info(payload);
      state.withdrawals = payload;
    },
    [Finance.SET_TRANSACTIONS](state, payload: TransactionState[]) {
      logger.info(payload);
      state.transactions = payload;
    },
  },
  actions: {
    async [Finance.FETCH_DEPOSITS]({commit}) {
      try {
        const response: AxiosResponse<DepositState[]> = await api.get(
          '/deposits'
        );

        logger.info(
          `vuex/finance/${Finance.FETCH_DEPOSITS}: fetched successfully`
        );

        commit(Finance.SET_DEPOSITS, response.data);
      } catch (e) {
        logger.error(e);
      }
    },
    async [Finance.FETCH_WITHDRAWALS]({commit}) {
      try {
        const response: AxiosResponse<WithdrawalState[]> = await api.get(
          '/withdrawals'
        );

        logger.info(
          `vuex/finance/${Finance.FETCH_WITHDRAWALS}: fetched successfully`
        );

        commit(Finance.SET_WITHDRAWALS, response.data);
      } catch (e) {
        logger.error(e);
      }
    },
    async [Finance.FETCH_TRANSACTIONS]({commit}) {
      try {
        const response: AxiosResponse<TransactionState[]> = await api.get(
          '/transactions'
        );

        logger.info(
          `vuex/finance/${Finance.FETCH_TRANSACTIONS}: fetched successfully`
        );

        commit(Finance.SET_TRANSACTIONS, response.data);
      } catch (e) {
        logger.error(e);
      }
    },
  },
} as Module<FinanceState, {}>;
