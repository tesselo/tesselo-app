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
      class="average-table">
      <div v-if="discrete">
        <h4>Main class</h4>
        <h3>{{ mostCommonDiscrete.category }}</h3>
        <h4>{{ mostCommonDiscrete.percentage }}% | {{ mostCommonDiscrete.area.toFixed(2) }} ha</h4>
      </div>
      <div v-else>
        <h2>{{ agg.avg.toFixed(2) }}<span class="plusmn-std"> &plusmn; {{ agg.std.toFixed(2) }}</span></h2>
        <h4>Data Range</h4>
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
            v-if="report"
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
      class="aoi-item-map">
      <l-map
        ref="map"
        :min-zoom="13"
        :max-zoom="18"
        :options="mapOptions">
        <l-tile-layer
          url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png" />
        <l-tile-layer
          :tile-layer-class="tileLayerClass"
          :z-index="layersZindex"
          :url="url"
          :opacity="lOpacity"
          :visible="true"
          @add="setOpacitySlider"/>
        <l-tile-layer
          :tile-layer-class="tileLayerClass"
          :z-index="rgbLayerZindex"
          :url="rgbLayerUrl" />
        <l-polygon
          :lat-lngs="latlngs"
          :fill="false" />
      </l-map>
      <map-legend
        v-if="!discrete"
        :data="selectedFormulaLegend"
        :min="formula.minVal"
        :max="formula.maxVal"
        class="aoi-item-legend" />
    </el-col>
    <el-col
      :span="24">
      <el-collapse>
        <el-collapse-item
          v-if="discrete"
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
    report: {
      type: Boolean,
      required: false,
      default: false
    }
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
      lOpacity: 1,
      opacitySlider: null,
      layersZindex: 10,
      rgbLayerZindex: 9,
    }
  },
  computed: {
    latlngs() {
      return this.agg.geom.coordinates[0][0].map(coord => [coord[1], coord[0]])
    },
    bounds(){
      return L.geoJson(this.agg.geom).getBounds()
    },
    url(){
      if(this.discrete) {
        return `${process.env.API_URL}predictedlayer/${this.predictedLayer.id}/{z}/{x}/{y}.png`
      } else {
        return `${process.env.API_URL}formula/${this.agg.formula}/composite/${this.agg.composite}/{z}/{x}/{y}.png`
      }
    },
    rgbLayerUrl(){
      return `${process.env.API_URL}formula/826/composite/${this.agg.composite}/{z}/{x}/{y}.png`
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
    discrete() {
      return Boolean(this.agg.predictedlayer)
    },
    statisticsTableData() {
      const tat = this
      return this.predictedLayer.legend.map((entry) => {
        // Get value for this legend entry.
        const aggEntry = entry['expression'] in tat.agg.value ? tat.agg.value[entry['expression']] : 0
        const aggEntryPercentage = entry['expression'] in tat.agg.value_percentage ? tat.agg.value_percentage[entry['expression']] : 0
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
      const tat = this
      let result
      this.predictedLayer.legend.forEach(dat => {
        const candidate = {
          category: dat['name'],
          area: dat['expression'] in tat.agg.value ? tat.agg.value[dat['expression']] : 0,
          percentage: dat['expression'] in tat.agg.value_percentage ? parseInt(parseFloat(tat.agg.value_percentage[dat['expression']]) * 100) : 0,
        }
        if (!result || candidate.area > result.area) {
          result = candidate
        }
      })
      return result
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
    }
  },
  methods: {
    getCanvas(){
      const tat = this
      html2canvas(document.querySelector('.aoi-item-legend')).then(legendCanvas => {
        leafletImage(this.$refs.map.mapObject, function(err, canvas) {
          tat.canvasData = {
            map: canvas,
            legend: legendCanvas,
            name: tat.agg.name,
            date: tat.date,
            avg: tat.agg.avg.toFixed(2),
            std: tat.agg.std.toFixed(2),
            min: tat.agg.min.toFixed(2),
            max: tat.agg.max.toFixed(2),
          }
          tat.$emit('printed')
        })
      })
    },
    goToReportArea() {
      this.$router.push({
          name: routeTypes.REPORT_AREA,
          params: {
            layer: this.agg.aggregationlayer,
            formula: this.agg.formula,
            area: this.agg.aggregationarea,
          }
        })
    },
    setOpacitySlider() {
      if (this.opacitySlider !== null) {
        this.$refs.map.mapObject.removeControl(this.opacitySlider)
      }
      // Instantiate opacity control.
      this.opacitySlider = L.control.range({
        position: 'topright',
        min: 0,
        max: 1,
        value: this.lOpacity,
        step: 0.1,
        orient: 'vertical',
        iconClass: 'leaflet-range-icon'
      })
      // Bind slider change route update function.
      const tat = this
      this.opacitySlider.on('input change', function(e) {
        // Update actual opacity value
        tat.lOpacity = parseFloat(e.value)
      })

      this.$refs.map.mapObject.addControl(this.opacitySlider)
    },
  }
}
</script>

<style lang="scss" scoped>
.aoi-item-map {
  height: 200px;
}
.aoi-item-date {
  float: right;
}
.aoi-item-table {
  width: 100%;
}
.average-table {
  margin-top: 30px;
}
.plusmn-std {
  font-size: 14px;
}
h3 {
  margin-bottom: 10px;
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
}
/deep/ .leaflet-range-control {
  border: 2px solid rgba(0,0,0,0.2);
  margin-right: 3px;
  position: initial;

  &.vertical{
    width: 28px;
    height: 139px;
    padding-top: 3px;
  }

  input[type=range][orient=vertical] {
    height: 99px;
  }

  .leaflet-range-icon {
    background-position: 0px;
  }
}
</style>
