<template>
  <div class="tsl-map">
    <l-map
      ref="map"
      :max-zoom="18"
      :options="mapOptions"
      :zoom.sync="zoom"
      :center.sync="center"
      @baselayerchange="setMapOption">
      <l-control-zoom
        v-if="!isTouch"
        :show="showControls"
        :position="zoomPosition" />
      <v-geosearch
        :options="geosearchOptions" />
      <l-control-layers
        :position="layersPosition"
        :auto-z-index="layersAutoZIndex" />
      <l-control-attribution
        :position="attributionPosition"
        prefix="Visualization Layers &copy; Tesselo " />
      <l-control
        class="print-image-control leaflet-bar leaflet-control"
        position="topright" >
        <el-button
          type="primary"
          class="export-button"
          icon="el-icon-document"
          @click="toggleExport" />
      </l-control>
      <l-tile-layer
        v-for="tileProvider in tileProviders"
        :key="tileProvider.name"
        :name="tileProvider.name"
        :visible="tileProvider.visible"
        :url="tileProvider.url"
        :tile-layer-class="tileProvider.tileLayerClass"
        :attribution="tileProvider.attribution"
        :layer-type="tileProvider.type"
        :z-index="tileProvider.zIndex"
      />
      <l-wms-tile-layer
        v-for="wmts in wmtsProviders"
        :key="wmts.key"
        :name="wmts.name"
        :visible="wmts.visible"
        :base-url="wmts.base_url"
        :layers="wmts.layers"
        :attribution="wmts.attribution"
        :layer-type="wmts.type"
        :z-index="wmts.zIndex"
      />
      <l-tile-layer
        :visible="showSelected"
        :url="algebraUrl"
        :tile-layer-class="tileLayerClass"
        :attribution="tesseloAttribution"
        :z-index="algebraZIndex"
        @add="setOpacitySlider" />
      <l-tile-layer
        :visible="showPredicted"
        :url="predictedUrl"
        :tile-layer-class="tileLayerClass"
        :z-index="predictedZIndex"
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
      class="layer-legend" />

    <map-legend
      v-if="selectedPredictedLayer && selectedPredictedLayer.legend && selectedPredictedLayer.legend.length && !isTouch"
      :data="selectedPredictedLayer.legend"
      :class="{'predicted-legend--layer-visible': showFormulaLegend}"
      :label="selectedPredictedLayer.classifierName"
      format="list"
      class="predicted-legend"
      tip="Hover colors to see details."/>

    <map-export
      v-if="showExportPanel"
      :data="exportTable"
      :processing="exportProcessing"
      @print-pdf="printPdf"
      @clear-exports="clearExports"
      @add-page="addImage" />

    <h1> {{ selectedFormulaLegend }} </h1>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getColorsFromPallete } from '@/services/util.js'

import L from 'leaflet'

import { LMap, LTileLayer, LWMSTileLayer, LControlLayers, LControlZoom, LControlAttribution, LControl } from 'vue2-leaflet'

// Leaflet print option.
import leafletImage from './leaflet-image'
import 'es6-promise/auto'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

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

import MapExport from '@/components/map-export/map-export.vue'

export default {
  name: 'TslMap',
  components: {
    LMap,
    LTileLayer,
    LControl,
    LControlLayers,
    LControlZoom,
    LControlAttribution,
    VGeosearch,
    'v-protobuf': Vue2LeafletVectorGridProtobuf,
    MapLegend,
    MapExport,
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
      showExportPanel: false,
      center: {lat: 0, lng: 0},
      lOpacity: {
        isSet: false,
        value:0,
      },
      pOpacity: {
        isSet: false,
        value:0,
      },
      urlLayer: null,
      algebraSlider: null,
      predictedSlider: null,
      algebraZIndex: 9,
      predictedZIndex: 10,
      tesseloAttribution: 'Contains modified Copernicus Sentinel data 2016 - 2019',
      layersAutoZIndex: false,
      tileProviders: [
        {
          slug:'BW_OpenStreetMap',
          name: 'B&W OpenStreetMap',
          visible: false,
          url: 'http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png',
          attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
          tileLayerClass: L.tileLayer,
          type: "base",
          zIndex: 1

        },
        {
          slug:'OpenStreetMap',
          name: 'OpenStreetMap',
          visible: false,
          attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          tileLayerClass: L.tileLayer,
          type: "base",
          zIndex: 1
        },
        {
          slug:'Lines',
          name: 'LinesOverlay',
          visible: false,
          attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
          url: 'http://{s}.tile.stamen.com/toner-lines/{z}/{x}/{y}.png',
          tileLayerClass: L.tileLayer,
          type: "overlay",
          zIndex: 11
        },
        {
          slug:'Labels',
          name: 'LabelsOverlay',
          visible: false,
          attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
          url: 'http://{s}.tile.stamen.com/toner-labels/{z}/{x}/{y}.png',
          tileLayerClass: L.tileLayer,
          type: "overlay",
          zIndex: 12
        },
        {
          slug: 'NAIP_RGB',
          name: 'NAIP RGB',
          visible: false,
          attribution: '<a target="_blank" href="http://www.fsa.usda.gov/">USDA Farm Service Agency</a>',
          url: '/api/naip/{z}/{x}/{y}.png?alpha&scale=0,255',
          tileLayerClass: L.authenticatedTileLayer,
          type: "base",
          zIndex: 1
        },
        {
          slug: 'NAIP_GRAYSCALE',
          name: 'NAIP Grayscale',
          visible: false,
          attribution: '<a target="_blank" href="http://www.fsa.usda.gov/">USDA Farm Service Agency</a>',
          url: '/api/naip/{z}/{x}/{y}.png?alpha&scale=0,255&enhance_color=0',
          tileLayerClass: L.authenticatedTileLayer,
          type: "base",
          zIndex: 1
        },
        {
          slug: 'NAIP_NDVI',
          name: 'NAIP NDVI',
          visible: false,
          attribution: '<a target="_blank" href="http://www.fsa.usda.gov/">USDA Farm Service Agency</a>',
          url: '/api/naip/{z}/{x}/{y}.png?formula=(B4-B1)/(B1%2BB4)&colormap=%7B"continuous":true,"range":[-0.9,0.9],"from":[165,0,38],"to":[0,104,55],"over":[249,247,174]%7D',
          tileLayerClass: L.authenticatedTileLayer,
          type: "base",
          zIndex: 1
        }
      ],
      wmtsProviders: [
        {
          base_url: "https://basemap.nationalmap.gov/arcgis/services/USGSImageryOnly/MapServer/WMSServer",
          slug:'USGS_Imagery',
          name: 'USGS Imagery',
          visible: false,
          layers: "0",
          attribution: "USGS The National Map: Orthoimagery. Data refreshed April, 2019.",
          type: "base",
          zIndex: 1
        },
        {
          base_url: "https://elevation.nationalmap.gov/arcgis/services/3DEPElevation/ImageServer/WMSServer",
          slug:'Hillshade_Gray',
          name: 'USGS Hillshade Gray',
          visible: false,
          layers: "3DEPElevation:Hillshade Gray",
          attribution: "USGS National Map 3D Elevation Program (3DEP). Data refreshed July, 2018.",
          type: "base",
          zIndex: 1
        },
        {
          base_url: "https://elevation.nationalmap.gov/arcgis/services/3DEPElevation/ImageServer/WMSServer",
          slug:'Hillshade_Multidirectional',
          name: 'USGS Hillshade Multidirectional',
          visible: false,
          layers: "3DEPElevation:Hillshade Multidirectional",
          attribution: "USGS National Map 3D Elevation Program (3DEP). Data refreshed July, 2018.",
          type: "base",
          zIndex: 1
        },
        {
          base_url: "https://elevation.nationalmap.gov/arcgis/services/3DEPElevation/ImageServer/WMSServer",
          slug:'Hillshade_Tinted',
          name: 'USGS Hillshade Tinted',
          visible: false,
          layers: "3DEPElevation:Hillshade Elevation Tinted",
          attribution: "USGS National Map 3D Elevation Program (3DEP). Data refreshed July, 2018.",
          type: "base",
          zIndex: 1
        }
      ],
      mapOptions: {
        zoomControl: false,
        attributionControl: false
      },
      zoomPosition: 'topright',
      layersPosition: 'topright',
      attributionPosition: 'bottomright',
      geosearchOptions: {
        provider: new OpenStreetMapProvider(),
        style: 'button',
        position: 'topright',
        showMarker: false,
        autoClose: true,
      },
      tileLayerClass: L.authenticatedTileLayer,
      firstLoad: true,
      exportData: [],
      exportProcessing: false,
      exportTable: [],
    }
  },
  computed: {
    ...mapState({
      mapBounds: state => state.map.bounds,
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

        if (query.zoom ){
          const new_zoom = parseInt(query.zoom)
          if(this.zoom != new_zoom) {
            this.zoom = new_zoom
          }
        }

        if(query.centerLat && query.centerLng) {
          if(query.centerLat != this.center.lat || query.centerLng != this.center.lng) {
            this.center = {lat: query.centerLat, lng: query.centerLng}
          }
        }

        if(query.mapOption){
          const new_mapopt = this.allBasemapProviders.find(item => item.slug === query.mapOption).slug
          if (this.urlLayer != new_mapopt) {
            this.urlLayer = new_mapopt
          }
        }

        if(query.lOpacity) {
          if (!this.lOpacity.isSet || this.lOpacity != query.lOpacity){
            this.lOpacity = { isSet: true, value: query.lOpacity }
          }
        }

        if(query.pOpacity) {
          if (!this.pOpacity.isSet || this.pOpacity != query.pOpacity){
            this.pOpacity = { isSet: true, value: query.pOpacity }
          }
        }
      }
    },
    zoom(newValue) {
      this.$router.replace({query: {...this.$route.query, zoom: newValue}})
    },
    center(newCenter) {
      this.$router.replace({query: {...this.$route.query, centerLat: newCenter.lat }})
      this.$router.replace({query: {...this.$route.query, centerLng: newCenter.lng }})
    },
    'selectedPredictedLayer.id' (newValue) {
      if (!newValue && this.predictedSlider !== null) {
        // Remove predicted layer slider.
        this.$refs.map.mapObject.removeControl(this.predictedSlider)
        this.predictedSlider = null
        // Remove predicted layer from url.
        this.$router.replace({query: {...this.$route.query, predictedlayer: undefined }})
      }
    },
    mapBounds (newBounds) {
      // Construct lat lon bounds.
      const corner1 = L.latLng(newBounds.xmin, newBounds.ymin)
      const corner2 = L.latLng(newBounds.xmax, newBounds.ymax)
      const bounds = L.latLngBounds(corner1, corner2)
      // Only move map if this is not the initial load. On initial load, use the
      // url coordinates and ignore the first auto selection of the area.
      if (!this.firstLoad || (!this.$route.query.centerLat && !this.$route.query.centerLng)) {
        this.$refs.map.mapObject.fitBounds([
          [newBounds.xmin, newBounds.ymin],
          [newBounds.xmax, newBounds.ymax]
        ])
      }
      // Unset first load flag.
      this.firstLoad = false
      // Set the new default extent to the bounds of this area of interest.
      if (this.defaultExtent) {
        this.defaultExtent.setCenter(bounds.getCenter())
        this.defaultExtent.setZoom(this.$refs.map.mapObject.getBoundsZoom(bounds))
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
    // Mount first base layer.
    if(this.urlLayer) {
      this.allBasemapProviders.find(item => item.slug === this.urlLayer).visible = true
    } else {
      this.allBasemapProviders[0].visible = true
    }
  },
  methods:  {
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
        $router.replace({query: {...$route.query, lOpacity: e.value / 100}})
      });

      this.$refs.map.mapObject.addControl(this.algebraSlider)
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
    },

    dataCallback(id){
      var data = this.exportData[id]
      const format = 'PNG'

      // Abort if not all data has been collected yet.
      if (!('formula_legend' in  data) || !('predicted_legend' in data) || !('map_canvas' in data)) {
        return
      }

      // Instantiate pdf or add new page.
      if (!this.doc) {
        this.doc = jsPDF({
          orientation: data.map_canvas.width > data.map_canvas.height ? 'landscape': 'portrait',
          unit: 'pt',
          format: [data.map_canvas.width, data.map_canvas.height]
        });
      } else {
        this.doc.addPage()
      }

      // Add captured map image.
      this.doc.addImage(data.map_canvas.toDataURL(), format, 0, 0, data.map_canvas.width, data.map_canvas.height)

      // Font settings.
      this.doc.setFont('helvetica')
      this.doc.setFontType('bold')
      const font_size = this.doc.internal.pageSize.width > 768 ? 25 : 15
      this.doc.setFontSize(font_size)
      // this.doc.setTextColor('#2F2D7E')
      this.doc.setTextColor('#000000')

      // Add moment name to track dates.
      this.doc.text(data.moment_name, 15, font_size + 10)

      // Add predicted layer legend.
      const legend_margin = 5
      const legend_scale = 0.8
      if (data.predicted_legend) {
        const predicted_legend_offset = this.doc.internal.pageSize.height - legend_scale * data.predicted_legend.height - legend_margin
        this.doc.addImage(
          data.predicted_legend.toDataURL(),
          format,
          legend_margin,
          predicted_legend_offset,
          legend_scale * data.predicted_legend.width,
          legend_scale * data.predicted_legend.height
        )
      }

      // Add formula legend.
      if (data.formula_legend) {
        // const ratio = data.formula_legend.width / data.formula_legend.height
        var pred_contrib = 0
        if (data.predicted_legend) {
          pred_contrib = legend_scale * data.predicted_legend.height
        }
        var formula_legend_offset = this.doc.internal.pageSize.height - legend_scale * data.formula_legend.height - pred_contrib - legend_margin

        this.doc.addImage(
          data.formula_legend.toDataURL(),
          format,
          legend_margin,
          formula_legend_offset,
          legend_scale * data.formula_legend.width,
          legend_scale * data.formula_legend.height
        )
      }

      // Add logo.
      var logo = new Image()
      logo.crossOrigin = 'Anonymous'
      logo.src = document.querySelector("img.logo").src + '?pdfcache=090c7adc359e437bb3a9'
      this.doc.addImage(
        logo,
        format,
        this.doc.internal.pageSize.width - 160 - 10,
        this.doc.internal.pageSize.height - 55 - 10,
        160,
        55
      )

      // Update export statuses.
      this.exportProcessing = false
      const count = this.exportTable.length
      this.exportTable.push({
        id: count + 1,
        moment: data.moment_name,
        layer: data.layer_name
      })
    },

    printPdf(){
      this.doc.save('tesselo_export.pdf')
      this.toggleExport()
      this.clearExports()
    },

    clearExports() {
      this.doc = null
      this.exportTable = []
      this.exportData = []
      this.exportProcessing = false
    },

    toggleExport(){
      this.showExportPanel = !this.showExportPanel
    },

    addImage(){
      // If this is already computing, wait for it to finish.
      if (this.exportProcessing) {
        return
      }
      // Set export status to processing.
      this.exportProcessing = true

      // Track the pdf page number.
      const id = this.exportData.length

      // Push another data container.
      this.exportData.push({})

      var tat = this

      // Fetch leaflet canvas.
      leafletImage(this.$refs.map.mapObject, function(err, canvas) {
        // Get image text and image data.
        tat.exportData[id].map_canvas = canvas
        tat.exportData[id].moment_name = tat.selectedMoment.name

        // Callback for export.
        tat.dataCallback(id)
      })

      // Capture formula legend, on touch the legends are not shown so skip this.
      if (this.selectedFormula && this.selectedFormula.formula != 'RGB' && !this.isTouch) {
        html2canvas(document.querySelector(".layer-legend")).then(legend_canvas => {
          tat.exportData[id].formula_legend = legend_canvas
          tat.exportData[id].layer_name = this.selectedFormula.acronym
          // Callback for export.
          tat.dataCallback(id)
        });
      } else {
        this.exportData[id].formula_legend = null
        // Callback for export.
        tat.dataCallback(id)
      }

      // Capture predicted layer legend, on touch the legends are not shown so skip this.
      if (this.selectedPredictedLayer && !this.isTouch) {
        html2canvas(document.querySelector(".predicted-legend")).then(legend_canvas => {
          tat.exportData[id].predicted_legend = legend_canvas
          tat.exportData[id].layer_name = this.selectedPredictedLayer.classifierName
          // Callback for export.
          tat.dataCallback(id)
        });
      } else {
        this.exportData[id].predicted_legend = null
        // Callback for export.
        tat.dataCallback(id)
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
      border: 2px solid rgba(0,0,0,0.2);
      position: absolute;
      top: 177px;
      width: 34px;
      right: 0;
      margin-left: 40px;
      z-index: 0;

      @media (min-width: 768px) {
        top: 245px;
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
    top: 135px;
    right: -90px;
    left: auto;
    .leaflet-range-layer {
      margin-left: 3px;
    }
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
  .leaflet-control-layers-toggle {
    width: 30px !important;
    height: 30px !important;
  }
  // Exporting
  .print-image-control {
    background-color: white
  }
  .export-button {
    width: 30px;
    height: 30px;
  }
</style>
