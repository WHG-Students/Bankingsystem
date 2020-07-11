import Vue from 'vue';
import {mapActions} from 'vuex';
import {Auth} from '@/store/auth';
import {updateAccessToken} from '@/plugins/axios';
import {Finance} from '@/store/finance';

export const alertMixin = Vue.extend({
  data: () => ({
    alert: {
      message: 'error', // setting a default message to avoid i18n warnings
      countdown: 0,
      maxCountdown: 5,
      color: '' as 'success' | 'danger',
    },
  }),
  methods: {
    alertCountDownChange(countdown: number) {
      this.alert.countdown = countdown;
    },
  },
});

export const loginMixin = Vue.extend({
  methods: {
    ...mapActions('finance', [
      Finance.FETCH_DEPOSITS,
      Finance.FETCH_WITHDRAWALS,
      Finance.FETCH_TRANSACTIONS,
    ]),
    ...mapActions('auth', [Auth.STORE_TOKENS, Auth.FETCH_CREDIT_ACCOUNT]),
    async login(tokens: {id_token: string; access_token: string}) {
      await this[Auth.STORE_TOKENS](tokens);

      updateAccessToken();

      // refetch everything after the api authorization
      // header has been updated
      await this[Auth.FETCH_CREDIT_ACCOUNT]();
      await this[Finance.FETCH_TRANSACTIONS]();
      await this[Finance.FETCH_WITHDRAWALS]();
      await this[Finance.FETCH_DEPOSITS]();

      this.$router.push({name: 'Home'});
    },
  },
});
