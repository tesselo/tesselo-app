<template>
  <form
    data-vv-scope="login"
    class="tsl-form">

    <div class="tsl-form__control">
      <label
        for="email"
        class="tsl-form__label">
        E-mail Address
      </label>
      <input
        :v-model="email"
        name="email"
        v-validate="'required|email'"
        type="email"
        placeholder="Your e-mail"
        :class="{'tsl-form__input': true, 'tsl-form__input--error': errors.has('login.email') }">
      <div
        v-show="errors.has('login.email')"
        class="tsl-form__control-error">
        {{ errors.first('login.email') }}
      </div>
    </div>

    <div class="tsl-form__control">
      <label
        for="password"
        class="tsl-form__label">
        Password
      </label>
      <input
        :v-model="password"
        name="password"
        v-validate="'required'"
        type="password"
        placeholder="Enter your password"
        :class="{'tsl-form__input': true, 'tsl-form__input--error': errors.has('login.password') }">
      <div
        v-show="errors.has('login.password')"
        class="tsl-form__control-error">
        {{ errors.first('login.password') }}
      </div>
    </div>
    <div class="row">
      <div class="col-12 d-flex flex-row justify-content-end button-wrapper">
        <tsl-button
          type="submit"
          title="Login"
        />
      </div>
    </div>
  </form>
</template>
<script>
import TslButton from '@/components/tsl-button/tsl-button'

export default {
  name: 'LoginForm',
  components: {
    TslButton
  },
  data: function() {
    return {
      email: '',
      password: ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .button-wrapper {
    margin-top: 30px;
  }
</style>

