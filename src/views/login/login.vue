<template>
  <div class="login">
    <div class="content">
      <login-header v-if="showHeader"/>
      <div class="container">
        <div class="row d-flex flex-md-row justify-content-center">
          <div class="col-4">
            <h1>Login</h1>
            <h4>Login to Tesselo, enter your details below.</h4>
            <login-form class="login-form" />
          </div>
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
      showHeader: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .login {
    position: relative;

    min-width: 100vw;
    min-height: 100vh;
    background-image: url(/static/background/map.jpg);
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
  }

  .content {
    position: relative;
    z-index: z('content');
    padding-top: 151px;
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
