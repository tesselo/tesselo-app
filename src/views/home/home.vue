<template>
  <div class="fixed-container">
    <div
      v-if="isTouch">
      <img
        :src="logoSimpleUrl"
        alt="Tesselo Logo"
        class="logo">
      <div class="contol-menu">
        <p
          class ="control-menu-text"
          @click="showControls=!showControls">
          <span v-if="!showControls">Show Controls
            <img
              :src="combinedShapeOff"
              alt=""
              class="contol-menu-icon">
          </span>
          <span v-if="showControls">Hide Controls
            <img
              :src="combinedShapeOn"
              alt=""
              class="contol-menu-icon">
          </span>
        </p>
      </div>
    </div>
    <div
      v-if="showControls"
      class="menu">
      <multi-option-toggle
        ref="panelSelector"
        :is-touch="isTouch"
        :items="mainMenu"
        @change="changeVisiblePanel" />
    </div>
    <div
      v-if="showControls"
      class="report-menu">
      <report-menu
        v-if="isTouch"
        :items="reportMenu"
        @change="reportMenuClick" />
      <multi-option-toggle
        v-if="!isTouch"
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
        title="Reports"
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
      v-if="selectedLayer && showControls"
      class="selector-time-dimension-pannel">
      <collapsible-panel
        :open="stdPanelVisible"
        @toggle="toggleSTDPanel">
        <selector-time-dimension
          :show-picker="stdPanelVisible"
          :active-year="activeYear"
          @year-change="setActiveYear"/>
      </collapsible-panel>
    </div>
    <tsl-map
      :show-controls="showControls"/>
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
import ReportMenu from '@/components/report-menu/report-menu'

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
    PredictedLayersTable,
    ReportMenu
  },
  data() {
    return {
      loggingOut: false,
      showControls: true,
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
      logoSimpleUrl: process.env.ASSETS_PUBLIC_PATH + 'static/logo/logo-simple.svg',
      combinedShapeOn: process.env.ASSETS_PUBLIC_PATH + 'static/icons/combined-shape-on.svg',
      combinedShapeOff: process.env.ASSETS_PUBLIC_PATH + 'static/icons/combined-shape-off.svg'
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
      predictedLayerRows: state => state.predictedLayer,
      selectedLayer: state => state.aggregationLayer.selectedLayer,
      selectedFormula: state => state.formula.selectedFormula,
      selectedPredictedLayer: state => state.predictedLayer.selectedLayer
    }),
    isPhone() {
      return this.$deviceInfo.isPhone;
    },
    isTouch() {
      return this.$deviceInfo.isTouch;
    },
  },

  watch: {
    '$route.query': {
      immediate: true,
      handler(){
        const query = this.$route.query
        if(query.area && this.firstLoad == true){
          this.getAggregationLayer({page:null, area: query.area})
        } else if(this.firstLoad == true) {
          this.getAggregationLayer({page: 1, area:null})
        }
        if(query.layer && this.firstLoad == true){
          this.getFormulas({page: null, layer: query.layer})
        } else if(this.firstLoad == true) {
          this.getFormulas({page: 1, layer:null})
        }
        if(query.predictedlayer && this.firstLoad == true){
         this.getPredictedLayers({page: null, layer:query.predictedlayer})
        } else if(this.firstLoad == true) {
          this.getPredictedLayers({ page: 1, layer:null})
        }
        if(query.selectedYear && this.firstLoad == true){
          this.activeYear= parseInt(query.selectedYear)
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

    /**
     * Get aggregation areas from action
     *
     * @param options
     */
    getAggregationLayer(options){
      if(options.area){
        this.getAggregationLayerIDAction(options.area)
        .then(() => {
          this.selectArea('urlId')
        })
      }else if(options.page){
        this.getAggregationLayersAction(options)
        .then(() => {
          this.selectArea('default')
        })
      }
    },
    /**
     * Select area and set map bounds
     *
     * @param action
     */
    selectArea(action) {
      let area = null
      action=='default'
        ? (area = this.aggregationLayer.rows[0])
        : (area = this.aggregationLayer.row)

      if(area){
        this.selectAggregationLayer(area)
        this.setMapBounds(area.bounds)
        this.areasTableSelect(area)
      }
    },

    /**
     * Get rows from first page (formular/layer) and select first
     */
    getFormulas(options) {
      if(options.layer){
        this.getFormulaIDAction(options.layer)
        .then(() => {
          this.selectLayer('urlId')
        })
      }else if(options.page){
        this.getFormulasAction(options)
        .then(() => {
          this.selectLayer('default')
        })
      }
    },
    /**
      * Select layer
      */
    selectLayer(action) {
      let formula = null
      action=='default'
        ? (formula = this.formulaRows.rows[0])
        : (formula = this.formulaRows.row)
      if(formula){
        this.selectFormula(formula)
        this.layersTableSelect(formula)
      }
    },
    /**
     * Get rows from first page (predicted layer) and select first
     */
    getPredictedLayers(options) {
      if(options.layer){
          this.getPredictedLayersIDAction(options.layer)
        .then(() => {
          this.selectLayerPredicted('urlId')
        })
      }else if(options.page){
        this.getPredictedLayersAction(options)
        .then(() => {
          this.selectLayerPredicted('default')
        })
      }
    },

    /**
     * Select predicted layer
     */
     selectLayerPredicted(action) {
      let predictedLayer = null
      if(action=='default') {
        if(predictedLayer && this.selectedLayer && predictedLayer.id === this.selectedLayer.id) {
          predictedLayer = this.predictedLayerRows.rows[0]
        }
      } else {
        predictedLayer = this.predictedLayerRows.row
      }
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
      this.resetPredictedLayer()

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
  .fixed-container {
    position: absolute;
    display: inline-block;
    width: 100%;
    height: 100%;

    @media (min-width: 768px) {
      overflow: hidden;
    }
  }

  .contol-menu {
    position: relative;
    align-content: center;
    margin-left: auto;
    margin-right: auto;
    z-index: 100;
    width: 139.2px;
    height: 32px;
    border-radius: 25px;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1), inset 0 0 4px 0 black;
    background-color: #001931;
    vertical-align: middle;
    text-align: center;

    &::before,
    &::after {
      position: absolute;
      top: -9px;
      width: 20px;
      height: 30px;
      transform: rotate(-31deg);
      background-color: #001931;
      content: '';
      z-index: 0;
    }

    &::before {
      left: -3px;
    }

    &::after {
      right: -3px;
      transform: rotate(31deg);
    }
  }

  .control-menu-text {
    position: relative;
    display: inline-block;
    margin: 7px 0 0;
    text-overflow: ellipsis;
    font-size: 12px;
    line-height: 17px;
    color: #fff;
  }

  .contol-menu-icon {
    position: relative;
    z-index: 1;
  }

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
    overflow: hidden;
  }

  .report-menu {
    position: absolute;
    right: 5px;
    bottom: 65px;
    overflow: hidden;

    @media (min-width: 768px) {
      bottom: 40px;
      left: 25px;
      right: inherit;
    }
  }

  .panels-wrapper {
    position: absolute;
    overflow-y: scroll;
    z-index: z('panels');
    width: 100%;
    height: 100%;
    top: 0;

    @media (min-width: 768px) {
      top: 54px;
      left: 200px;
      width: auto;
      height: auto;
      margin: 0;
      max-height: calc(100% - 204px);
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
    bottom: 0;
    left: 0;

    @media (min-width: 768px) {
      bottom: 40px;
      left: 240px;
    }
  }
</style>
