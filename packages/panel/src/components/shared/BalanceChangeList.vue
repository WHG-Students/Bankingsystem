<template>
  <b-card no-body>
    <b-card-header
      header-bg-variant="light"
      header-text-variant="black"
      class="semibold"
    >
      {{ $t('layout.header.' + type) }}
    </b-card-header>
    <div class="list">
      <div v-for="(balanceChange, index) in balanceChanges" :key="index">
        <b-card-body>
          <div v-for="(value, key) in balanceChange" :key="key">
            <div
              class="d-flex justify-content-between"
              v-if="shouldBeHidden(key)"
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
  name: 'BalanceChangeList',
  props: {
    balanceChanges: {
      type: Array,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  methods: {
    shouldBeHidden(key: string) {
      if (key === 'type' || key === 'id' || key === 'creditAccount')
        return false;
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
