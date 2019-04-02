<template>
  <div>
    <img
      :src="logoSimpleUrl"
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
    <div
      v-if="activePanel"
      class="panels-wrapper">
      <panel
        v-if="activePanel === 'areas'"
        title="Areas"
        @close="closeAllPanels()">
        <areas-table
          slot="content"
          @select="areasTableSelect"
        />
      </panel>
      <panel
        v-if="activePanel === 'layers'"
        title="Layers"
        @close="closeAllPanels()">
        <layers-table
          slot="content"
          @select="layersTableSelect"
        />
      </panel>
      <panel
        v-if="activePanel === 'multiple-report'"
        title="Multiple Region Report"
        @close="closeAllPanels()">
        <multiple-report
          slot="content"
          :is-new-report="isNewReport" />
      </panel>
      <panel
        v-if="activePanel === 'report-history'"
        title="Report History"
        @close="closeAllPanels()">
        <report-history
          slot="content"
          @select="selectReport"/>
      </panel>
      <panel
        v-if="activePanel === 'predicted'"
        title="Predicted Layers"
        @close="closeAllPanels()">
        <predicted-layers-table
          slot="content"
          @select="predictedLayersTableSelect"
        />
      </panel>
    </div>
    <div
      v-if="selectedLayer"
      class="selector-time-dimension-pannel"
    >
      <collapsible-panel
        :open="stdPanelVisible"
        @toggle="toggleSTDPanel"
      >
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
import PredictedLayersTable from '@/components/predicted-layers-table/predicted-layers-table'

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
    ReportHistory,
    PredictedLayersTable
  },
  data() {
    return {
      loggingOut: false,
      firstLoad:true,
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
        },
        {
          title: 'Predicted',
          icon: 'net',
          key: 'predicted',
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
          selected: false,
          hide: true
        }
      ],
      activePanel: '',
      stdPanelVisible: false,
      activeYear: (new Date()).getFullYear(),
      isNewReport: false,
      logoSimpleUrl: process.env.ASSETS_PUBLIC_PATH + 'static/logo/logo-simple.svg'
    }
  },
  head: {
    title: {
      inner: 'Homepage'
    }
  },
  computed: {
    ...mapState({
      aggregationLayer: state => state.aggregationLayer,
      formulaRows: state => state.formula,
      predictedLayer: state => state.predictedLayer,
      predictedLayerRows: state => state.predictedLayer.rows,
      selectedLayer: state => state.aggregationLayer.selectedLayer,
      selectedFormula: state => state.formula.selectedFormula,
      selectedPredictedLayer: state => state.predictedLayer.selectedLayer
    })
  },
  watch: {
    '$route.query': {
      immediate: true,
      handler(){
        const query = this.$route.query
        if (query.area && this.firstLoad == true) {
          this.getAggregationLayerID(query.area)
        }
        if(query.layer && this.firstLoad == true){
          this.getFormulaID(query.layer)
        }
        if(query.selectedYear && this.firstLoad == true){
          this.activeYear= parseInt(query.selectedYear)
        }
        if(query.predictedlayer && this.firstLoad == true){
          this.getPredictedLayerID(query.predictedlayer)
        }
        this.firstLoad = false
      },
    },
  },
  methods: {
    ...mapActions('aggregationLayer', {
      getAggregationLayersAction: actionTypes.AGGREGATION_LAYER_GET,
      getAggregationLayerIDAction: actionTypes.AGGREGATION_LAYER_GET_ID,
      selectAggregationLayer: actionTypes.AGGREGATION_LAYER_SELECT
    }),

    ...mapActions('formula', {
      getFormulasAction: actionTypes.FORMULA_GET,
      getFormulaIDAction: actionTypes.FORMULA_GET_ID,
      selectFormula: actionTypes.FORMULA_SELECT
    }),

    ...mapActions('predictedLayer', {
      getPredictedLayersAction: actionTypes.PREDICTED_LAYER_GET,
      getPredictedLayersIDAction: actionTypes.PREDICTED_LAYER_GET_ID,
      selectPredictedLayer: actionTypes.PREDICTED_LAYER_SELECT,
      resetPredictedLayer: actionTypes.RESET
    }),

    ...mapActions('report', {
      saveReport: actionTypes.REPORT_SAVE_MULTIPLE_REGION
    }),

    ...mapActions('map', {
      setMapBounds: actionTypes.MAP_SET_BOUNDS
    }),


    getAggregationLayerID(options){
       this.getAggregationLayerIDAction(options)
        .then(() => {
          this.selectBookmarkArea()
        })
    },

    /**
     * Get rows from first page (formular/layer) and select first
     */
    getFormulaID(options) {
      this.getFormulaIDAction(options)
        .then(() => {
          this.selectBookmarkLayer()
        })
    },

    /**
     * Get rows from first page (formular/layer) and select first
     */
    getPredictedLayerID(options) {
      this.getPredictedLayersIDAction(options)
        .then(() => {
          this.selectBookmarkPredictedLayer()
        })
    },

    /**
     * Select bookmark/URL Area
     */
     selectBookmarkArea() {
      const area = this.aggregationLayer.row
      if(area){
        this.selectAggregationLayer(area)
        this.setMapBounds(area.bounds)
        this.areasTableSelect(area)
      }
    },

    /**
     * Select bookmark/URL layer
     */
     selectBookmarkLayer() {
      const formula = this.formulaRows.row
      if(formula){
        this.selectFormula(formula)
        this.layersTableSelect(formula)
      }
    },

    /**
     * Select bookmark/URL layer
     */
     selectBookmarkPredictedLayer() {
      const predictedLayer = this.predictedLayer.row
      if(predictedLayer) {
          this.selectPredictedLayer(predictedLayer)
          this.predictedLayersTableSelect(predictedLayer)
      }
    },

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
    predictedLayersTableSelect(layer) {
      this.closeAllPanels()

      this.mainMenu = this.mainMenu.map((item) => {
        if (item.key === 'predicted') {
          if (layer) {
            item.selected = true
            item.title = layer.nameToShow
          } else {
            item.selected = false
            item.title = 'Predicted'
          }
        }
        return item
      })
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
          this.isNewReport = true

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
    updateReportButtons() {
      this.reportMenu = this.reportMenu.map(item => {
        let hide = false
        if (item.key === 'create-report' && !this.selectedLayer && !this.selectedFormula) {
          hide = true
        }

        return {
          ...item,
          hide
        }
      })
    },
    showReportButtons() {
      this.reportMenu = this.reportMenu.map(item => ({
        ...item,
        hide: false,
        selected: false
      }))
    },
    hideReportButtons() {
      this.reportMenu = this.reportMenu.map(item => {
        let hide = true

        if (item.key === 'report-history') {
          hide = false
        }

        if (item.key === 'create-report' && this.selectedFormula && this.selectedLayer) {
          hide = false
        }

        return {
          ...item,
          hide,
          selected: false
        }
      })
    },
    openReportHistory() {
      this.activePanel = 'report-history'
    },
    selectReport(report) {
      this.isNewReport = false

      this.activeYear = parseInt(report.moment.year, 10)

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
      this.activeYear = parseInt(newVal, 10)
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
    z-index: z('content');
    right: 5px;
    bottom: 65px;
    @media (min-width: 768px) {
      bottom: 40px;
      left: 25px;
      right: inherit;
    }
  }

  .panels-wrapper {
    position: absolute;
    overflow: auto;
    z-index: z('panels');
    width: 100%;
    height: 100%;
    @media (min-width: 768px) {
      top: 54px;
      left: 200px;
      width: auto;
      height: auto;
      margin: 0px;
      max-height: calc(100vh - 204px);
      border-radius: 2px;
    }
    .panel {
      height: 100%;
    }
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
    z-index: z('content');
    bottom: 0px;
    left: 0px;
    @media (min-width: 768px) {
      bottom: 40px;
      left: 240px;
    }
  }
</style>
