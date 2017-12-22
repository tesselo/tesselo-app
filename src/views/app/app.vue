<template>
  <div>
    <tsl-header/>
    <router-view/>
  </div>
</template>

<script>
import TslHeader from '@/components/tsl-header/tsl-header';

export default {
  name: 'App',
  components: {
    TslHeader
  }
}
</script>
<style lang="scss">
</style>
