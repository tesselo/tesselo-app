<template>
  <div class="tsl-map">
    <l-map
      ref="map"
      :zoom="2"
      :max-zoom="18"
      :options="mapOptions">
      <l-control-zoom :position="zoomPosition" />
      <v-geosearch :options="geosearchOptions" />
      <l-control-layers :position="layersPosition" />
      <l-control-attribution :position="attributionPosition" />
      <l-tile-layer
        v-for="tileProvider in tileProviders"
        layer-type="base"
        :key="tileProvider.name"
        :name="tileProvider.name"
        :visible="tileProvider.visible"
        :url="tileProvider.url"
        :attribution="tileProvider.attribution" />
      <l-tile-layer
        v-show="selectedFormula && selectedMoment"
        :url="algebraUrl"
        @add="patchCreateTile"
        ref="tile" />
      <v-protobuf
        v-if="selectedLayer"
        :url="vectorUrl"
        :options="protobufOptions" />
    </l-map>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

import L from 'leaflet'

import { LMap, LTileLayer, LControlLayers, LControlZoom, LControlAttribution } from 'vue2-leaflet'

// Geosearch plugin.
import { OpenStreetMapProvider } from 'leaflet-geosearch'
import 'leaflet-geosearch/assets/css/leaflet.css'
import VGeosearch from 'vue2-leaflet-geosearch'

// Home button plugin.
import 'leaflet.defaultextent'
import 'leaflet.defaultextent/dist/leaflet.defaultextent.css'

// Vector grids for vue.
import Vue2LeafletVectorGridProtobuf from 'vue2-leaflet-vectorgrid'

import endpoints from '@/data/api/api.endpoints'
import { polygonStyle } from './vector-style'


export default {
  name: 'TslMap',
  components: {
    LMap,
    LTileLayer,
    LControlLayers,
    LControlZoom,
    LControlAttribution,
    VGeosearch,
    'v-protobuf': Vue2LeafletVectorGridProtobuf
  },
  data () {
    return {
      tileProviders: [
        {
          name: 'B&W OpenStreetMap',
          visible: true,
          url: 'https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
          attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        },
        {
          name: 'OpenStreetMap',
          visible: false,
          attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        },
        {
          name: 'NAIP RGB',
          visible: false,
          attribution: '<a target="_blank" href="http://www.fsa.usda.gov/">USDA Farm Service Agency</a>',
          url: 'https://tesselo.com/api/naip/{z}/{x}/{y}.png?alpha&scale=0,255'
        },
        {
          name: 'NAIP NDVI',
          visible: false,
          attribution: '<a target="_blank" href="http://www.fsa.usda.gov/">USDA Farm Service Agency</a>',
          url: 'https://tesselo.com/api/naip/{z}/{x}/{y}.png?formula=(B4-B1)/(B1%2BB4)&colormap={"continuous":true,"range":[-0.9,0.9],"from":[165,0,38],"to":[0,104,55],"over":[249,247,174]}'
        },
        {
          name: 'World Imagery',
          visible: false,
          attribution: '&copy; ESRI, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community',
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        }
      ],
      mapOptions: {
        zoomControl: false,
        attributionControl: false
      },
      zoomPosition: 'topright',
      layersPosition: 'bottomright',
      attributionPosition: 'bottomright',
      attributionPrefix: '',
      geosearchOptions: {
        provider: new OpenStreetMapProvider(),
        style: 'button',
        position: 'topright',
        showMarker: false,
        autoClose: true
      }
    }
  },
  computed: {
    ...mapState({
      bounds: state => state.map.bounds,
      selectedLayer: state => state.aggregationLayer.selectedLayer,
      selectedFormula: state => state.formula.selectedFormula,
      selectedMoment: state => state.time.selectedMoment,
      authenticated: state => state.auth.authenticated
    }),
    protobufOptions: function() {
      const layerStyle = {
        [this.selectedLayer.name]: polygonStyle
      }
      console.log('factory', L.canvas.tile)

      const options = {
        rendererFactory: L.canvas.tile,
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
    // Instantiate location search bar.
    const searchLayer = L.layerGroup().addTo(this.$refs.map.mapObject)
    this.$refs.map.mapObject.addControl(searchLayer)
    // Instantiate home button.
    L.control.defaultExtent({position: 'topright'}).addTo(this.$refs.map.mapObject);
  },
  methods:  {
    moveToBounds(bounds) {
      console.log('bounds', bounds, this.$refs.map.mapObject)
      this.$refs.map.mapObject.fitBounds(bounds)
    },
    patchCreateTile(){
      const defaultCreateTile = this.$refs.tile.mapObject.__proto__.createTile

      this.$refs.tile.mapObject.__proto__.createTile = function(coords, done) {
        const url = this.getTileUrl(coords);

        const tesseloAPI = url.indexOf('tesselo') != -1

        if (!tesseloAPI) {
          return defaultCreateTile.call(this, coords, done)
        }

        const tile = document.createElement('img')
        L.DomEvent.on(tile, 'load', L.Util.bind(this._tileOnLoad, this, done, tile))
        L.DomEvent.on(tile, 'error', L.Util.bind(this._tileOnError, this, done, tile))

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
    }
  }
}
</script>

<style lang="scss">
  @import 'lib/leaflet.css';

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

  .leaflet-control-layers {
    .leaflet-control-layers-toggle {
      background-size: 22px 22px;
      width: 26px;
      height: 26px;
    }
  }
</style>
