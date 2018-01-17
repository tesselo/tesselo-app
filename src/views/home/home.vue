<template>
  <div>
    <tsl-button
      class="logout-button"
      title="Logout"
      @click="logout" />
    <div class="menu">
      <multi-option-toggle
        ref="panelSelector"
        :items="menuItems" />
    </div>
    <div class="panel" />
    <tsl-map />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { actionTypes } from '@/services/constants'

import TslMap from '@/components/tsl-map/tsl-map'
import TslButton from '@/components/tsl-button/tsl-button'
import MultiOptionToggle from '@/components/multi-option-toggle/multi-option-toggle'

export default {
  name: 'Home',
  components: {
    TslMap,
    TslButton,
    MultiOptionToggle
  },
  data() {
    return {
      menuItems: [
        {
          title: 'Areas',
          icon: 'crosshair'
        }, {
          title: 'Layers',
          icon: 'layers'
        }
      ]
    }
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
      console.log('openAreas')
    },
    openLayers() {
      console.log('openLayers')
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
    top: 65px;
    left: 25px;
    z-index: z('content');
  }
</style>
