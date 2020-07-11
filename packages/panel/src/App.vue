<template>
  <div id="app">
    <layout-header v-show="isAuthenticated" />
    <router-view class="mb-5" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapActions, mapGetters} from 'vuex';
import {Auth} from './store/auth';
import {logger} from './plugins/winston';
import LayoutHeader from './components/layout/Header.vue';
import {Finance} from './store/finance';

export default Vue.extend({
  components: {
    LayoutHeader,
  },
  methods: {
    ...mapActions('finance', [
      Finance.FETCH_TRANSACTIONS,
      Finance.FETCH_WITHDRAWALS,
      Finance.FETCH_DEPOSITS,
    ]),
    ...mapActions('auth', [
      Auth.CHECK_IS_AUTHENTICATED,
      Auth.DECODE_ID_TOKEN,
      Auth.FETCH_CREDIT_ACCOUNT,
    ]),
    ...mapGetters('auth', [Auth.GET_IS_AUTHENTICATED, Auth.GET_USER]),
  },
  computed: {
    isAuthenticated: {
      set(isAuthenticated) {
        return isAuthenticated;
      },
      get() {
        return this[Auth.GET_IS_AUTHENTICATED]();
      },
    },
  },
  async created() {
    this[Auth.CHECK_IS_AUTHENTICATED]();
    this.isAuthenticated = this[Auth.GET_IS_AUTHENTICATED]();

    if (this.isAuthenticated) {
      logger.info('Entry/created: is authenticated');
      await this[Auth.DECODE_ID_TOKEN]();

      // fetching data once on start.
      // will be fetched again on login
      // or if an addition is made
      // -> less server costs
      await this[Auth.FETCH_CREDIT_ACCOUNT]();
      await this[Finance.FETCH_TRANSACTIONS]();
      await this[Finance.FETCH_WITHDRAWALS]();
      await this[Finance.FETCH_DEPOSITS]();

      // stay at route, otherwise we would redirect the user
      // to the overview page after every reload
    } else {
      logger.info('Entry/created: is NOT authenticated');
      const route = this.$route.name;

      // don't redirect if already in auth routes
      if (route !== 'Register' && route !== 'Login') {
        this.$router.push({name: 'Auth'});
      }
    }
  },
});
</script>

<style lang="scss">
@import '~bootstrap/scss/bootstrap';
@import '~bootstrap-vue/src/index.scss';

body {
  font-family: 'Hind Vadodara', sans-serif;
}

.medium {
  font-weight: 500;
}

.semibold {
  font-weight: 600;
}
</style>
