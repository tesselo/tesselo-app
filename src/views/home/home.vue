<template>
  <div>
    <tsl-button
      class="logout-button"
      title="Logout"
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
        @close="closePanel('areas')" />
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
import AreasTable from '@/components/areas-table/areas-table'
import loginFormVue from '../login/components/login-form/login-form.vue';

export default {
  name: 'Home',
  components: {
    TslMap,
    TslButton,
    MultiOptionToggle,
    Panel,
    AreasTable
  },
  data() {
    return {
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
      logout: actionTypes.AUTH_LOGOUT
    }),
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
