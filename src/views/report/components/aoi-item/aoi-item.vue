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
      <h2>{{ agg.avg.toFixed(2) }}<span class="plusmn-std"> &plusmn; {{ agg.std.toFixed(2) }}</span></h2>
      <h4>Data Range</h4>
      <h4>{{ agg.min.toFixed(2) }} to {{ agg.max.toFixed(2) }}</h4>
    </el-col>
    <el-col
      :xs="24"
      :sm="18"
      class="aoi-item-map">
      <l-map
        ref="map"
        :options="mapOptions">
        <l-tile-layer
          url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png" />
        <l-tile-layer
          :tile-layer-class="tileLayerClass"
          :url="url" />
        <l-polygon
          :lat-lngs="latlngs"
          :fill="false" />
      </l-map>
      <map-legend
        v-if="formula"
        :data="selectedFormulaLegend"
        :min="formula.minVal"
        :max="formula.maxVal"
        class="aoi-item-legend" />
    </el-col>
    <el-col
      :span="24">
      <el-collapse>
        <el-collapse-item title="Attributes">
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="category"
              label="Category"
              width="180"/>
            <el-table-column
              prop="area"
              label="Area [ha]"/>
          </el-table>
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


export default {
  name: 'ReportAoiItem',
  components: {
    LMap,
    LPolygon,
    LTileLayer,
    MapLegend
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
      canvasData: null
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
      if(this.agg.predictedlayer) {
        return `${process.env.API_URL}tile/${this.agg.predictedlayer_rasterlayer}/{z}/{x}/{y}.png`
      } else {
        return `${process.env.API_URL}formula/${this.agg.formula}/composite/${this.agg.composite}/{z}/{x}/{y}.png`
      }
    },
    date(){
      return moment(this.agg.min_date).format('MMMM YYYY')
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
    tableData() {
      const ACRES_TO_HA = 0.404686
      return Object.entries(this.agg.value).map((entry) => {
        return {"category": entry[0], "area": (entry[1] * ACRES_TO_HA).toFixed(1)}
      })
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
    }
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
  position: absolute;
  right : 13px;
  bottom: 3px;
  padding: 3px;
  width: 80px;
  font-weight: 400;
  color: rgb(96, 98, 102);
  >.map-legend {
    height: 15px !important;
  }
}
@media print {
  .aoi-item {
    page-break-before: always;
  }
}
</style>
