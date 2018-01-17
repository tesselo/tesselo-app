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
    <div class="panels-wrapper">
      <panel
        title="Areas"
        @close="closePanel('areas')">
        <div slot="content">
          <h1>CONTENT</h1>
          <h1>CONTENT</h1>
          <h1>CONTENT</h1>
          <h1>CONTENT</h1>
          <h1>CONTENT</h1>
          <h1>CONTENT</h1>
        </div>
      </panel>
    </div>
    <tsl-map />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { actionTypes } from '@/services/constants'

import TslMap from '@/components/tsl-map/tsl-map'
import TslButton from '@/components/tsl-button/tsl-button'
import MultiOptionToggle from '@/components/multi-option-toggle/multi-option-toggle'
import Panel from '@/components/panel/panel'

export default {
  name: 'Home',
  components: {
    TslMap,
    TslButton,
    MultiOptionToggle,
    Panel
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
    closePanel(panel) {
      console.log(panel)
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
  .panels-wrapper {
    position: absolute;
    top: 69px;
    left: 200px;
    z-index: z('content');
  }
</style>
