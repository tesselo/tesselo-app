<template>
  <nav class="container">
    <div class="row d-flex flex-row justify-content-end align-items-center">
      <p>Don't have an account?</p>
      <tsl-button
        type="button"
        title="Get started"
        theme="slight-transparent"
      />
    </div>
  </nav>
</template>
<script>
import TslButton from '@/components/tsl-button/tsl-button'

export default {
  name: 'LoginHeader',
  components: {
    TslButton
  }
}
</script>
<style lang="scss" scoped>
  nav {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  .container {
    padding-top: 50px;
  }

  p {
    font-size: 14px;
    color: white;
    font-weight: 300;
    margin-right: 28px;
  }
</style>
