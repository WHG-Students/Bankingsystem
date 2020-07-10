import Vue from 'vue';
import Vuex from 'vuex';
import {auth} from './auth';
import {finance} from './finance';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    auth,
    finance,
  },
});
