<template>
  <div>
    <tsl-map />
    <tsl-header />
    <router-view/>
  </div>
</template>

<script>
import TslHeader from '@/components/tsl-header/tsl-header';
import TslMap from '@/components/tsl-map/tsl-map';

export default {
  name: 'App',
  components: {
    TslHeader,
    TslMap
  }
}
</script>
<style lang="scss">
</style>
