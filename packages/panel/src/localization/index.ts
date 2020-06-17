import Vue from 'vue';
import VueI18n from 'vue-i18n';
import {de} from './de';

Vue.use(VueI18n);

const messages = {
  de,
};

export const i18n = new VueI18n({
  messages,
  fallbackLocale: 'de',
  locale: 'de',
});
