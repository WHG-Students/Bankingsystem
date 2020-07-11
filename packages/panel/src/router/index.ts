import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import Home from '../views/Index.vue';
import Transactions from '../views/Transactions.vue';
import Deposits from '../views/Deposits.vue';
import Withdrawals from '../views/Withdrawals.vue';
import Register from '../views/auth/Register.vue';
import Login from '../views/auth/Login.vue';

Vue.use(VueRouter);

const component = Vue.extend({
  render: c => c('router-view'),
});

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: Transactions,
  },
  {
    path: '/deposits',
    name: 'Deposits',
    component: Deposits,
  },
  {
    path: '/withdrawals',
    name: 'Withdrawals',
    component: Withdrawals,
  },
  {
    path: '/auth',
    name: 'Auth',
    redirect: '/auth/register',
    component,
    children: [
      {
        path: 'register',
        name: 'Register',
        component: Register,
      },
      {
        path: 'login',
        name: 'Login',
        component: Login,
      },
    ],
  },
];

export const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});
