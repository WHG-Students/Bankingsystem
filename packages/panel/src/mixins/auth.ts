import Vue from 'vue';
import {mapActions} from 'vuex';
import {Auth} from '@/store/auth';
import {updateAccessToken} from '@/plugins/axios';

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
    ...mapActions('auth', [Auth.STORE_TOKENS]),
    async login(tokens: {id_token: string; access_token: string}) {
      await this[Auth.STORE_TOKENS](tokens);
      updateAccessToken();
      this.$router.push({name: 'Home'});
    },
  },
});
