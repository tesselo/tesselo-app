<template>
  <div>
    <tsl-button
      class="logout-button"
      title="Logout"
      @click="logout" />
    <div class="menu">
      <panel-selector
        title="Areas"
        @click="openAreas"
        icon="crosshair" />
      <panel-selector 
        title="Layers"
        @click="openLayers"
        icon="layers" />
    </div>
    <div class="panel"></div>
    <tsl-map />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { actionTypes } from '@/services/constants'

import TslMap from '@/components/tsl-map/tsl-map'
import TslButton from '@/components/tsl-button/tsl-button'
import PanelSelector from '@/components/panel-selector/panel-selector'

export default {
  name: 'Home',
  components: {
    TslMap,
    TslButton,
    PanelSelector
  },
  head: {
    title: {
      inner: 'Homepage'
    }
  },
  methods: {
    ...mapActions('auth', {
      logout: actionTypes.AUTH_LOGOUT
    }),
    openAreas() {
      console.log('olá')
    },
    openLayers() {
      console.log('olé')
    }
  }
}
</script>
<style lang="scss" scoped>
  .logout-button {
    position: absolute;
    top: 20px;
    left: 25px;
    z-index: z('content');
  }

  .menu {
    position: absolute;
    top: 60px;
    left: 25px;
    z-index: z('content');
  }
</style>
