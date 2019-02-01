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
      <l-control-attribution
        :position="attributionPosition"
        prefix="" />
      <l-tile-layer
        v-for="tileProvider in tileProviders"
        :key="tileProvider.name"
        :name="tileProvider.name"
        :visible="tileProvider.visible"
        :url="tileProvider.url"
        :attribution="tileProvider.attribution"
        layer-type="base"
      />
      <l-tile-layer
        :visible="showSelected"
        :url="algebraUrl"
        :tile-layer-class="tileLayerClass"
        :z-index="9"
        @add="setOpacitySlider" />
      <l-tile-layer
        :visible="showPredicted"
        :url="predictedUrl"
        :tile-layer-class="tileLayerClass"
        :z-index="10"
        @add="setOpacitySliderPredictedLayer" />
      <v-protobuf
        v-if="selectedLayer"
        :url="vectorUrl"
        :options="protobufOptions" />
    </l-map>

    <map-legend
      v-if="showFormulaLegend"
      :data="selectedFormulaLegend"
      :min="selectedFormula.minVal"
      :max="selectedFormula.maxVal"
      label="Layer"
      class="layer-legend"/>

    <map-legend
      v-if="selectedPredictedLayer && selectedPredictedLayer.legend && selectedPredictedLayer.legend.length"
      :data="selectedPredictedLayer.legend"
      :class="{'predicted-legend--layer-visible': showFormulaLegend}"
      label="Predicted Layer"
      class="predicted-legend"
      tip="Hover colors to see details."/>

    <h1> {{ selectedFormulaLegend }} </h1>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getColorsFromPallete } from '@/services/util.js'

import L from 'leaflet'

import { LMap, LTileLayer, LControlLayers, LControlZoom, LControlAttribution } from 'vue2-leaflet'

// API
import endpoints from '@/data/api/api.endpoints'

// Tile layer class that has token auth requests built in.
import './authenticated-tile-layer'

// Geosearch plugin.
import { OpenStreetMapProvider } from 'leaflet-geosearch'
import 'leaflet-geosearch/assets/css/leaflet.css'
import VGeosearch from 'vue2-leaflet-geosearch'

// Home button plugin.
import 'leaflet.defaultextent'
import 'leaflet.defaultextent/dist/leaflet.defaultextent.css'

// Opacity slider.
import 'leaflet-range'
import 'leaflet-range/L.Control.Range.css'

// Vector grids for vue.
import Vue2LeafletVectorGridProtobuf from 'vue2-leaflet-vectorgrid'
import { polygonStyle } from './vector-style'

import MapLegend from '@/components/map-legend/map-legend.vue'


export default {
  name: 'TslMap',
  components: {
    LMap,
    LTileLayer,
    LControlLayers,
    LControlZoom,
    LControlAttribution,
    VGeosearch,
    'v-protobuf': Vue2LeafletVectorGridProtobuf,
    MapLegend
  },
  data () {
    return {
      algebraSlider: null,
      predictedSlider: null,
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
          url: 'https://tesselo.com/api/naip/{z}/{x}/{y}.png?formula=(B4-B1)/(B1%2BB4)&colormap=%7B"continuous":true,"range":[-0.9,0.9],"from":[165,0,38],"to":[0,104,55],"over":[249,247,174]%7D'
        },
        {
          name: 'World Imagery',
          visible: false,
          attribution: '&copy; ESRI, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community',
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        },
        {
          name: 'Terrain',
          visible: false,
          attribution: '<a target="_blank" href="http://mapzen.com">Mapzen</a>',
          url: 'https://elevation-tiles-prod.s3.amazonaws.com/normal/{z}/{x}/{y}.png'
        }
      ],
      mapOptions: {
        zoomControl: false,
        attributionControl: false,
      },
      zoomPosition: 'topright',
      layersPosition: 'bottomright',
      attributionPosition: 'bottomright',
      geosearchOptions: {
        provider: new OpenStreetMapProvider(),
        style: 'button',
        position: 'topright',
        showMarker: false,
        autoClose: true
      },
      tileLayerClass: L.authenticatedTileLayer
    }
  },
  computed: {
    ...mapState({
      bounds: state => state.map.bounds,
      selectedLayer: state => state.aggregationLayer.selectedLayer,
      selectedFormula: state => state.formula.selectedFormula,
      selectedMoment: state => state.time.selectedMoment,
      authenticated: state => state.auth.authenticated,
      showSelected: state => Boolean(state.formula.selectedFormula && state.time.selectedMoment),
      selectedPredictedLayer: state => state.predictedLayer.selectedLayer,
      showPredicted: state => Boolean(state.predictedLayer.selectedLayer)
    }),

    showFormulaLegend () {
      return this.selectedFormula && this.selectedFormulaLegend && this.selectedFormulaLegend.length
    },

    selectedFormulaLegend () {
      if (this.selectedFormula) {
        const colors = getColorsFromPallete(this.selectedFormula.colorPalette)
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

    protobufOptions() {
      const layerStyle = {
        [this.selectedLayer.name]: polygonStyle
      }

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
    },
    predictedUrl() {
      return endpoints.map.predicted(this.selectedPredictedLayer)
    }
  },
  watch: {
    bounds: {
      handler (newBounds) {
        this.moveToBounds([
          [newBounds.xmin, newBounds.ymin],
          [newBounds.xmax, newBounds.ymax]
        ]);
        // Set the new default extent to the bounds of this area of interest.
        if (this.defaultExtent) {
          this.defaultExtent.setCenter(this.$refs.map.mapObject.getCenter())
          this.defaultExtent.setZoom(this.$refs.map.mapObject.getZoom())
        }
      }
    }
  },
  mounted: function() {
    // Instantiate location search bar.
    const searchLayer = L.layerGroup().addTo(this.$refs.map.mapObject)
    this.$refs.map.mapObject.addControl(searchLayer)
    // Instantiate home button.
    this.defaultExtent = L.control.defaultExtent({position: 'topright'}).addTo(this.$refs.map.mapObject);
    this.$refs.map.mapObject.keyboard.disable();
  },
  methods:  {
    moveToBounds(bounds) {
      this.$refs.map.mapObject.fitBounds(bounds)
    },
    setOpacitySlider(event) {
       if (this.algebraSlider !== null) {
        this.$refs.map.mapObject.removeControl(this.algebraSlider)
      }

      // Instantiate opacity control.
      this.algebraSlider = L.control.range({
        position: 'topright',
        min: 0,
        max: 100,
        value: 100,
        step: 1,
        orient: 'vertical',
        iconClass: 'leaflet-range-icon leaflet-range-layer'
      })

      this.algebraSlider.on('input change', function(e) {
        event.target.setOpacity(e.value / 100)
      });

      let predictedRemoved = false
      if (this.predictedSlider !== null) {
        predictedRemoved = true
        this.$refs.map.mapObject.removeControl(this.predictedSlider)
      }

      this.$refs.map.mapObject.addControl(this.algebraSlider)

      if (predictedRemoved) {
        this.$refs.map.mapObject.addControl(this.predictedSlider)
      }
    },

    setOpacitySliderPredictedLayer (event) {
      this.predictedSlider = L.control.range({
        position: 'topright',
        min: 0,
        max: 100,
        value: 100,
        step: 1,
        orient: 'vertical',
        iconClass: 'leaflet-range-icon leaflet-range-predicted'
      })

      this.predictedSlider.on('input change', function(e) {
        event.target.setOpacity(e.value / 100)
      });

      this.$refs.map.mapObject.addControl(this.predictedSlider)
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
      width: 30px;
      height: 30px;
      @media (min-width: 768px) {
        width: 26px;
        height: 26px;
      }
    }
  }

  .leaflet-control-container .leaflet-range-control {
    width: 30px;

    .leaflet-range-icon {
      background-position: 1px;
    }
  }

  .layer-legend {
    top: 177px;
    left: 25px;
  }

  .predicted-legend {
    top: 177px;
    left: 25px;

    &--layer-visible {
      top: 250px;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        height: 1px;
        left: 10px;
        right: 10px;
        background-color: $pale-grey;
      }
    }
  }
</style>
