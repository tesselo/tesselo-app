<template>
  <div>
    <img
      src="/static/logo/logo-simple.svg"
      alt="Tesselo Logo"
      class="logo">
    <tsl-button
      class="logout-button"
      title="Logout"
      :loading="loggingOut"
      @click="logout" />
    <div class="menu">
      <multi-option-toggle
        ref="panelSelector"
        :items="menuItems"
        @change="changeVisiblePanel" />
    </div>
    <div class="panels-wrapper">
      <panel
        v-if="activePanel === 'areas'"
        title="Areas"
        @close="closePanel('areas')">
        <areas-table
          @select="areasTableSelect"
          slot="content" />
      </panel>
      <panel
        v-if="activePanel === 'layers'"
        title="Layers"
        @close="closePanel('areas')">
        <layers-table
          @select="layersTableSelect"
          slot="content" />
      </panel>
    </div>
    <tsl-map />
  </div>
</template>

<script>
// import router from '@/services/router'
import { mapActions } from 'vuex'
import { actionTypes } from '@/services/constants'

import TslMap from '@/components/tsl-map/tsl-map'
import TslButton from '@/components/tsl-button/tsl-button'
import MultiOptionToggle from '@/components/multi-option-toggle/multi-option-toggle'
import Panel from '@/components/panel/panel'
import AreasTable from '@/components/areas-table/areas-table'
import LayersTable from '@/components/layers-table/layers-table'

export default {
  name: 'Home',
  components: {
    TslMap,
    TslButton,
    MultiOptionToggle,
    Panel,
    AreasTable,
    LayersTable
  },
  data() {
    return {
      loggingOut: false,
      menuItems: [
        {
          title: 'Areas',
          icon: 'crosshair',
          key: 'areas',
          selected: false
        }, {
          title: 'Layers',
          icon: 'layers',
          key: 'layers',
          selected: false
        }
      ],
      activePanel: ''
    }
  },
  head: {
    title: {
      inner: 'Homepage'
    }
  },
  methods: {
    ...mapActions('auth', {
      logoutAction: actionTypes.AUTH_LOGOUT
    }),
    logout() {
      this.loggingOut = true
      this.logoutAction({})
        .then(() => {
          console.log('after logout', this)
          this.$router.push({ name: 'Login' })
        })
    },
    closePanel() {
      this.activePanel = ''
      this.$refs.panelSelector.unsetActive()
    },
    changeVisiblePanel(activePanel) {
      this.activePanel = activePanel
    },
    areasTableSelect(area) {
      this.closePanel()
      this.menuItems = this.menuItems.map((item) => {
        if (item.key === 'areas') {
          item.selected = true
          item.title = area.name
        }

        return item
      })
    },
    layersTableSelect(layer) {
      this.closePanel()

      this.menuItems = this.menuItems.map((item) => {
        if (item.key === 'layers') {
          item.selected = true
          item.title = layer.name
        }

        return item
      })
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
    max-height: 80vh;
    overflow: auto;
  }

  .logo {
    position: absolute;
    top: 20px;
    right: 10px;
    width: 100px;
    z-index: z('content');
  }
</style>
