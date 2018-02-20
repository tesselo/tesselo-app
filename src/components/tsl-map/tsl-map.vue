<template>
  <div class="tsl-map">
    <Map
      ref="map"
      :zoom="10"
      :max-zoom="14"
      :center="[41.1471288,-8.6116238]">
      <tile-layer url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png" />
      <tile-layer
        v-show="selectedFormula && selectedMoment"
        :url="algebraUrl"
        ref="tile" />
      <v-protobuf
        v-if="selectedLayer"
        :url="vectorUrl"
        :options="mapOptions" />
    </map>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import Leaflet from 'leaflet'
import { Map, TileLayer } from 'vue2-leaflet'
import attachHomeControl from './lib/leaflet.home'
import Vue2LeafletVectorGridProtobuf from 'vue2-leaflet-vectorgrid'

import 'leaflet-control-geocoder'
import 'leaflet-control-geocoder/dist/Control.Geocoder.css'

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
    ...mapState({
      bounds: state => state.map.bounds,
      selectedLayer: state => state.aggregationLayer.selectedLayer,
      selectedFormula: state => state.formula.selectedFormula,
      selectedMoment: state => state.time.selectedMoment,
      authenticated: state => state.auth.authenticated
    }),
    mapOptions: function() {
      const layerStyle = {
        [this.selectedLayer.name]: polygonStyle
      }

      const options = {
        rendererFactory: Leaflet.canvas.tile,
        vectorTileLayerStyles: layerStyle,
        zIndex: 10
      }

      const token = JSON.parse(localStorage.getItem('auth')).token
      if (this.authenticated) {
        options.fetchOptions = {
          headers: new Headers({
            'authorization': 'Token ' + token
          })
        }
      }

      return options
    },
    vectorUrl() {
      return endpoints.map.vector(this.selectedLayer.id)
    },
    algebraUrl() {
      return endpoints.map.algebra(this.selectedFormula, this.selectedMoment)
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

    const defaultCreateTile = this.$refs.tile.mapObject.__proto__.createTile

    this.$refs.tile.mapObject.__proto__.createTile = function(coords, done) {
      const url = this.getTileUrl(coords);

      const tesseloAPI = url.indexOf('tesselo') != -1

      if (!tesseloAPI) {
        return defaultCreateTile.call(this, coords, done)
      }

      const tile = document.createElement('img');
      Leaflet.DomEvent.on(tile, 'load', Leaflet.Util.bind(this._tileOnLoad, this, done, tile));
      Leaflet.DomEvent.on(tile, 'error', Leaflet.Util.bind(this._tileOnError, this, done, tile));

      if (this.options.crossOrigin || this.options.crossOrigin === '') {
        tile.crossOrigin = this.options.crossOrigin === true ? '' : this.options.crossOrigin;
      }

      const token = JSON.parse(localStorage.getItem('auth')).token
      axios({
        method: 'GET',
        url: url,
        headers: {
          'authorization': 'Token ' + token
        },
        responseType: 'blob'
      }).then((response) => {
        tile.src = URL.createObjectURL(response.data);
        done(null, tile);
      })

      return tile;
    }
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
