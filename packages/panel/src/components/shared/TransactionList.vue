<template>
  <b-card no-body>
    <b-card-header
      header-bg-variant="light"
      header-text-variant="black"
      class="semibold"
    >
      {{ $t('layout.header.transactions') }}
    </b-card-header>
    <div class="list">
      <div v-for="(transaction, index) in transactions" :key="index">
        <b-card-body>
          <div v-for="(value, key) in transaction" :key="key">
            <div
              class="d-flex justify-content-between"
              v-if="shouldBeHidden(key, value)"
            >
              <span class="medium">{{ $t('home.' + key) }}</span>
              <span>{{ value }}</span>
            </div>
          </div>
        </b-card-body>
      </div>
    </div>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'TransactionList',
  props: {
    transactions: {
      type: Array,
      required: true,
    },
  },
  methods: {
    shouldBeHidden(key: string, value: string) {
      if ((key === 'title' && value === null) || key === 'id') return false;
      return true;
    },
  },
});
</script>

<style lang="scss" scoped>
.list > div {
  &:nth-child(even) {
    background: #f4f4f4;
  }
}
</style>
