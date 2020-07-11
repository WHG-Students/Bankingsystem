<template>
  <div class="home">
    <b-container>
      <b-row>
        <b-col cols="12" md="6">
          <b-card no-body>
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
          <b-card no-body>
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
          <transaction-list class="mt-5" :transactions="transactions" />
        </b-col>
        <b-col cols="12" sm="6" lg="3">
          <balance-change-list
            class="mt-5"
            :balanceChanges="deposits"
            type="deposits"
          />
        </b-col>
        <b-col cols="12" sm="6" lg="3">
          <balance-change-list
            class="mt-5"
            :balanceChanges="withdrawals"
            type="withdrawals"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins';
import {formattingMixin, sortingMixin} from '../mixins/formatting';
import {Auth} from '../store/auth';
import {mapGetters} from 'vuex';
import {
  Finance,
  TransactionState,
  WithdrawalState,
  DepositState,
} from '../store/finance';
import TransactionList from '@/components/shared/TransactionList.vue';
import BalanceChangeList from '@/components/shared/BalanceChangeList.vue';

export default mixins(formattingMixin, sortingMixin).extend({
  name: 'Home',
  components: {TransactionList, BalanceChangeList},
  methods: {
    ...mapGetters('finance', [
      Finance.GET_TRANSACTIONS,
      Finance.GET_WITHDRAWALS,
      Finance.GET_DEPOSITS,
    ]),
    ...mapGetters('auth', [Auth.GET_USER, Auth.GET_CREDIT_ACCOUNT]),
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
      return (this.sortByCreatedAt(transactions) as TransactionState[])
        .map(transaction => ({
          ...transaction,
          exchangedAmount: this.formatNumber(transaction.exchangedAmount),
          createdAt: this.formatDate(transaction.createdAt),
        }))
        .slice(0, 3);
    },
    withdrawals() {
      const balanceChanges: WithdrawalState[] = this[Finance.GET_WITHDRAWALS]();
      return (this.sortByCreatedAt(balanceChanges) as WithdrawalState[])
        .map(balanceChanges => ({
          ...balanceChanges,
          amount: this.formatNumber(balanceChanges.amount),
          createdAt: this.formatDate(balanceChanges.createdAt),
        }))
        .slice(0, 5);
    },
    deposits() {
      const balanceChanges: DepositState[] = this[Finance.GET_DEPOSITS]();
      return (this.sortByCreatedAt(balanceChanges) as DepositState[])
        .map(balanceChanges => ({
          ...balanceChanges,
          amount: this.formatNumber(balanceChanges.amount),
          createdAt: this.formatDate(balanceChanges.createdAt),
        }))
        .slice(0, 5);
    },
  },
});
</script>
