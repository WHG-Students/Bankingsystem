<template>
  <div>
    <b-container class="relative">
      <div class="alert-container">
        <b-alert
          :show="alert.countdown"
          dismissible
          :variant="alert.color"
          @dismissed="alert.countdown = 0"
          @dismiss-count-down="alertCountDownChange"
        >
          <p>{{ $t('transactions.response.' + alert.message) }}</p>
          <b-progress
            :variant="alert.color"
            :max="alert.maxCountdown"
            :value="alert.countdown"
            height="4px"
          ></b-progress>
        </b-alert>
      </div>
      <b-modal
        id="add-modal"
        :title="$t('balanceChanges.addDeposit')"
        @ok="submit"
      >
        <form ref="form" @submit.prevent="submit">
          <b-form-group :label="$t('transactions.addReceiver')" required>
            <b-form-input
              id="amount"
              v-model="formData.amount"
              maxLength="32"
              type="number"
              class="mb-2"
              :placeholder="$t('transactions.amount')"
              required
            />
          </b-form-group>
        </form>
      </b-modal>
      <div class="d-flex justify-content-end">
        <b-button v-b-modal.add-modal variant="success" size="sm" class="mb-2">
          <b-icon-plus font-scale="1.45" class="rounded-circle" />
          <span>
            {{ $t('balanceChanges.deposit') }}
          </span>
        </b-button>
      </div>
      <b-row>
        <b-col cols="12" md="6">
          <balance-change-list
            class="mb-5"
            :balanceChanges="deposits"
            type="deposits"
          />
        </b-col>
        <b-col cols="12" md="6">
          <statistics :statistics="statistics" />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins';
import {Finance, DepositState} from '../store/finance';
import {formattingMixin, sortingMixin} from '../mixins/formatting';
import {mapGetters, mapActions} from 'vuex';
import BalanceChangeList from '@/components/shared/BalanceChangeList.vue';
import Statistics from '@/components/shared/Statistics.vue';
import {alertMixin} from '../mixins/auth';
import {api} from '../plugins/axios';
import {AxiosError} from 'axios';
import {Auth} from '../store/auth';

type FormData = {
  amount: number;
};

export default mixins(formattingMixin, alertMixin, sortingMixin).extend({
  name: 'Deposits',
  components: {
    BalanceChangeList,
    Statistics,
  },
  data: () => ({
    formData: {} as FormData,
  }),
  methods: {
    ...mapActions('auth', [Auth.FETCH_CREDIT_ACCOUNT]),
    ...mapActions('finance', [Finance.FETCH_DEPOSITS]),
    ...mapGetters('finance', [Finance.GET_DEPOSITS]),
    isValidInput() {
      // validate exists
      if (!this.formData.amount) {
        this.alert.message = 'requiredNotFulfilled';
        // validate length
      } else if ((this.formData.amount + '').length > 32) {
        this.alert.message = 'tooLongInputs';
      } else {
        return true;
      }

      this.alert.color = 'danger';
      this.alert.countdown = this.alert.maxCountdown;
      return false;
    },
    async submit() {
      if (!this.isValidInput()) return;

      try {
        await api.post('/deposits', {
          amount: this.formData.amount,
        });

        this.alert.color = 'success';
        this.alert.message = 'depositSuccess';

        // refetches transactions and updates it everywhere
        // and updated the credit account balance
        await this[Finance.FETCH_DEPOSITS]();
        await this[Auth.FETCH_CREDIT_ACCOUNT]();
      } catch (e) {
        switch ((e as AxiosError).response?.status) {
          case 500:
            this.alert.message = 'internalServerError';
            break;
          default:
            this.alert.message = 'error';
        }
        this.alert.color = 'danger';
      }

      this.alert.countdown = this.alert.maxCountdown;

      // safe clear inputs
      this.formData = {} as FormData;
    },
  },
  computed: {
    deposits() {
      const balanceChanges: DepositState[] = this[Finance.GET_DEPOSITS]();
      return (this.sortByCreatedAt(balanceChanges) as DepositState[]).map(
        balanceChanges => ({
          ...balanceChanges,
          amount: this.formatNumber(balanceChanges.amount),
          createdAt: this.formatDate(balanceChanges.createdAt),
        })
      );
    },
    statistics() {
      const balanceChanges: DepositState[] = this[Finance.GET_DEPOSITS]();
      const sortedByCreatedAt = this.sortByCreatedAt(balanceChanges);

      const lastCreated = (
        (sortedByCreatedAt.find((_, i) => i === 0) as DepositState) || {}
      ).createdAt;

      const firstCreated = (
        (sortedByCreatedAt.find(
          (_, i, a) => i === a.length - 1
        ) as DepositState) || {}
      ).createdAt;

      return {
        amount: balanceChanges.length,
        lastCreated: this.formatDate(lastCreated),
        firstCreated: this.formatDate(firstCreated),
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.relative {
  position: relative;

  .alert-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }
}
</style>
