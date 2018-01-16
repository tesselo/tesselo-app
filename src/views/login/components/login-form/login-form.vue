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
      <span slot="error">
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
      <span slot="error">
        {{ errors.first('password') }}
      </span>
    </tsl-input>
    <div class="row">
      <div class="col-12 d-flex flex-row justify-content-end button-wrapper">
        <tsl-button
          type="button"
          title="Login"
          :disabled="fields.username.invalid || fields.password.invalid"
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
      username: 'pixelmatters',
      password: 'make sentinel pixels matter',
      loading: false,
      formErrors: {
        nonFieldErrors: null
      }
    }
  },
  methods: {
    ...mapActions('auth', {
      login: actionTypes.AUTH_LOGIN
    }),
    submitForm: function() {
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
  .button-wrapper {
    margin-top: 30px;
  }
</style>

