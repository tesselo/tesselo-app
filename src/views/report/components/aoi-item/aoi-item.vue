<template>
  <el-row :gutter="20">
    <el-col
      :span="24"
      border="solid">
      <el-divider />
      <h3>{{ agg.name }}</h3>
    </el-col>
    <el-col
      :sm="24"
      :md="8">
      <el-table
        :data="tableData"
        :size="size"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="Name" />
        <el-table-column
          prop="value"
          label="Value" />
      </el-table>
    </el-col>
    <el-col
      :sm="24"
      :md="16"
      class="aoi-map">
      <l-map
        ref="map"
        :options="mapOptions">
        <l-tile-layer
          url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png" />
        <l-tile-layer
          :tile-layer-class="tileLayerClass"
          :url="url" />
        <l-polygon
          :lat-lngs="latlngs" />
      </l-map>
    </el-col>
  </el-row>
</template>

<script>
import L from 'leaflet'
import { LMap, LTileLayer, LPolygon } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'
import '@/components/tsl-map/authenticated-tile-layer'
import 'element-ui/lib/theme-chalk/divider.css'

export default {
  name: 'ReportAoiItem',
  components: {
    LMap,
    LPolygon,
    LTileLayer
  },
  props: {
    agg: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      mapOptions: {
        zoomControl: false,
        attributionControl: false,
      },
      polygonColor: 'red',
      size: "mini",
      tileLayerClass: L.authenticatedTileLayer
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
      return `${process.env.API_URL}formula/${this.agg.formula}/composite/${this.agg.composite}/{z}/{x}/{y}.png`
    },
    tableData(){
      return [
        {name: 'Average', value: this.agg.avg.toFixed(2)},
        {name: 'Std', value: this.agg.std.toFixed(2)},
        {name: 'Min', value: this.agg.min.toFixed(2)},
        {name: 'Max', value: this.agg.max.toFixed(2)}
      ]
    }
  },
  watch: {
    agg(){
      this.$refs.map.mapObject.fitBounds(this.bounds.pad(0.1))
    }
  },
  mounted() {
    this.$refs.map.mapObject.fitBounds(this.bounds.pad(0.1))
  },
}
</script>

<style lang="scss" scoped>
.aoi-item {
  padding-bottom: 20px;
}
.aoi-map {
  height: 200px;
}
.el-row {
  &:last-child {
    margin-bottom: 24px;
  }
}
h3 {
  margin-bottom: 10px;
}
</style>
