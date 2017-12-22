<template>
  <div>
    <pixel-header/>
    <router-view/>
  </div>
</template>

<script>
import PixelHeader from '@/components/pixel-header/pixel-header';

export default {
  name: 'App',
  components: {
    PixelHeader
  }
}
</script>
<style lang="scss">
</style>
