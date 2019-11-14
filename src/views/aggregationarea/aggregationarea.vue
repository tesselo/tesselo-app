<template>
  <el-row class="aggregation-area-container">
    <el-col
      :xs="{span: 22, offset: 1}"
      :sm="{span: 20, offset: 2}"
      :md="{span: 16, offset: 4}"
      :lg="{span: 12, offset: 6}">
      <el-row>
        <h2>
          <span v-if="list">Select Aggregation Area</span>
          <span v-if="edit && selectedArea">Edit Aggregation Area {{ selectedArea.id }}</span>
          <span v-if="edit && !selectedArea"><i class="el-icon-loading" /></span>
          <span v-if="create">Create New Aggregation Area</span>
          <el-button
            class="button-right"
            icon="el-icon-back"
            size="small"
            @click="goBack"/>
          <el-button
            v-if="list"
            class="button-right"
            icon="el-icon-circle-plus-outline"
            title="Create new aggregationlayer"
            size="small"
            @click="createNew" />
        </h2>
        <AggregationAreasTable
          v-if="list"
          :aggregation-layer="aggregationLayer"
          @select="areaSelect"/>
      </el-row>
      <el-row v-if="!list">
        <el-alert
          v-for="msg in msgs"
          :key="msg.key"
          :title="msg.title"
          :type="msg.type"
          :center="true"/>
      </el-row>
      <el-row v-if="!list">
        <el-form
          :model="form">
          <ValidationObserver v-slot="{ valid }">
            <el-form-item label="Name">
              <ValidationProvider
                v-slot="{ errors }"
                name="name"
                rules="required">
                <el-input v-model="form.name" />
                <span>{{ errors[0] }}</span>
              </ValidationProvider>
            </el-form-item>
            <el-form-item label="Geometry">
              <l-map
                ref="map"
                class="lmap"
                @ready="mapReady">
                <l-tile-layer :url="url" />
                <l-geo-json
                  ref="geom"
                  :geojson="geojson"
                  @ready="geomLayerReady"/>
              </l-map>
              <ValidationProvider
                v-slot="{ errors }"
                name="name"
                rules="required">
                <el-input v-model="form.geom" />
                <span>{{ errors[0] }}</span>
              </ValidationProvider>
            </el-form-item>
            <el-form-item label="AggregationLayer">
              <ValidationProvider
                v-slot="{ errors }"
                name="name"
                rules="required">
                <el-input
                  v-model="form.aggregationlayer"
                  :readonly="true" />
                <span>{{ errors[0] }}</span>
              </ValidationProvider>
            </el-form-item>
            <el-form-item label="Attributes">
              <el-input v-model="form.attributes" />
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="loading"
                :disabled="!valid"
                type="primary"
                class="button-right"
                @click="onSubmit">
                Save
              </el-button>
            </el-form-item>
          </ValidationObserver>
        </el-form>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import L from 'leaflet'
import { mapActions, mapState } from 'vuex'
import { LMap, LTileLayer, LGeoJson, LFeatureGroup } from 'vue2-leaflet'
import { parse, stringify } from 'wellknown'

import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'

import 'element-ui/lib/theme-chalk/form.css'
import 'element-ui/lib/theme-chalk/button.css'
import 'element-ui/lib/theme-chalk/alert.css'


import AggregationAreasTable from '@/components/aggregation-areas-table/aggregation-areas-table'
import { actionTypes, routeTypes } from '@/services/constants'


export default {
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
    LFeatureGroup,
    AggregationAreasTable
  },
  data(){
    return {
      form: {
        name: '',
        geom: '',
        aggregationlayer: this.aggregationLayer,
        attributes: '{}'
      },
      loading: false,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      geojson: null,
      drawControl: null,
      error: null,
      success: false,
      alertCenter: true,
      msgs: []
    }
  },
  computed: {
    ...mapState({
      selectedArea: state => state.aggregationArea.selectedAggregationArea
    }),
    aggregationLayer(){
      return parseInt(this.$route.params.layer)
    },
    list(){
      return this.$route.name == routeTypes.AGGREGATION_AREA_LIST
    },
    edit(){
      return this.$route.name == routeTypes.AGGREGATION_AREA_EDIT
    },
    create(){
      return this.$route.name == routeTypes.AGGREGATION_AREA_CREATE
    }
  },
  watch: {
    selectedArea(dat){
      this.areaSelect(dat)
    }
  },
  mounted() {
    if (this.create) {
      this.form.aggregationlayer = this.$route.params.layer
    }
    if(this.edit){
      this.getAggregationAreaIDAction(this.$route.params.area)
    }
  },
  methods: {
    ...mapActions('aggregationArea', {
      getAggregationAreaIDAction: actionTypes.AGGREGATION_AREA_GET_ID,
      editAggregationAreaAction: actionTypes.AGGREGATION_AREA_EDIT,
      createAggregationAreaAction: actionTypes.AGGREGATION_AREA_SAVE,
      resetAggregationAreaAction: actionTypes.AGGREGATION_AREA_RESET
    }),
    mapReady(){
      // Fit map to bounds.
      if (this.geojson) {
        this.$refs.map.mapObject.fitBounds(L.geoJson(this.geojson).getBounds().pad(0.1))
      }
      // Hook map draw edit events into api.
      const tat = this
      this.$refs.map.mapObject.on(L.Draw.Event.EDITED, (e) => {
        e.layers.eachLayer(function (layer) {
          tat.geomUpdate(layer._latlngs)
        })
      })
      this.$refs.map.mapObject.on(L.Draw.Event.CREATED, (e) => {
        tat.geomUpdate(e.layer._latlngs)
      })
      this.$refs.map.mapObject.on(L.Draw.Event.DELETED, () => {
        tat.form.geom = ''
      })
    },
    geomLayerReady(){
      // Make geom editable.
      this.drawControl = new L.Control.Draw({
        position: 'topright',
        edit: {
          featureGroup: this.$refs.geom.mapObject
        },
        draw: {
          polygon: true,
          marker: false,
          circle: false,
          circlemarker: false,
          polyline: false,
          rectangle: false
        }
      }).addTo(this.$refs.map.mapObject)
    },
    goBack(){
      if(this.list) {
        this.$router.push({name: routeTypes.AGGREGATION_LAYER_EDIT, params: {layer: this.aggregationLayer}})
      } else {
        this.$router.push({name: routeTypes.AGGREGATION_AREA_LIST, params: {layer: this.aggregationLayer}})
      }
    },
    createNew(){
      // Clear form.
      this.form = {
        name: '',
        geom: '',
        aggregationlayer: this.aggregationLayer,
        attributes: '{}'
      }
      this.geojson = null
      this.resetAggregationAreaAction()
      this.$router.push({name: routeTypes.AGGREGATION_AREA_CREATE})
    },
    geomUpdate(latlngs){
      // Update geojson.
      this.geojson = {
        "type": "FeatureCollection",
        "features": [L.polygon(latlngs).toGeoJSON()]
      }
      // Update form.
      const reprojected_coords = this.geojson.features[0].geometry.coordinates[0].map(coords => {
        var projected = L.Projection.SphericalMercator.project(L.latLng(coords[1], coords[0]))
        return [projected.x, projected.y]
      })
      // Create wkt multipolygon from reprojected coordinates.
      const reprojected_wkt = stringify({
        "type": "MultiPolygon",
        "coordinates": [[ reprojected_coords ]]
      })
      // Update form with geojson.
      this.form.geom = `SRID=3857;${reprojected_wkt}`
    },
    areaSelect(dat){
      // Transform Web mercator WKT to WGS84. Only get first polygon from
      // multipolygon.
      const coordinates = parse(dat.geom).coordinates[0][0].map(coords => {
        const projected = L.Projection.SphericalMercator.unproject(L.point(coords))
        return [projected.lng, projected.lat]
      })

      // Set geojson attribute.
      this.geojson = {
        "type": "FeatureCollection",
        "features": [{
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [coordinates]
          }
        }]
      }

      // Fit map to bounds.
      if (this.$refs.map) {
        this.$refs.map.mapObject.fitBounds(L.geoJson(this.geojson).getBounds().pad(0.1))
      }

      // Set form data.
      this.form = {
        name: dat.name,
        geom: dat.geom,
        aggregationlayer: dat.aggregationlayer,
        attributes: JSON.stringify(dat.attributes)
      }

      // Push route if necessary.
      if (this.$route.name != routeTypes.AGGREGATION_AREA_EDIT) {
        this.$router.push({name: routeTypes.AGGREGATION_AREA_EDIT, params: {layer: this.aggregationLayer, area: dat.id}})
      }
    },
    onSubmit(){
      // Set loading state and clear form errors.
      this.loading = true
      this.error = null

      // Prepare action function variable and call api.
      let funk
      if (this.selectedArea) {
        // Update existing aggregationlayer.
        funk = this.editAggregationAreaAction({id: this.selectedArea.id, ...this.form, attributes: JSON.parse(this.form.attributes)})
      } else {
        // Create new aggregationlayer.
        funk = this.createAggregationAreaAction({...this.form, attributes: JSON.parse(this.form.attributes)})
      }

      // Add success and error hooks.
      funk.then(() => {
        this.loading = false
        this.msgs.push({
          title: "Saved area successfully.",
          type: "success",
          key: this.msgs.length + 1
        })
      })
      .catch(() => {
        this.loading = false
        this.error = true
        this.msgs.push({
          title: "Failed saving area.",
          type: "error",
          key: this.msgs.length + 1
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.aggregation-area-container {
  padding-top: 50px;
}
.button-right {
  float: right;
  margin-left: 5px;
}
.lmap {
  height: 400px;
  margin-bottom: 10px;
}
.el-alert {
  margin-top: 5px;
}
</style>
