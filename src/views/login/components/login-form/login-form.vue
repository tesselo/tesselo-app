<template>
  <form class="tsl-form">
    <tsl-input
      name="username"
      type="text"
      v-model="username"
      v-validate="'required'"
      label="E-mail Address"
      placeholder="Your e-mail"
    >
      <span slot="error">
        {{ errors.first('username') }}
      </span>
    </tsl-input>

    <tsl-input
      name="password"
      type="password"
      v-model="password"
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
          v-if="!loading"
          type="submit"
          title="Login"
          :disabled="fields.username.invalid || fields.password.invalid"
          @click="submitForm"
        />
        <p v-if="loading">LOADING</p>
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
      username: '',
      password: '',
      loading: false
    }
  },
  methods: {
    ...mapActions('auth', {
      login: actionTypes.AUTH_LOGIN
    }),
    submitForm: function() {
      this.loading = true
      this.login({
        username: this.username,
        password: this.password
      })
      .then(() => {
        this.loading = false
      })
      .catch((errors) => {
        console.log('reason', errors)
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

