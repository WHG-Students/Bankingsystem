<template>
  <b-card no-body>
    <b-card-header
      header-bg-variant="light"
      header-text-variant="black"
      class="semibold"
    >
      {{ $t('statistics.statistics') }}
    </b-card-header>
    <div class="list">
      <b-card-body>
        <div v-for="(value, key) in statistics" :key="key">
          <div class="d-flex justify-content-between">
            <span class="medium">{{ $t('statistics.' + key) }}</span>
            <span>{{ value }}</span>
          </div>
        </div>
      </b-card-body>
    </div>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Statistics',
  props: {
    statistics: {
      type: Object,
      required: true,
    },
  },
});
</script>
