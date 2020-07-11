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
        :title="$t('balanceChanges.addWithdrawal')"
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
            {{ $t('balanceChanges.withdrawal') }}
          </span>
        </b-button>
      </div>
      <b-row>
        <b-col cols="12" md="6">
          <balance-change-list
            class="mb-5"
            :balanceChanges="withdrawals"
            type="withdrawals"
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
import {Finance, WithdrawalState} from '../store/finance';
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
  name: 'Withdrawals',
  components: {
    BalanceChangeList,
    Statistics,
  },
  data: () => ({
    formData: {} as FormData,
  }),
  methods: {
    ...mapActions('auth', [Auth.FETCH_CREDIT_ACCOUNT]),
    ...mapActions('finance', [Finance.FETCH_WITHDRAWALS]),
    ...mapGetters('finance', [Finance.GET_WITHDRAWALS]),
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
        await api.post('/withdrawals', {
          amount: this.formData.amount,
        });

        this.alert.color = 'success';
        this.alert.message = 'withdrawalSuccess';

        // refetches transactions and updates it everywhere
        // and updated the credit account balance
        await this[Finance.FETCH_WITHDRAWALS]();
        await this[Auth.FETCH_CREDIT_ACCOUNT]();
      } catch (e) {
        switch ((e as AxiosError).response?.status) {
          case 400:
            this.alert.message = 'withdrawalBadRequest';
            break;
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
    withdrawals() {
      const balanceChanges: WithdrawalState[] = this[Finance.GET_WITHDRAWALS]();
      return (this.sortByCreatedAt(balanceChanges) as WithdrawalState[]).map(
        balanceChanges => ({
          ...balanceChanges,
          amount: this.formatNumber(balanceChanges.amount),
          createdAt: this.formatDate(balanceChanges.createdAt),
        })
      );
    },
    statistics() {
      const balanceChanges: WithdrawalState[] = this[Finance.GET_WITHDRAWALS]();
      const sortedByCreatedAt = this.sortByCreatedAt(balanceChanges);

      const lastCreated = (
        (sortedByCreatedAt.find((_, i) => i === 0) as WithdrawalState) || {}
      ).createdAt;

      const firstCreated = (
        (sortedByCreatedAt.find(
          (_, i, a) => i === a.length - 1
        ) as WithdrawalState) || {}
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
