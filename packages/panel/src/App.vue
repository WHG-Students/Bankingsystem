<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapActions, mapGetters} from 'vuex';
import {Auth} from './store/auth';
import {logger} from './plugins/winston';

export default Vue.extend({
  methods: {
    ...mapActions('auth', [Auth.CHECK_IS_AUTHENTICATED, Auth.DECODE_ID_TOKEN]),
    ...mapGetters('auth', [Auth.GET_IS_AUTHENTICATED, Auth.GET_USER]),
  },
  created() {
    this[Auth.CHECK_IS_AUTHENTICATED]();

    if (this[Auth.GET_IS_AUTHENTICATED]()) {
      logger.info('Entry/created: is authenticated');
      this[Auth.DECODE_ID_TOKEN]();
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
</style>
