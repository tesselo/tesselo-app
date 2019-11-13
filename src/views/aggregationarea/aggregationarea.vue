<template>
  <el-row class="aggregation-area-container">
    <el-col
      :xs="{span: 22, offset: 1}"
      :sm="{span: 20, offset: 2}"
      :md="{span: 16, offset: 4}"
      :lg="{span: 12, offset: 6}">
      <el-row v-if="list">
        <h2>
          Select Aggregation Layer
          <el-button
            class="button-right"
            icon="el-icon-circle-plus-outline"
            title="Create new aggregationlayer"
            @click="createNew" />
        </h2>
        <AggregationAreasTable
          :aggregation-layer="aggregationLayer"
          @select="areaSelect"/>
      </el-row>
      <el-row>
        <h2>
          <span v-if="edit && selectedArea">Edit Aggregation Area {{ selectedArea.id }}</span>
          <span v-if="create">Create New Aggregation Area</span>
          <el-button
            v-if="!list"
            class="button-right"
            icon="el-icon-back"
            @click="goBack"/>
        </h2>
      </el-row>
      <el-row v-if="!list">
        <el-form :model="form">
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
                class="lmap">
                <l-tile-layer :url="url" />
                <l-geo-json
                  ref="geom"
                  :geojson="geojson" />
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
              <el-input v-model="form.aggregationlayer" />
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
import { stringify } from 'wellknown'
import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'

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
        aggregationlayer: '',
        attibutes: {}
      },
      loading: false,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      geojson: null,
      drawControl: null
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
    if(this.edit){
      console.log('getting area id', this.$route.params.area)
      this.getAggregationAreaIDAction(this.$route.params.area)
    }

    // Hook map draw edit events into api.
    if (!this.list) {
      const tat = this
      this.$refs.map.mapObject.on(L.Draw.Event.EDITED, function (e) {
        var layers = e.layers
        layers.eachLayer(function (layer) {
          tat.geomUpdate(layer._latlngs)
        })
      })
      this.$refs.map.mapObject.on(L.Draw.Event.CREATED, function (e) {
        var layers = e.layers
        layers.eachLayer(function (layer) {
          tat.geomUpdate(layer._latlngs)
        })
      })
    }

    // Create draw control here if this is a new feature.
    if (this.create) {
      this.drawControl = new L.Control.Draw({
        position: 'topright',
        edit: false,
        draw: {
          polygon: true,
          marker: false,
          circle: false,
          circlemarker: false,
          polyline: false,
          rectangle: false
        }
      }).addTo(this.$refs.map.mapObject)
    }
  },
  methods: {
    ...mapActions('aggregationArea', {
      getAggregationAreaIDAction: actionTypes.AGGREGATION_AREA_GET_ID,
    }),
    goBack(){
      this.$router.go(-1)
    },
    createNew(){
      console.log('creating new')
    },
    onSubmit(){
      console.log('submitting form')
    },
    geomUpdate(latlngs){
      // Update geojson.
      this.geojson.features = [L.polygon(latlngs).toGeoJSON()]
      // Update form.
      this.form.geom = `SRID=4326;${stringify(this.geojson.features[0].geometry)}`
    },
    areaSelect(dat){
      // Deactivate current draw control if it exists.
      if (this.drawControl) {
        this.drawControl.removeFrom(this.$refs.geom.mapObject)
      }

      // Set geojson attribute.
      this.geojson = {
        "type": "FeatureCollection",
        "features": [{
          "type": "Feature",
          "geometry": dat.geom
        }]
      }

      // Fit map to bounds.
      this.$refs.map.mapObject.fitBounds(L.geoJson(this.geojson).getBounds())

      // Set form data.
      this.form = {
        name: dat.name,
        geom: `SRID=4326;${stringify(dat.geom)}`,
        aggregationlayer: dat.aggregationlayer,
        attributes: JSON.stringify(dat.attributes)
      }

      // Make geom editable.
      this.drawControl = new L.Control.Draw({
        position: 'topright',
        edit: {
          featureGroup: this.$refs.geom.mapObject
        },
        draw: false
      }).addTo(this.$refs.map.mapObject)

      // Push route if necessary.
      if (this.$route.name != routeTypes.AGGREGATION_AREA_EDIT) {
        this.$router.push({name: routeTypes.AGGREGATION_AREA_EDIT, params: {layer: this.aggregationLayer, area: dat.id}})
      }
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
}
.lmap {
  height: 400px;
  margin-bottom: 10px;
}
</style>
