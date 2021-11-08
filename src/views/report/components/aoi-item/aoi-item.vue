<template>
  <el-row
    :gutter="20"
    class="aoi-item">
    <el-col
      :span="24"
      border="solid">
      <el-divider />
      <h3 class="aoi-item-header">
        <span v-if="!trend">{{ agg.name }}</span>
        <span
          v-if="!trend"
          class="aoi-item-date">
          {{ date }}
        </span>
        <span v-else>{{ date }}</span>
      </h3>
    </el-col>
    <el-col
      :xs="24"
      :sm="6"
      :class="['average-table', extraClassForMiniMap]">
      <div v-if="predicted">
        <h4><b>{{ infoBlockData.mainClass }}</b></h4>
        <h3>{{ mostCommonDiscrete.category }}</h3>
        <h4>{{ mostCommonDiscrete.area.toFixed(2) }} ha | {{ mostCommonDiscrete.percentage }}%</h4>
        <br>
        <h4><b>{{ infoBlockData.totalArea }}</b></h4>
        <h3>{{ mostCommonDiscrete.totalArea }} ha</h3>
      </div>
      <div v-else>
        <h2>{{ agg.avg.toFixed(2) }}<span class="plusmn-std"> &plusmn; {{ agg.std.toFixed(2) }}</span></h2>
        <h4>{{ infoBlockData.dataRange }}</h4>
        <h4>{{ agg.min.toFixed(2) }} to {{ agg.max.toFixed(2) }}</h4>
      </div>
      <div class="button-area">
        <el-tooltip
          :visible-arrow="true"
          :open-delay="openDelay"
          content="Area Report"
          effect="dark"
          placement="bottom">
          <el-button
            v-if="report || predictedReport"
            icon="el-icon-document"
            size="mini"
            @click="goToReportArea">
            <span>{{ buttonName }}</span>
          </el-button>
        </el-tooltip>
      </div>
    </el-col>
    <el-col
      :xs="24"
      :sm="18"
      :class="['aoi-item-map', extraClassForMiniMap]">
      <l-map
        ref="map"
        :min-zoom="minZoomByTile"
        :max-zoom="maxZoomByTile"
        :options="mapOptions">
        <l-tile-layer
          url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png" />
        <l-tile-layer
          :tile-layer-class="tileLayerClass"
          :z-index="layersZindex"
          :url="url"
          :opacity="layerOpacity"
          :visible="true"
          @add="setOpacitySlider"/>
        <l-tile-layer
          v-if="agg.composite || $route.query.selectedMomentId"
          :tile-layer-class="tileLayerClass"
          :z-index="rgbLayerZindex"
          :url="rgbLayerUrl" />
        <l-polygon
          :lat-lngs="latlngs"
          :fill="false" />
      </l-map>
      <map-legend
        v-if="!predicted"
        :data="selectedFormulaLegend"
        :min="formula.minVal"
        :max="formula.maxVal"
        class="aoi-item-legend" />
    </el-col>
    <el-col
      :span="24">
      <el-collapse>
        <el-collapse-item
          v-if="predicted"
          title="Statistics">
          <statistics-table
            :data="statisticsTableData"
          />
        </el-collapse-item>
        <el-collapse-item title="Attributes">
          <attribute-table
            :data="attributeTableData"
          />
        </el-collapse-item>
      </el-collapse>
    </el-col>
  </el-row>
</template>

<script>
// Leaflet print option.
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LPolygon } from 'vue2-leaflet'
import leafletImage from '@/components/tsl-map/leaflet-image'
import 'element-ui/lib/theme-chalk/divider.css'
import 'element-ui/lib/theme-chalk/collapse.css'
import moment from 'moment'
import html2canvas from 'html2canvas'

import MapLegend from '@/components/map-legend/map-legend'
import '@/components/tsl-map/authenticated-tile-layer'
import { getColorsFromPallete } from '@/services/util'

import StatisticsTable from './statistics-table'
import AttributeTable from './attribute-table'

import { routeTypes } from '@/services/constants'
import { mapState } from 'vuex'

// Opacity slider.
import 'leaflet-range'
import 'leaflet-range/L.Control.Range.css'

export default {
  name: 'ReportAoiItem',
  components: {
    LMap,
    LPolygon,
    LTileLayer,
    MapLegend,
    StatisticsTable,
    AttributeTable
  },
  props: {
    agg: {
      type: Object,
      required: true
    },
    formula: {
      type: Object,
      required: false,
      default: null
    },
    trend: {
      type: Boolean,
      required: false,
      default: false
    },
    predictedLayer: {
      type: Object,
      required: false,
      default: null
    },
  },
  data() {
    return {
      mapOptions: {
        zoomControl: false,
        attributionControl: false,
        preferCanvas: true,
      },
      tileLayerClass: L.authenticatedTileLayer,
      canvasData: null,
      buttonName: 'Area Report',
      openDelay: 750,
      layerOpacity: 1,
      opacitySlider: null,
      layersZindex: 10,
      rgbLayerZindex: 9,
      minZoomByTile: 10,
      maxZoomByTile: 18,
      extraZoomIn: 2,
      extraZoomOut: 4,
      infoBlockData: {
        mainClass: 'Main Class',
        totalArea: 'Total Area',
        dataRange: 'Data Range',
      }
    }
  },
  computed: {
    ...mapState({
      rgbMiniMap: state => state.formula.rgbMiniMap,
      selectedMomentId: state => state.time.selectedMomentId,
    }),
    report(){
      return this.$route.name == routeTypes.REPORT
    },
    predictedReport(){
      return this.$route.name == routeTypes.REPORT_PREDICTED
    },
    predictedArea(){
      return this.$route.name == routeTypes.REPORT_PREDICTED_AREA
    },
    latlngs() {
      return this.agg.geom.coordinates[0][0].map(coord => [coord[1], coord[0]])
    },
    bounds(){
      return L.geoJson(this.agg.geom).getBounds()
    },
    url(){
      if(this.predicted) {
        return `${process.env.API_URL}predictedlayer/${this.predictedLayer.id}/{z}/{x}/{y}.png`
      } else {
        return `${process.env.API_URL}formula/${this.agg.formula}/composite/${this.agg.composite}/{z}/{x}/{y}.png`
      }
    },
    rgbLayerUrl(){
      const composite = this.predicted ? (this.selectedMomentId || this.$route.query.selectedMomentId) : this.agg.composite

      return `${process.env.API_URL}formula/${this.rgbMiniMap.id || this.$route.query.rgbMiniMapId}/composite/${composite}/{z}/{x}/{y}.png`
    },
    date(){
      const date = this.agg.min_date ? moment(this.agg.min_date).format('MMMM YYYY') : ''
      return date
    },
    selectedFormulaLegend () {
      if (this.formula) {
        const colors = getColorsFromPallete(this.formula)
        const legend = []
        colors.forEach(color => {
          legend.push({
            color
          })
        })

        return legend
      } else {
        return []
      }
    },
    predicted() {
      return Boolean(this.agg.predictedlayer)
    },
    statisticsTableData() {
      const that = this
      return this.predictedLayer.legend.map((entry) => {
        // Get value for this legend entry.
        const aggEntry = entry['expression'] in that.agg.value ? that.agg.value[entry['expression']] : 0
        const aggEntryPercentage = entry['expression'] in that.agg.value_percentage ? that.agg.value_percentage[entry['expression']] : 0
        // Create row data.
        return {
          'color': entry['color'],
          'category': entry['name'],
          'area': (aggEntry).toFixed(1),
          'percentage': (parseFloat(aggEntryPercentage) * 100).toFixed(1),
        }
      })
    },
    attributeTableData() {
      return Object.entries(this.agg.attributes).map(dat => {
        return {
          attribute: dat[0],
          value: dat[1]
        }
      });
    },
    mostCommonDiscrete(){
      const that = this
      let result
      this.predictedLayer.legend.forEach(dat => {
        const candidate = {
          category: dat['name'],
          area: dat['expression'] in that.agg.value ? that.agg.value[dat['expression']] : 0,
          percentage: dat['expression'] in that.agg.value_percentage ? parseInt(parseFloat(that.agg.value_percentage[dat['expression']]) * 100) : 0,
          totalArea: Object.values(that.agg.value).reduce((acc, cur) => acc + cur, 0).toFixed(2)
        }
        if (!result || candidate.area > result.area) {
          result = candidate
        }
      })
      return result
    },
    extraClassForMiniMap() {
      return this.report || this.predictedArea ? 'report-or-area' : 'predicted-report'
    }
  },
  watch: {
    agg(){
      if(this.$refs.map){
        this.$refs.map.mapObject.fitBounds(this.bounds.pad(0.025))
        this.$refs.map.mapObject.setMaxBounds(this.bounds.pad(0.025))
      }
    }
  },
  mounted() {
    if(this.$refs.map){
      this.$refs.map.mapObject.fitBounds(this.bounds.pad(0.025))
      this.$refs.map.mapObject.setMaxBounds(this.bounds.pad(0.025))
      this.defineZoomForMiniMaps()
    }
  },
  methods: {
    getCanvas(){
      const that = this
      html2canvas(document.querySelector('.aoi-item-legend')).then(legendCanvas => {
        leafletImage(this.$refs.map.mapObject, function(err, canvas) {
          that.canvasData = {
            map: canvas,
            legend: legendCanvas,
            name: that.agg.name,
            date: that.date,
            avg: that.agg.avg.toFixed(2),
            std: that.agg.std.toFixed(2),
            min: that.agg.min.toFixed(2),
            max: that.agg.max.toFixed(2),
          }
          that.$emit('printed')
        })
      })
    },
    goToReportArea() {
      if(this.predictedReport) {
        this.$router.push({
            name: routeTypes.REPORT_PREDICTED_AREA,
            params: {
              layer: this.agg.aggregationlayer,
              predictedLayer: this.predictedLayer.id,
              area: this.agg.aggregationarea
            }
          })
      } else {
        this.$router.push({
          name: routeTypes.REPORT_AREA,
          params: {
            layer: this.agg.aggregationlayer,
            formula: this.agg.formula,
            area: this.agg.aggregationarea,
          }
        })
      }
    },
    setOpacitySlider() {
      const setOpacity = this.agg.composite || this.selectedMomentId || this.$route.query.selectedMomentId

      // Opacity will be defined only if there is RGB composite
      if(setOpacity) {
        if (this.opacitySlider !== null) {
          this.$refs.map.mapObject.removeControl(this.opacitySlider)
        }
        // Instantiate opacity control.
        this.opacitySlider = L.control.range({
          position: 'topright',
          min: 0,
          max: 1,
          value: this.layerOpacity,
          step: 0.1,
          orient: 'vertical',
          iconClass: 'leaflet-range-icon'
        })
        // Bind slider change route update function.
        const that = this
        this.opacitySlider.on('input change', function(e) {
          // Update actual opacity value
          that.layerOpacity = parseFloat(e.value)
        })

        this.$refs.map.mapObject.addControl(this.opacitySlider)
      }
    },
    // Setting zoom in and zoom out from default zoom
    defineZoomForMiniMaps() {
      const areaZoom = this.$refs.map.mapObject.getZoom()

      const minZoom = areaZoom - this.extraZoomOut
      const maxZoom = areaZoom + this.extraZoomIn

      // Validation of the maximum and minimum possible zoom values
      this.minZoomByTile = minZoom <= 0 ? 0 : minZoom
      this.maxZoomByTile = maxZoom >= 18 ? 18 : maxZoom
    }
  }
}
</script>

<style lang="scss" scoped>
.aoi-item-map {
  &.report-or-area {
    height: 200px;
  }

  &.predicted-report {
    height: 220px;
  }
}
.aoi-item-date {
  float: right;
}
.aoi-item-table {
  width: 100%;
}
.average-table {
  &.report-or-area {
    margin-top: 30px;
  }

  &.predicted-report {
    margin-top: 10px;
  }
}
.plusmn-std {
  font-size: 14px;
}
h3 {
  margin-bottom: 5px;
}
h4 {
  font-size: 17px;

  b {
    font-weight: 500;
  }
}
.map-legend-wrapper {
  position: relative;
  right : 3px;
  top: -43px;
  padding: 3px;
  width: 80px;
  font-weight: 400;
  color: rgb(96, 98, 102);
  float: right;
  >.map-legend {
    height: 15px !important;
  }
}
@media print {
  .aoi-item {
    page-break-before: always;
  }
}
.el-collapse {
  margin-top: 10px;
}
.button-area {
  margin-top: 25px;
  margin-bottom: 10px;
}
/deep/ .leaflet-range-control {
  position: static;

  &.vertical{
    width: 28px;
    height: 139px;
    padding-top: 3px;
    margin-right: 3px;
  }

  input[type=range][orient=vertical] {
    height: 99px;
  }

  .leaflet-range-icon {
    background-position: 0px;
  }
}
</style>