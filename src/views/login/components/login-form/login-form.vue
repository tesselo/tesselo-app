<template>
  <form class="tsl-form">
    <Form >
        <tsl-input
          v-model="username"
          name="username"
          type="text"
          value="'username'"
          label="Username"
          placeholder="Your username"/>
      <Field
        v-slot="{ errors }"
        name="password"
        rules="required|min:6">
        <tsl-input
          v-model="password"
          name="password"
          type="password"
          value="'password'"
          label="Password"
          placeholder="Enter your password"/>
        <span class="tsl-form__control-error">{{ errors[0] }}</span>
      </Field>
      <div class="row">
        <div class="col-12 d-flex flex-row justify-content-end">
          <tsl-button
            :loading="loading"
            type="button"
            title="Login"
            class="login-button"
            @click="submitForm"/>
        </div>
      </div>
    </Form>
    <div class="row">
      <div class="col-12 d-flex flex-row justify-content-end">
        <p
          v-for="error in formErrors.nonFieldErrors"
          :key="error"
          class="tsl-form__control-error text-end">
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

import errorHandler from '@/utils/errorHandler'

import { Form, Field} from 'vee-validate'

export default {
  name: 'LoginForm',
  components: {
    TslInput,
    TslButton,
    Form,
    Field
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

  methods: {
    ...mapActions('auth', {
      login: actionTypes.AUTH_LOGIN
    }),
    submitForm: function() {
      this.loading = true

      this.formErrors = {
        nonFieldErrors: null
      }
      

      this.login({
        username: this.username,
        password: this.password
      })
      .then(() => {
        this.loading = false
        this.$router.push({ name: 'Home' }).catch(errorHandler.routerError)
      })
      .catch(errors => {
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
