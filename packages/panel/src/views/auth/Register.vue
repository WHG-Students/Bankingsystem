<template>
  <div>
    <b-container class="relative">
      <b-row class="d-flex justify-content-center">
        <b-col cols="12" lg="8">
          <div class="alert-container mt-2">
            <b-alert
              :show="alert.countdown"
              dismissible
              :variant="alert.color"
              @dismissed="alert.countdown = 0"
              @dismiss-count-down="alertCountDownChange"
            >
              <p>{{ $t('auth.register.response.' + alert.message) }}</p>
              <b-progress
                :variant="alert.color"
                :max="alert.maxCountdown"
                :value="alert.countdown"
                height="4px"
              ></b-progress>
            </b-alert>
          </div>
        </b-col>
        <b-col cols="12" lg="8" class="mt-5">
          <b-card no-body class="mt-5">
            <b-card-header header-bg-variant="dark" header-text-variant="white">
              {{ $t('auth.register.registerAnAccount') }}
            </b-card-header>
            <b-card-body>
              <b-form @submit.prevent="submit">
                <!-- 
                  Personal questions
                 -->
                <b-form-group :label="$t('auth.register.personalQuestions')">
                  <b-input-group>
                    <b-form-input
                      v-model="formData.firstName"
                      id="firstName"
                      :placeholder="$t('auth.register.firstName')"
                      type="text"
                      maxLength="128"
                      required
                    />
                    <b-form-input
                      v-model="formData.lastName"
                      id="lastName"
                      :placeholder="$t('auth.register.lastName')"
                      type="text"
                      maxLength="128"
                      required
                    />
                  </b-input-group>

                  <b-form-input
                    v-model="formData.email"
                    id="email"
                    class="mt-2"
                    :placeholder="$t('auth.register.email')"
                    type="email"
                    maxLength="320"
                    required
                  />

                  <b-form-datepicker
                    v-model="formData.age"
                    id="age"
                    class="mt-2"
                    :initial-date="generateInitialDate()"
                    :placeholder="$t('auth.register.age')"
                    required
                  />
                </b-form-group>

                <!-- 
                  Enter password
                 -->
                <b-form-group :label="$t('auth.register.passwordQuestions')">
                  <b-input-group>
                    <b-form-input
                      v-model="formData.password"
                      id="password"
                      :placeholder="$t('auth.register.password')"
                      type="password"
                      maxLength="128"
                      :state="
                        !formData.password
                          ? undefined
                          : formData.password === formData.repeatPassword
                      "
                      required
                    />
                    <b-form-input
                      v-model="formData.repeatPassword"
                      id="repeatPassword"
                      :placeholder="$t('auth.register.repeatPassword')"
                      type="password"
                      maxLength="128"
                      :state="
                        !formData.repeatPassword
                          ? undefined
                          : formData.password === formData.repeatPassword
                      "
                      required
                    />
                  </b-input-group>
                </b-form-group>

                <!-- 
                  Address
                 -->
                <b-form-group :label="$t('auth.register.addressQuestions')">
                  <b-input-group class="mb-2">
                    <b-form-input
                      v-model="formData.country"
                      id="country"
                      :placeholder="$t('auth.register.country')"
                      type="text"
                      maxLength="64"
                      required
                    />
                    <b-form-input
                      v-model="formData.state"
                      id="state"
                      :placeholder="$t('auth.register.state')"
                      type="text"
                      maxLength="64"
                      required
                    />
                    <b-form-input
                      v-model="formData.city"
                      id="city"
                      :placeholder="$t('auth.register.city')"
                      type="text"
                      maxLength="64"
                      required
                    />
                  </b-input-group>

                  <b-input-group>
                    <b-form-input
                      v-model="formData.zipCode"
                      id="zipCode"
                      :placeholder="$t('auth.register.zipCode')"
                      type="number"
                      maxLength="8"
                      required
                    />
                    <b-form-input
                      v-model="formData.street"
                      id="street"
                      :placeholder="$t('auth.register.street')"
                      type="text"
                      maxLength="128"
                      required
                    />
                    <b-form-input
                      v-model="formData.house"
                      id="house"
                      :placeholder="$t('auth.register.house')"
                      type="text"
                      maxLength="8"
                      required
                    />
                  </b-input-group>
                </b-form-group>

                <!-- 
                  Check legal
                 -->
                <b-form-checkbox
                  required
                  size="sm"
                  class="mb-3"
                  v-model="formData.checked"
                >
                  <div v-html="$t('auth.register.notice')" />
                </b-form-checkbox>

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
                  {{ $t('auth.register.register') }}
                </b-button>
              </b-form>
            </b-card-body>
            <b-card-footer>
              <p class="mb-0">
                {{ $t('auth.register.alreadyHaveAnAccount') }}

                <router-link to="/auth/login">
                  {{ $t('auth.register.login') }}
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
import * as moment from 'moment';
import {api} from '../../plugins/axios';
import {logger} from '../../plugins/winston';
import {AxiosError} from 'axios';
import {alertMixin, loginMixin} from '../../mixins/auth';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  password: string;
  repeatPassword: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  street: string;
  house: string;
  checked: boolean;
};

export default mixins(alertMixin, loginMixin).extend({
  name: 'Register',
  data: () => ({
    formData: {} as FormData,
    loading: false,
  }),
  methods: {
    async submit() {
      if (this.formData.password !== this.formData.repeatPassword) {
        return;
      }

      if (!this.formData.checked) {
        this.alert.countdown = this.alert.maxCountdown;
        this.alert.message = 'notChecked';
        this.alert.color = 'danger';
        return;
      }

      this.loading = true;

      const address =
        `${this.formData.country}, ` +
        `${this.formData.state}, ` +
        `${this.formData.zipCode} ` +
        `${this.formData.city}, ` +
        `${this.formData.street} ` +
        `${this.formData.house}`;

      const age = moment(this.formData.age).toISOString();

      try {
        const response = await api.post('/register', {
          email: this.formData.email,
          password: this.formData.password,
          first_name: this.formData.firstName,
          last_name: this.formData.lastName,
          age,
          address,
        });

        this.alert.color = 'success';
        this.alert.message = 'accountCreatedSuccessfully';
        logger.info(response);

        this.login(response.data);
      } catch (e) {
        this.alert.color = 'danger';
        switch ((e as AxiosError).response?.status) {
          case 409:
            this.alert.message = 'conflict';
            break;
          case 500:
            this.alert.message = 'internalServerError';
            break;
          default:
            this.alert.message = 'error';
        }
        logger.warn(e);
      }

      this.alert.countdown = this.alert.maxCountdown;
      this.loading = false;
    },
    generateInitialDate() {
      return moment()
        .subtract('18', 'years')
        .toDate();
    },
  },
});
</script>

<style lang="scss" scoped>
.relative {
  position: relative;

  .alert-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }
}
</style>
