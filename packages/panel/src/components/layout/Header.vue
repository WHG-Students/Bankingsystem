<template>
  <header class="mb-5">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-container>
        <b-navbar-brand to="/">
          WHB - Werner Heisenberg Bank
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item
              v-for="(link, index) in links"
              :key="index"
              :active="index === activeIndex"
              :to="link.to"
            >
              {{ $t('layout.header.' + link.name) }}
            </b-nav-item>
            <b-button class="ml-2" variant="danger" @click="logout">
              <span>
                {{ $t('layout.header.logout') }}
              </span>
            </b-button>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
  </header>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapActions} from 'vuex';
import {Auth} from '../../store/auth';

export default Vue.extend({
  name: 'Header',
  data: () => ({
    links: [
      {
        name: 'home',
        to: '/',
      },
      {
        name: 'transactions',
        to: '/transactions',
      },
      {
        name: 'deposits',
        to: '/deposits',
      },
      {
        name: 'withdrawals',
        to: '/withdrawals',
      },
    ],
    activeIndex: 0,
  }),
  watch: {
    $route() {
      this.checkActiveItem();
    },
  },
  methods: {
    ...mapActions('auth', [Auth.REMOVE_TOKENS]),
    checkActiveItem() {
      const {path} = this.$route;
      this.activeIndex = this.links.findIndex(e => e.to === path);
    },
    logout() {
      this[Auth.REMOVE_TOKENS]();
      this.$router.push({name: 'Auth'});
    },
  },
  mounted() {
    this.checkActiveItem();
  },
});
</script>
