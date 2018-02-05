<template>
  <form class="tsl-form">
    <tsl-input
      name="username"
      type="text"
      v-model="username"
      value="'username'"
      v-validate="'required'"
      label="Username"
      placeholder="Your username"
    >
      <span
        slot="error"
        v-if="usernameFlags.touched">
        {{ errors.first('username') }}
      </span>
    </tsl-input>

    <tsl-input
      name="password"
      type="password"
      v-model="password"
      value="'password'"
      v-validate="'required|min:6'"
      label="Password"
      placeholder="Enter your password"
    >
      <span
        slot="error"
        v-if="passwordFlags.touched">
        {{ errors.first('password') }}
      </span>
    </tsl-input>
    <div class="row">
      <div class="col-12 d-flex flex-row justify-content-end">
        <tsl-button
          type="button"
          title="Login"
          class="login-button"
          :disabled="usernameFlags.invalid || passwordFlags.invalid"
          :loading="loading"
          @click="submitForm"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-12 d-flex flex-row justify-content-end">
        <p
          class="tsl-form__control-error text-right"
          :key="error"
          v-for="error in formErrors.nonFieldErrors">
          {{ error }}
        </p>
      </div>
    </div>
    
  </form>
</template>

<script>
import { mapFields } from 'vee-validate'
import { mapActions } from 'vuex'
import { actionTypes } from '@/services/constants'

import TslInput from '@/components/tsl-input/tsl-input'
import TslButton from '@/components/tsl-button/tsl-button'

export default {
  name: 'LoginForm',
  components: {
    TslInput,
    TslButton
  },
  data: function() {
    return {
      username: '',
      password: '',
      loading: false,
      formErrors: {
        nonFieldErrors: null
      }
    }
  },
  computed: mapFields({
    usernameFlags: 'username',
    passwordFlags: 'password'
  }),
  methods: {
    ...mapActions('auth', {
      login: actionTypes.AUTH_LOGIN
    }),
    submitForm: function() {
      console.log('submitForm', this.username, this.password, this.login)

      this.loading = true

      this.formErrors = { // todo create cleanFormErrors mixin for form components
        nonFieldErrors: null
      }

      this.login({
        username: this.username,
        password: this.password
      })
      .then(() => {
        this.loading = false
        this.$router.push({ name: 'Home' })
      })
      .catch((errors) => {
        this.loading = false
        this.formErrors = errors
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .login-button {
    margin-top: 30px;
    margin-bottom: 10px;
  }
</style>

