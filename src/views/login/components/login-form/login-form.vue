<template>
  <form class="tsl-form">
    <tsl-input
      name="email"
      type="email"
      v-model="email"
      v-validate="'required|email'"
    >
      <span slot="error">
        {{ errors.first('email') }}
      </span>
    </tsl-input>
    <tsl-input
      name="password"
      type="password"
      v-model="password"
      v-validate="'required|min:6'"
    >
      <span slot="error">
        {{ errors.first('password') }}
      </span>
    </tsl-input>
    <div class="row">
      <div class="col-12 d-flex flex-row justify-content-end button-wrapper">
        <tsl-button
          type="submit"
          title="Login"
          :disabled="fields.email.invalid || fields.password.invalid"
          @click="submitForm"
        />
      </div>
    </div>
  </form>
</template>
<script>
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
      email: '',
      password: ''
    }
  },
  methods: {
    submitForm: function() {
      console.log('submit form', this.email, this.password) // todo: call login action
    }
  }
}
</script>

<style lang="scss" scoped>
  .button-wrapper {
    margin-top: 30px;
  }
</style>

