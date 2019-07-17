<template>
  <div class="tsl-map">
    <l-map
      ref="map"
      :zoom.sync="zoom"
      :max-zoom="18"
      :options="mapOptions"
      @update:bounds="updateBounds"
      @baselayerchange="setMapOption">
      <l-control-zoom
        v-if="!isTouch"
        :show="showControls"
        :position="zoomPosition" />
      <v-geosearch
        :options="geosearchOptions" />
      <l-control-layers
        :position="layersPosition" />
      <l-control-attribution
        :position="attributionPosition"
        prefix="Visualization Layers &copy; Tesselo " />
      <l-tile-layer
        v-for="tileProvider in tileProviders"
        :key="tileProvider.name"
        :name="tileProvider.name"
        :visible="tileProvider.visible"
        :url="tileProvider.url"
        :tile-layer-class="tileProvider.tileLayerClass"
        :attribution="tileProvider.attribution"
        layer-type="base"
      />
      <l-wms-tile-layer
        v-for="wmts in wmtsProviders"
        :key="wmts.key"
        :name="wmts.name"
        :visible="wmts.visible"
        :base-url="wmts.base_url"
        :layers="wmts.layers"
        :attribution="wmts.attribution"
        layer-type="base" />
      <l-tile-layer
        :visible="showSelected"
        :url="algebraUrl"
        :tile-layer-class="tileLayerClass"
        :z-index="9"
        :attribution="tesseloAttribution"
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
      v-if="showFormulaLegend && !isTouch"
      v-show="showControls"
      :data="selectedFormulaLegend"
      :min="selectedFormula.minVal"
      :max="selectedFormula.maxVal"
      :label="selectedFormula.acronym"
      class="layer-legend"/>

    <map-legend
      v-if="selectedPredictedLayer && selectedPredictedLayer.legend && selectedPredictedLayer.legend.length"
      :data="selectedPredictedLayer.legend"
      :class="{'predicted-legend--layer-visible': showFormulaLegend}"
      :label="selectedPredictedLayer.classifierName"
      format="list"
      class="predicted-legend"
      tip="Hover colors to see details."/>

    <h1> {{ selectedFormulaLegend }} </h1>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getColorsFromPallete } from '@/services/util.js'

import L from 'leaflet'

import { LMap, LTileLayer, LWMSTileLayer, LControlLayers, LControlZoom, LControlAttribution } from 'vue2-leaflet'

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
    MapLegend,
    'l-wms-tile-layer': LWMSTileLayer
  },
  props: {
    showControls:{
      type: Boolean,
      default: true,
      required: false,
    },
  },
  data () {
    return {
      zoom: 2,
      firstLoad: true,
      lOpacity: {
        isSet: false,
        value:0,
      },
      pOpacity: {
        isSet: false,
        value:0,
      },
      centerBound: null,
      urlLayer: null,
      algebraSlider: null,
      predictedSlider: null,
      tesseloAttribution: 'Contains modified Copernicus Sentinel data 2016 - 2019',
      tileProviders: [
        {
          slug:'BW_OpenStreetMap',
          name: 'B&W OpenStreetMap',
          visible: false,
          url: 'https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
          attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          tileLayerClass: L.tileLayer
        },
        {
          slug:'OpenStreetMap',
          name: 'OpenStreetMap',
          visible: false,
          attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          tileLayerClass: L.tileLayer
        },
        {
          slug: 'NAIP_RGB',
          name: 'NAIP RGB',
          visible: false,
          attribution: '<a target="_blank" href="http://www.fsa.usda.gov/">USDA Farm Service Agency</a>',
          url: '/api/naip/{z}/{x}/{y}.png?alpha&scale=0,255',
          tileLayerClass: L.authenticatedTileLayer
        },
        {
          slug: 'NAIP_GRAYSCALE',
          name: 'NAIP Grayscale',
          visible: false,
          attribution: '<a target="_blank" href="http://www.fsa.usda.gov/">USDA Farm Service Agency</a>',
          url: '/api/naip/{z}/{x}/{y}.png?alpha&scale=0,255&enhance_color=0',
          tileLayerClass: L.authenticatedTileLayer
        },
        {
          slug: 'NAIP_NDVI',
          name: 'NAIP NDVI',
          visible: false,
          attribution: '<a target="_blank" href="http://www.fsa.usda.gov/">USDA Farm Service Agency</a>',
          url: '/api/naip/{z}/{x}/{y}.png?formula=(B4-B1)/(B1%2BB4)&colormap=%7B"continuous":true,"range":[-0.9,0.9],"from":[165,0,38],"to":[0,104,55],"over":[249,247,174]%7D',
          tileLayerClass: L.authenticatedTileLayer
        },
        // {
        //   slug: 'World_Imagery',
        //   name: 'World Imagery',
        //   visible: false,
        //   attribution: '&copy; ESRI, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community',
        //   url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        //   tileLayerClass: L.tileLayer
        // },
        // {
        //   slug: 'Terrain',
        //   name: 'Terrain',
        //   visible: false,
        //   attribution: '<a target="_blank" href="http://mapzen.com">Mapzen</a>',
        //   url: 'https://elevation-tiles-prod.s3.amazonaws.com/normal/{z}/{x}/{y}.png',
        //   tileLayerClass: L.tileLayer
        // },
      ],
      wmtsProviders: [
        {
          base_url: "https://basemap.nationalmap.gov/arcgis/services/USGSImageryOnly/MapServer/WMSServer",
          slug:'USGS_Imagery',
          name: 'USGS Imagery',
          visible: false,
          layers: "0",
          attribution: "USGS The National Map: Orthoimagery. Data refreshed April, 2019."
        },
        {
          base_url: "https://elevation.nationalmap.gov/arcgis/services/3DEPElevation/ImageServer/WMSServer",
          slug:'Hillshade_Gray',
          name: 'USGS Hillshade Gray',
          visible: false,
          layers: "3DEPElevation:Hillshade Gray",
          attribution: "USGS National Map 3D Elevation Program (3DEP). Data refreshed July, 2018."
        },
        {
          base_url: "https://elevation.nationalmap.gov/arcgis/services/3DEPElevation/ImageServer/WMSServer",
          slug:'Hillshade_Multidirectional',
          name: 'USGS Hillshade Multidirectional',
          visible: false,
          layers: "3DEPElevation:Hillshade Multidirectional",
          attribution: "USGS National Map 3D Elevation Program (3DEP). Data refreshed July, 2018."
        },
        {
          base_url: "https://elevation.nationalmap.gov/arcgis/services/3DEPElevation/ImageServer/WMSServer",
          slug:'Hillshade_Tinted',
          name: 'USGS Hillshade Tinted',
          visible: false,
          layers: "3DEPElevation:Hillshade Elevation Tinted",
          attribution: "USGS National Map 3D Elevation Program (3DEP). Data refreshed July, 2018."
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
        autoClose: true,
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

    isTouch() {
      return this.$deviceInfo.isTouch;
    },
    showFormulaLegend () {
      return this.selectedFormula &&
        this.selectedFormula.formula !== 'RGB' &&
        this.selectedFormulaLegend &&
        this.selectedFormulaLegend.length
    },

    allBasemapProviders () {
      return this.tileProviders.concat(this.wmtsProviders)
    },

    selectedFormulaLegend () {
      if (this.selectedFormula) {
        const colors = getColorsFromPallete(this.selectedFormula)
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
    '$route.query': {
      immediate: true,
      handler(){
        const query = this.$route.query
        if (query.zoom && this.firstLoad == true) {
          this.zoom = parseInt(this.$route.query.zoom)
        }
        if(query.mapOption && this.firstLoad == true){
          this.urlLayer = this.allBasemapProviders.find(item => item.slug === query.mapOption).slug
        }else{
          this.allBasemapProviders[0].visible=true
        }
        if(query.lOpacity && this.firstLoad == true) {
          this.lOpacity = { isSet: true, value: query.lOpacity }
        }
        if(query.pOpacity && this.firstLoad == true) {
          this.pOpacity = { isSet: true, value: query.pOpacity }
        }
        if(query.centerLat && query.centerLng && this.firstLoad == true){
          this.centerBound= {
            lat: query.centerLat,
            lng: query.centerLng
          }
        }
        this.firstLoad = false
      },
    },
    zoom(newValue) {
      this.$router.replace({query: {...this.$route.query,zoom: newValue}})
    },
    bounds: {
      handler (newBounds) {
        const query = this.$route.query
        const bounds = L.bounds([newBounds.xmin, newBounds.ymin], [newBounds.xmax, newBounds.ymax])
        if( (!query.centerLat && !query.centerLng) || (query.centerLat !== bounds.x && query.centerLng !== bounds.y)) {
          this.moveToBounds([
            [newBounds.xmin, newBounds.ymin],
            [newBounds.xmax, newBounds.ymax]
          ]);
        }
        // Set the new default extent to the bounds of this area of interest.
        if (this.defaultExtent) {
          this.defaultExtent.setCenter(this.$refs.map.mapObject.getCenter())
          this.defaultExtent.setZoom(this.$refs.map.mapObject.getZoom())
        }
      }
    },
    'selectedPredictedLayer.id' (newValue) {
      if (!newValue && this.predictedSlider !== null) {
        this.$refs.map.mapObject.removeControl(this.predictedSlider)
        this.predictedSlider = null
      }
    },
    showControls(newValue){
      if(newValue==true){
        this.$refs.map.mapObject._controlCorners.topright.hidden = false
      } else {
        this.$refs.map.mapObject._controlCorners.topright.hidden = true
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
    // If values are read from the URL center and
    if(this.centerBound) this.moveToCenter();
    if(this.urlLayer) this.allBasemapProviders.find(item => item.slug === this.urlLayer).visible=true
  },
  methods:  {
    /**
     * Set bounds on URL
     */
    updateBounds(){
      this.$router.replace({query: {...this.$route.query,zoom: this.zoom}});
      this.$router.replace({query: {...this.$route.query, centerLat: this.$refs.map.mapObject.getCenter().lat }});
      this.$router.replace({query: {...this.$route.query, centerLng: this.$refs.map.mapObject.getCenter().lng }});
    },
    moveToBounds(bounds) {
      this.$refs.map.mapObject.fitBounds(bounds)
    },
    moveToCenter() {
      this.$refs.map.mapObject.panTo(this.centerBound)
    },
    /**
     * Set selected option on URL based on index
     */
    setMapOption(event){
      const selected = this.allBasemapProviders.find(item => item.name === event.name);
      this.$router.replace({query: {...this.$route.query, mapOption: selected.slug}});
    },
    setOpacitySlider(event) {
      const { $router, $route } = this
       if (this.algebraSlider !== null) {
        this.$refs.map.mapObject.removeControl(this.algebraSlider)
      }

      // Instantiate opacity control.
      this.algebraSlider = L.control.range({
        position: 'topright',
        min: 0,
        max: 100,
        value: this.lOpacity.isSet ? parseFloat(this.lOpacity.value) * 100 : 100,
        step: 1,
        orient: 'vertical',
        iconClass: 'leaflet-range-icon leaflet-range-layer'
      })

      this.algebraSlider.on('input change', function(e) {
        event.target.setOpacity(e.value / 100)
        $router.replace({query: {...$route.query,lOpacity: e.value / 100}})
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
      const { $router, $route } = this
      this.predictedSlider = L.control.range({
        position: 'topright',
        min: 0,
        max: 100,
        value: this.pOpacity.isSet ? parseFloat(this.pOpacity.value) * 100 : 100,
        step: 1,
        orient: 'vertical',
        iconClass: 'leaflet-range-icon leaflet-range-predicted'
      })

      this.predictedSlider.on('input change', function(e) {
        event.target.setOpacity(e.value / 100)
        $router.replace({query: {...$route.query, pOpacity: e.value / 100}})
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
    width: 100%;
    height: 100%;
    user-select: none;

    > h1 {
      display: none;
    }
  }

  .tsl-map .leaflet-top.leaflet-right {
    margin-top: 50px;
    height: 100%;
    min-width: 170px;

    .leaflet-control {
      display: block;
      max-width: 34px;
      margin-left: auto;
    }

    .leaflet-range-control {
      position: absolute;
      top: 132px;
      right: 0;
      margin-left: 40px;
      z-index: 0;

      @media (min-width: 768px) {
        top: 200px;
      }

      &:nth-last-of-type(2) {
        right: 40px;
        margin-left: 0;
      }
    }
  }

  .tsl-map .leaflet-touch .leaflet-range-control {
    top: 132px;
  }

  .leaflet-control-layers {
    max-width: 34px;
    margin-left: auto;
    display: block;
    float: none;

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
    height: 208px;
    display: block;
    float: none;
    top: 132px;
    right: -90px;
    left: auto;

    .leaflet-range-icon {
      background-position: 1px;
    }
  }

  .leaflet-control-layers-expanded {
    max-width: none !important;
    z-index: 1;
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
