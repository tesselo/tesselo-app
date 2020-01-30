<template>
  <div
    :style="{backgroundImage: backgroundImage}"
    class="login"
  >
    <div class="content">
      <login-header v-if="showHeader"/>
      <div class="container">
        <div class="col-lg-4 offset-lg-4">
          <h1>Login</h1>
          <h4>Login to Tesselo, enter your details below.</h4>
          <login-form class="login-form" />
          <h4><a href="https://api.tesselo.com/accounts/password_reset/">Forgot password?</a></h4>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LoginHeader from './components/login-header/login-header'
import LoginForm from './components/login-form/login-form'

export default {
  name: 'Login',
  components: {
    LoginHeader,
    LoginForm
  },
  data: function() {
    return {
      showHeader: false,
      backgroundImage: "url(" + process.env.ASSETS_PUBLIC_PATH + "static/background/map.jpg)"
    }
  }
}
</script>

<style lang="scss" scoped>
  .login {
    position: relative;
    min-width: 100%;
    min-height: 100%;
    background-size: cover;
    background-repeat: no-repeat;

    &::after {
      @include pseudoElementSetup;

      top: 0;
      left: 0;
      z-index: z('default');
      width: 100%;
      height: 100%;
      background-color: rgba($navy, 0.5);
    }
    a {
      color: white;
      text-decoration: none;
    }
  }

  .content {
    position: relative;
    z-index: z('content');
    padding-top: 10%;
  }

  h1,
  h4 {
    color: white;
  }

  h4 {
    margin-top: 10px;
    color: white;
  }

  .login-form {
    margin-top: 40px;
  }
</style>
