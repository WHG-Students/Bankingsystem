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

export default Vue.extend({
  components: {
    LayoutHeader,
  },
  methods: {
    ...mapActions('auth', [Auth.CHECK_IS_AUTHENTICATED, Auth.DECODE_ID_TOKEN]),
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
