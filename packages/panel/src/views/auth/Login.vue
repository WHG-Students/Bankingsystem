<template>
  <div>
    <b-container class="relative">
      <b-row class="d-flex justify-content-center">
        <b-col cols="12" md="8">
          <div class="alert-container mt-2">
            <b-alert
              :show="alert.countdown"
              dismissible
              :variant="alert.color"
              @dismissed="alert.countdown = 0"
              @dismiss-count-down="alertCountDownChange"
            >
              <p>{{ $t('auth.login.response.' + alert.message) }}</p>
              <b-progress
                :variant="alert.color"
                :max="alert.maxCountdown"
                :value="alert.countdown"
                height="4px"
              ></b-progress>
            </b-alert>
          </div>
        </b-col>
        <b-col cols="12" md="8" class="mt-5">
          <b-card no-body class="mt-5">
            <b-card-header header-bg-variant="dark" header-text-variant="white">
              {{ $t('auth.login.loginAccount') }}
            </b-card-header>
            <b-card-body>
              <b-form @submit.prevent="submit">
                <b-form-group :label="$t('auth.login.credentials')">
                  <b-form-input
                    v-model="formData.email"
                    id="email"
                    class="mb-2"
                    :placeholder="$t('auth.login.email')"
                    type="email"
                    maxLength="320"
                    required
                  />
                  <b-form-input
                    v-model="formData.password"
                    id="password"
                    :placeholder="$t('auth.login.password')"
                    type="password"
                    maxLength="128"
                    required
                  />
                </b-form-group>

                <b-button
                  size="sm"
                  type="submit"
                  variant="success"
                  :disabled="loading"
                >
                  <span
                    v-show="loading"
                    class="spinner-border spinner-border-sm"
                    role="status"
                  />
                  {{ $t('auth.login.login') }}
                </b-button>
              </b-form>
            </b-card-body>
            <b-card-footer>
              <p class="mb-0">
                {{ $t('auth.login.dontHaveAnAccount') }}

                <router-link to="/auth/register">
                  {{ $t('auth.login.register') }}
                </router-link>
              </p>
            </b-card-footer>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins';
import {alertMixin, loginMixin} from '../../mixins/auth';
import {api} from '../../plugins/axios';
import {AxiosError} from 'axios';
import {logger} from '../../plugins/winston';

type FormData = {
  email: string;
  password: string;
};

export default mixins(alertMixin, loginMixin).extend({
  name: 'Login',
  data: () => ({
    formData: {} as FormData,
    loading: false,
  }),
  methods: {
    async submit() {
      this.loading = true;

      try {
        const response = await api.post('/login', {
          email: this.formData.email,
          password: this.formData.password,
        });

        this.alert.color = 'success';
        this.alert.message = 'loginSuccess';

        this.login(response.data);
      } catch (e) {
        this.alert.color = 'danger';
        logger.warn(e);

        switch ((e as AxiosError).response?.status) {
          case 401:
            this.alert.message = 'unauthorized';
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
      }

      this.alert.countdown = this.alert.maxCountdown;
      this.loading = false;
    },
  },
});
</script>
