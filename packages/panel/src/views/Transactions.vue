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
      <b-modal id="add-modal" :title="$t('transactions.add')" @ok="submit">
        <form ref="form" @submit.prevent="submit">
          <b-form-group :label="$t('transactions.addReceiver')" required>
            <b-form-input
              id="receiver"
              v-model="formData.receiver"
              maxLength="320"
              type="email"
              class="mb-2"
              :placeholder="$t('transactions.receiver')"
              required
            />
            <b-form-input
              id="amount"
              v-model="formData.amount"
              maxLength="32"
              type="number"
              class="mb-2"
              :placeholder="$t('transactions.amount')"
              required
            />
            <b-form-input
              id="title"
              v-model="formData.title"
              maxLength="1024"
              :placeholder="$t('transactions.title')"
            />
          </b-form-group>
        </form>
      </b-modal>
      <div class="d-flex justify-content-end">
        <b-button v-b-modal.add-modal variant="success" size="sm" class="mb-2">
          <b-icon-plus font-scale="1.45" class="rounded-circle" />
          <span>
            {{ $t('transactions.transaction') }}
          </span>
        </b-button>
      </div>
      <b-row>
        <b-col cols="12" md="6">
          <transaction-list class="mb-5" :transactions="transactions" />
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
import {TransactionState, Finance} from '../store/finance';
import {formattingMixin, sortingMixin} from '../mixins/formatting';
import {mapGetters, mapActions} from 'vuex';
import TransactionList from '@/components/shared/TransactionList.vue';
import Statistics from '@/components/shared/Statistics.vue';
import {alertMixin} from '../mixins/auth';
import validator from 'validator';
import {api} from '../plugins/axios';
import {AxiosError} from 'axios';
import {Auth} from '../store/auth';

type FormData = {
  receiver: string;
  amount: number;
  title?: string;
};

export default mixins(formattingMixin, alertMixin, sortingMixin).extend({
  name: 'Transactions',
  components: {
    TransactionList,
    Statistics,
  },
  data: () => ({
    formData: {} as FormData,
  }),
  methods: {
    ...mapActions('auth', [Auth.FETCH_CREDIT_ACCOUNT]),
    ...mapActions('finance', [Finance.FETCH_TRANSACTIONS]),
    ...mapGetters('finance', [Finance.GET_TRANSACTIONS]),
    isValidInput() {
      // validate exists
      if (!this.formData.receiver || !this.formData.amount) {
        this.alert.message = 'requiredNotFulfilled';
        // validate length
      } else if (
        this.formData.receiver.length > 320 ||
        (this.formData.amount + '').length > 32 ||
        (this.formData.title || '').length > 1024
      ) {
        this.alert.message = 'tooLongInputs';
        // validate is email
      } else if (!validator.isEmail(this.formData.receiver)) {
        this.alert.message = 'noValidEmailSet';
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
        await api.post('/transactions', {
          receiver_email: this.formData.receiver,
          amount: this.formData.amount,
          title: this.formData.title,
        });

        this.alert.color = 'success';
        this.alert.message = 'success';

        // refetches transactions and updates it everywhere
        // and updated the credit account balance
        await this[Finance.FETCH_TRANSACTIONS]();
        await this[Auth.FETCH_CREDIT_ACCOUNT]();
      } catch (e) {
        switch ((e as AxiosError).response?.status) {
          case 400:
            this.alert.message = 'badRequest';
            break;
          case 404:
            this.alert.message = 'notFound';
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
    transactions() {
      const transactions: TransactionState[] = this[Finance.GET_TRANSACTIONS]();
      return (this.sortByCreatedAt(transactions) as TransactionState[]).map(
        transaction => ({
          ...transaction,
          exchangedAmount: this.formatNumber(transaction.exchangedAmount),
          createdAt: this.formatDate(transaction.createdAt),
        })
      );
    },
    statistics() {
      const transactions: TransactionState[] = this[Finance.GET_TRANSACTIONS]();
      const sortedByCreatedAt = this.sortByCreatedAt(transactions);

      const lastCreated = (
        (sortedByCreatedAt.find((_, i) => i === 0) as TransactionState) || {}
      ).createdAt;

      const firstCreated = (
        (sortedByCreatedAt.find(
          (_, i, a) => i === a.length - 1
        ) as TransactionState) || {}
      ).createdAt;

      return {
        amount: transactions.length,
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
