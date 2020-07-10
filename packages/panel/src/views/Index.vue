<template>
  <div class="home">
    <b-container>
      <b-row>
        <b-col cols="12" md="6">
          <b-card no-body class="mt-5">
            <b-card-header
              header-bg-variant="light"
              header-text-variant="black"
              class="semibold"
            >
              {{ $t('home.profile') }}
            </b-card-header>
            <b-card-body>
              <div
                class="d-flex justify-content-between"
                v-for="(value, key) in userComp"
                :key="key"
              >
                <span class="medium">{{ $t('home.' + key) }}</span>
                <span>{{ value }}</span>
              </div>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col cols="12" md="6">
          <b-card no-body class="mt-5">
            <b-card-header
              header-bg-variant="light"
              header-text-variant="black"
              class="semibold"
            >
              {{ $t('home.account') }}
            </b-card-header>
            <b-card-body>
              <div
                class="d-flex justify-content-between"
                v-for="(value, key) in creditAccountComp"
                :key="key"
              >
                <span class="medium">{{ $t('home.' + key) }}</span>
                <span>{{ value }}</span>
              </div>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12" lg="6">
          <b-card no-body class="mt-5">
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
                      v-if="shouldBeHiddenTransaction(key, value)"
                    >
                      <span class="medium">{{ $t('home.' + key) }}</span>
                      <span>{{ value }}</span>
                    </div>
                  </div>
                </b-card-body>
              </div>
            </div>
          </b-card>
        </b-col>
        <b-col cols="12" sm="6" lg="3">
          <b-card no-body class="mt-5">
            <b-card-header
              header-bg-variant="light"
              header-text-variant="black"
              class="semibold"
            >
              {{ $t('layout.header.deposits') }}
            </b-card-header>
            <div class="list">
              <div v-for="(deposit, index) in deposits" :key="index">
                <b-card-body>
                  <div v-for="(value, key) in deposit" :key="key">
                    <div
                      class="d-flex justify-content-between"
                      v-if="shouldBeHiddenBalanceChange(key)"
                    >
                      <span class="medium">{{ $t('home.' + key) }}</span>
                      <span>{{ value }}</span>
                    </div>
                  </div>
                </b-card-body>
              </div>
            </div>
          </b-card>
        </b-col>
        <b-col cols="12" sm="6" lg="3">
          <b-card no-body class="mt-5">
            <b-card-header
              header-bg-variant="light"
              header-text-variant="black"
              class="semibold"
            >
              {{ $t('layout.header.withdrawals') }}
            </b-card-header>
            <div class="list">
              <div v-for="(withdrawal, index) in withdrawals" :key="index">
                <b-card-body>
                  <div v-for="(value, key) in withdrawal" :key="key">
                    <div
                      class="d-flex justify-content-between"
                      v-if="shouldBeHiddenBalanceChange(key)"
                    >
                      <span class="medium">{{ $t('home.' + key) }}</span>
                      <span>{{ value }}</span>
                    </div>
                  </div>
                </b-card-body>
              </div>
            </div>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as moment from 'moment';
import {Auth} from '../store/auth';
import {mapGetters} from 'vuex';
import {mapActions} from 'vuex';
import {
  Finance,
  TransactionState,
  WithdrawalState,
  DepositState,
} from '../store/finance';

// small typescript hack we need to do for now.
// should come back to check this later
const methods = {
  shouldBeHiddenTransaction(key: string, value: string) {
    if ((key === 'title' && value === null) || key === 'id') return false;
    return true;
  },
  shouldBeHiddenBalanceChange(key: string) {
    if (key === 'type' || key === 'id' || key === 'creditAccount') return false;
    return true;
  },
  formatDate(date: string) {
    return moment(date).format('DD. MMM Y');
  },
  formatNumber(n?: number) {
    return n?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  },
};

export default Vue.extend({
  components: {},
  name: 'Home',
  methods: {
    ...mapActions('finance', [
      Finance.FETCH_TRANSACTIONS,
      Finance.FETCH_WITHDRAWALS,
      Finance.FETCH_DEPOSITS,
    ]),
    ...mapGetters('finance', [
      Finance.GET_TRANSACTIONS,
      Finance.GET_WITHDRAWALS,
      Finance.GET_DEPOSITS,
    ]),
    ...mapActions('auth', [Auth.FETCH_CREDIT_ACCOUNT]),
    ...mapGetters('auth', [Auth.GET_USER, Auth.GET_CREDIT_ACCOUNT]),
    ...methods,
  },
  computed: {
    userComp() {
      const {firstName, lastName, age, address, email} = this[Auth.GET_USER]();
      const addressSplit = (address || '').split(', ');
      const newAddress = addressSplit[1] + ', ' + addressSplit[0];

      return {
        name: firstName + ' ' + lastName,
        email,
        age: new Date().getFullYear() - (age || new Date()).getFullYear(), // probbaly not accurate
        address: newAddress,
      };
    },
    creditAccountComp() {
      const creditAccount = this[Auth.GET_CREDIT_ACCOUNT]();
      const {balance, maxAllowance, createdAt, updatedAt} = creditAccount;

      return {
        balance: this.formatNumber(balance),
        maxAllowance: this.formatNumber(maxAllowance),
        createdAt: this.formatDate(createdAt),
        updatedAt: this.formatDate(updatedAt),
      };
    },
    transactions() {
      const transactions: TransactionState[] = this[Finance.GET_TRANSACTIONS]();
      return transactions
        .map(transaction => ({
          ...transaction,
          exchangedAmount: this.formatNumber(transaction.exchangedAmount),
          createdAt: this.formatDate(transaction.createdAt),
        }))
        .slice(0, 3);
    },
    withdrawals() {
      const balanceChanges: WithdrawalState[] = this[Finance.GET_WITHDRAWALS]();
      return balanceChanges
        .map(balanceChanges => ({
          ...balanceChanges,
          amount: this.formatNumber(balanceChanges.amount),
          createdAt: this.formatDate(balanceChanges.createdAt),
        }))
        .slice(0, 5);
    },
    deposits() {
      const balanceChanges: DepositState[] = this[Finance.GET_DEPOSITS]();
      return balanceChanges
        .map(balanceChanges => ({
          ...balanceChanges,
          amount: this.formatNumber(balanceChanges.amount),
          createdAt: this.formatDate(balanceChanges.createdAt),
        }))
        .slice(0, 5);
    },
  },
  async mounted() {
    await this[Auth.FETCH_CREDIT_ACCOUNT]();
    await this[Finance.FETCH_TRANSACTIONS]();
    await this[Finance.FETCH_WITHDRAWALS]();
    await this[Finance.FETCH_DEPOSITS]();
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
