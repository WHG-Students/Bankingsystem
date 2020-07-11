import Vue from 'vue';
import * as moment from 'moment';

export const formattingMixin = Vue.extend({
  methods: {
    formatDate(date: string) {
      return moment(date).format('DD. MMM Y');
    },
    formatNumber(n?: number) {
      return n?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },
  },
});

export const sortingMixin = Vue.extend({
  methods: {
    sortByCreatedAt(values: {createdAt: string}[]) {
      return values
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    },
  },
});
