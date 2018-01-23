<template>
  <div class="tsl-map">
    <Map
      ref="map"
      :zoom="10"
      :center="[41.1471288,-8.6116238]">
      <tile-layer url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png" />
      <v-protobuf
        v-if="selectedLayer && selectedLayer.id"
        :url="vectorUrl"
        :options="mapOptions" />
    </map>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import Leaflet from 'leaflet'
import { Map, TileLayer } from 'vue2-leaflet'
import attachHomeControl from './lib/leaflet.home'
import Vue2LeafletVectorGridProtobuf from 'vue2-leaflet-vectorgrid'

import 'leaflet-control-geocoder'
import 'leaflet-control-geocoder/dist/Control.Geocoder.css'

import store from '@/services/store'
import endpoints from '@/data/api/api.endpoints'
import { polygonStyle } from './vector-style'



export default {
  name: 'TslMap',
  components: {
    Map,
    TileLayer,
    'v-protobuf': Vue2LeafletVectorGridProtobuf
  },
  computed: {
    ...mapState('map', {
      bounds: state => state.bounds
    }),
    ...mapState('aggregationLayer', {
      selectedLayer: state => state.selectedLayer
    }),
    ...mapState('auth', {
      token: state => state.token,
      authenticated: state => state.authenticated
    }),
    mapOptions: function() {
      const layerStyle = {
        [this.selectedLayer.name]: polygonStyle
      }

      const options = { 
        rendererFactory: Leaflet.canvas.tile,
        vectorTileLayerStyles: layerStyle,
        zIndex: 99999
      }

      if (this.authenticated) {
        options.fetchOptions = {
          headers: new Headers({
            'authorization': 'Token ' + store.getters['auth/token']
          })
        }
      }

      return options
    },
    vectorUrl() {
      return endpoints.map.vector(this.selectedLayer.id)
    }
  },
  watch: {
    bounds: {
      handler (newBounds) {
        this.moveToBounds([
          [newBounds.xmin, newBounds.ymin],
          [newBounds.xmax, newBounds.ymax]
        ]);
      }
    }
  },
  mounted: function() {
    Leaflet.Control.geocoder().addTo(this.$refs.map.mapObject)

    const searchLayer = Leaflet.layerGroup().addTo(this.$refs.map.mapObject)
    this.$refs.map.mapObject.addControl(searchLayer)

    attachHomeControl(Leaflet)

    const homeControl = new Leaflet.Control.Home({
      map: this.$refs.map.mapObject
    })

    this.$refs.map.mapObject.addControl(homeControl)

    this.$refs.map.mapObject.zoomControl.remove()
    Leaflet.control.zoom({ position:'topright' }).addTo(this.$refs.map.mapObject)
  },
  methods:  {
    moveToBounds(bounds) {
      this.$refs.map.mapObject.fitBounds(bounds)
    } 
  }
}
</script>

<style lang="scss">
  @import 'lib/leaflet.css';
  @import 'lib/leaflet.home.css';

  .tsl-map {
    position: fixed;
    top: 0;
    z-index: 1;
    width: 100vw;
    height: 100vh;
    user-select: none;
  }

  .tsl-map .leaflet-top.leaflet-right {
    margin-top: 50px;
  }
</style>
