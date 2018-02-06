<template>
  <div>
    <img
      src="/static/logo/logo-simple.svg"
      alt="Tesselo Logo"
      class="logo">
    <div class="menu">
      <multi-option-toggle
        ref="panelSelector"
        :items="mainMenu"
        @change="changeVisiblePanel" />
    </div>
    <div class="report-menu">
      <multi-option-toggle
        :items="reportMenu"
        @change="reportMenuClick" />
    </div>
    <div class="panels-wrapper">
      <panel
        v-if="activePanel === 'areas'"
        title="Areas"
        @close="closeAllPanels()">
        <areas-table
          @select="areasTableSelect"
          slot="content" />
      </panel>
      <panel
        v-if="activePanel === 'layers'"
        title="Layers"
        @close="closeAllPanels()">
        <layers-table
          @select="layersTableSelect"
          slot="content" />
      </panel>
      <panel
        v-if="activePanel === 'multiple-report'"
        title="Multiple Region Report"
        @close="closeAllPanels()">
        <multiple-report slot="content" />
      </panel>
      <panel
        v-if="activePanel === 'report-history'"
        title="Report History"
        @close="closeAllPanels()">
        <report-history
          slot="content"
          @select="selectReport"/>
      </panel>
    </div>
    <div
      class="selector-time-dimension-pannel"
      v-if="selectedLayer">
      <collapsible-panel
        @toggle="toggleSTDPanel"
        :open="stdPanelVisible">
        <selector-time-dimension
          :show-picker="stdPanelVisible"
          :active-year="activeYear"
          @year-change="setActiveYear"/>
      </collapsible-panel>
    </div>
    <tsl-map />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { actionTypes } from '@/services/constants'

import TslMap from '@/components/tsl-map/tsl-map'
import TslButton from '@/components/tsl-button/tsl-button'
import MultiOptionToggle from '@/components/multi-option-toggle/multi-option-toggle'
import Panel from '@/components/panel/panel'
import AreasTable from '@/components/areas-table/areas-table'
import LayersTable from '@/components/layers-table/layers-table'
import CollapsiblePanel from '@/components/collapsible-panel/collapsible-panel'
import SelectorTimeDimension from '@/components/selector-time-dimension/selector-time-dimension'
import MultipleReport from '@/components/multiple-report/multiple-report'
import ReportHistory from '@/components/report-history/report-history'

export default {
  name: 'Home',
  components: {
    TslMap,
    TslButton,
    MultiOptionToggle,
    Panel,
    AreasTable,
    LayersTable,
    CollapsiblePanel,
    SelectorTimeDimension,
    MultipleReport,
    ReportHistory
  },
  data() {
    return {
      loggingOut: false,
      mainMenu: [
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
      reportMenu: [
        {
          title: 'Export to PDF',
          icon: 'pdf',
          key: 'export-pdf',
          selected: false,
          hide: true
        }, {
          title: 'Save Report',
          icon: 'save',
          key: 'save-report',
          selected: false,
          hide: true
        }, {
          title: 'Report History',
          icon: 'report',
          key: 'report-history',
          selected: false,
          hide: false
        }, {
          title: 'Create Report',
          icon: 'report',
          key: 'create-report',
          selected: false
        }
      ],
      activePanel: '',
      stdPanelVisible: false,
      activeYear: 2018
    }
  },
  head: {
    title: {
      inner: 'Homepage'
    }
  },
  computed: {
    ...mapState({
      selectedLayer: state => state.aggregationLayer.selectedLayer,
      selectedFormula: state => state.formula.selectedFormula
    })
  },
  methods: {
    ...mapActions('report', {
      saveReport: actionTypes.REPORT_SAVE_MULTIPLE_REGION
    }),
    closeAllPanels() {
      this.activePanel = ''
      this.$refs.panelSelector.unsetActive()
      this.hideReportButtons()
    },
    changeVisiblePanel(activePanel) {
      this.closeAllPanels()
      this.stdPanelVisible = false
      this.activePanel = activePanel
    },
    areasTableSelect(area) {
      this.closeAllPanels()
      this.mainMenu = this.mainMenu.map((item) => {
        if (item.key === 'areas') {
          item.selected = true
          item.title = area.name
        }

        return item
      })
    },
    layersTableSelect(layer) {
      this.closeAllPanels()

      this.mainMenu = this.mainMenu.map((item) => {
        if (item.key === 'layers') {
          item.selected = true
          item.title = layer.acronym
        }

        return item
      })
      this.hideReportButtons()
    },
    toggleSTDPanel() {
      this.stdPanelVisible = !this.stdPanelVisible
      this.closeAllPanels()
    },
    reportMenuClick(key) {
      this.stdPanelVisible = false
      this.$refs.panelSelector.unsetActive()

      switch (key) {
        case 'create-report':
          this.activePanel = 'multiple-report'
          this.showReportButtons()
          break
        case 'save-report':
          this.saveReport()
          break
        case 'report-history':
          this.openReportHistory()
          break
      }
    },
    showReportButtons() {
      this.reportMenu = this.reportMenu.map(item => ({
        ...item,
        hide: false,
        selected: false
      }))
    },
    hideReportButtons() {
      this.reportMenu = this.reportMenu.map(item => ({
        ...item,
        hide: !(item.key === 'create-report' || item.key === 'report-history'),
        selected: false
      }))
    },
    openReportHistory() {
      this.activePanel = 'report-history'
    },
    selectReport(report) {
      this.activeYear = report.moment.year

      this.activePanel = 'multiple-report'
      this.mainMenu = this.mainMenu.map((item) => {
        item.selected = true
        if (item.key === 'areas') {
          item.title = report.layer.name
        }
        if (item.key === 'layers') {
          item.title = report.formula.name
        }

        return item
      })
    },
    setActiveYear(newVal) {
      this.activeYear = newVal
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
    top: 50px;
    left: 25px;
    z-index: z('content');
  }

  .report-menu {
    position: absolute;
    bottom: 40px;
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
  
  .selector-time-dimension-pannel {
    position: absolute;
    bottom: 40px;
    left: 240px;
    z-index: z('content');
  }
</style>
