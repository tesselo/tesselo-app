<template>
  <div class="tsl-map">
    <l-map
      ref="map"
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
      <l-control-attribution
        :position="attributionPosition"
        prefix="Visualization Layers &copy; <a href=https://tesselo.com>Tesselo</a> " />
      <l-control
        class="print-image-control leaflet-bar leaflet-control"
        position="topright" >
        <el-button
          :title="hoverInfo.printReport"
          type="text"
          class="export-button"
          icon="el-icon-printer"
          @click="toggleExport" />
      </l-control>
      <l-control
        class="print-image-control leaflet-bar leaflet-control"
        position="topright" >
        <el-button
          :title="hoverInfo.report"
          type="text"
          class="export-button"
          icon="el-icon-document"
          @click="showReport" />
      </l-control>
      <l-control-layers
        :position="layersPosition"
        :auto-z-index="layersAutoZIndex" />
      <l-tile-layer
        v-for="tileProvider in tileProviders"
        ref="tileProviders"
        :key="tileProvider.slug"
        :slug="tileProvider.slug"
        :name="tileProvider.name"
        :visible="tileProvider.visible"
        :url="tileProvider.url"
        :tile-layer-class="tileProvider.tileLayerClass"
        :attribution="tileProvider.attribution"
        :layer-type="tileProvider.type"
        :z-index="tileProvider.zIndex"
      />
      <l-wms-tile-layer
        v-for="wms in wmsProviders"
        ref="wmsProviders"
        :key="wms.slug"
        :slug="wms.slug"
        :name="wms.name"
        :visible="wms.visible"
        :base-url="wms.base_url"
        :layers="wms.layers"
        :format="wms.format"
        :attribution="wms.attribution"
        :layer-type="wms.type"
        :z-index="wms.zIndex"
      />
      <l-tile-layer
        :visible="showSelected"
        :url="algebraUrl"
        :tile-layer-class="tileLayerClass"
        :attribution="tesseloAttribution"
        :z-index="algebraZIndex"
        :opacity="lOpacity"
        @add="setOpacitySlider" />
      <l-tile-layer
        :visible="showPredicted"
        :url="predictedUrl"
        :tile-layer-class="tileLayerClass"
        :z-index="predictedZIndex"
        :opacity="pOpacity"
        @add="setOpacitySliderPredictedLayer" />
      <v-protobuf
        v-if="selectedLayer"
        :url="vectorUrl"
        :options="protobufOptions"
        @click="showVectorDetails" />
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
      @add-page="addImage"
      @close="toggleExport"/>

    <h1> {{ selectedFormulaLegend }} </h1>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { getColorsFromPallete } from '@/services/util.js'
import { actionTypes } from '@/services/constants'

import L from 'leaflet'
import 'mapbox-gl-leaflet/leaflet-mapbox-gl'

import { LMap, LTileLayer, LWMSTileLayer, LControlLayers, LControlZoom, LControlAttribution, LControl } from 'vue2-leaflet'

// Leaflet print option.
import leafletImage from './leaflet-image'
import 'es6-promise/auto'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// API
import endpoints from '@/services/api/api.endpoints'

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

// Element-ui styles.
import 'element-ui/lib/theme-chalk/index.css';

// Vector grids for vue.
import Vue2LeafletVectorGridProtobuf from 'vue2-leaflet-vectorgrid'
import { polygonStyle } from './vector-style'
import { basemapProviders } from './tile-providers'

import MapLegend from '@/components/map-legend/map-legend.vue'

import MapExport from '@/components/map-export/map-export.vue'

import { routeTypes } from '@/services/constants'

import notifications from '../notification'

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
      showExportPanel: false,
      urlLayer: null,
      algebraSlider: null,
      predictedSlider: null,
      algebraZIndex: 9,
      predictedZIndex: 10,
      tesseloAttribution: 'Contains modified Copernicus Sentinel data 2016 - 2019',
      layersAutoZIndex: false,
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
        searchLabel: 'Search by Address'
      },
      tileLayerClass: L.authenticatedTileLayer,
      exportData: [],
      exportProcessing: false,
      exportTable: [],
      hoverInfo: {
        report: 'Report',
        defaultZoom: 'Default Zoom',
        printReport: 'Print Report',
      },
    }
  },
  computed: {
    ...mapState({
      profile: state => state.auth.profile,
      zoom: state => state.map.zoom,
      center: state => state.map.center,
      homeBounds: state => state.map.homeBounds,
      baselayer: state => state.map.baselayer,
      lOpacity: state => state.map.lOpacity,
      pOpacity: state => state.map.pOpacity,
      selectedLayer: state => state.aggregationLayer.selectedLayer,
      selectedFormula: state => state.formula.selectedFormula,
      selectedMoment: state => state.time.selectedMoment,
      authenticated: state => state.auth.authenticated,
      showSelected: state => Boolean(state.formula.selectedFormula && state.time.selectedMoment),
      selectedPredictedLayer: state => state.predictedLayer.selectedLayer,
      showPredicted: state => Boolean(state.predictedLayer.selectedLayer)
    }),

    basemapProviders() {
      if (this.profile && this.profile.baselayers) {
        const baselayers = this.profile.baselayers.split(',')
        return basemapProviders.filter(item => { return baselayers.indexOf(item.slug) >= 0 })
      } else {
        return basemapProviders.map(item => { return item })
      }
    },

    wmsProviders() {
      return this.basemapProviders.filter(provider => { return provider.isWms })
    },

    tileProviders() {
      return this.basemapProviders.filter(provider => { return !provider.isWms })
    },

    basemapRefs() {
      let result
      if (this.$refs.tileProviders) {
        result = this.$refs.tileProviders
      }
      if (this.$refs.wmsProviders) {
        if (result) {
          result.concat(this.$refs.wmsProviders)
        } else {
          result = this.$refs.wmsProviders
        }
      }
      return result
    },

    isTouch() {
      return this.$deviceInfo.isTouch;
    },

    showFormulaLegend () {
      return this.selectedFormula &&
        this.selectedFormula.formula !== 'RGB' &&
        this.selectedFormulaLegend &&
        this.selectedFormulaLegend.length
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
        rendererFactory: L.svg.tile,
        vectorTileLayerStyles: layerStyle,
        zIndex: 10,
        interactive: true,
        minZoom: 7
      }

      if (this.authenticated) {
        options.fetchOptions = {
          credentials: 'include'
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
    zoom (newZoom) {
      this.$refs.map.mapObject.setZoom(newZoom)
    },
    center (newCenter) {
      this.$refs.map.mapObject.panTo(newCenter)
    },
    homeBounds (newBounds) {
      // Construct lat lon bounds.
      const corner1 = L.latLng(newBounds.xmin, newBounds.ymin)
      const corner2 = L.latLng(newBounds.xmax, newBounds.ymax)
      const bounds = L.latLngBounds(corner1, corner2)
      // Set the new default extent to the bounds of this area of interest.
      if (this.defaultExtent) {
        this.defaultExtent.setCenter(bounds.getCenter())
        this.defaultExtent.setZoom(this.$refs.map.mapObject.getBoundsZoom(bounds))
      }
    },
    selectedPredictedLayer (newValue) {
      if (!newValue && this.predictedSlider !== null) {
        // Remove predicted layer slider.
        this.$refs.map.mapObject.removeControl(this.predictedSlider)
        this.predictedSlider = null
        // Remove predicted layer from url.
        this.$router.replace({query: {...this.$route.query, predictedlayer: undefined }})
      }
    },
    showControls(newValue){
      if(newValue==true){
        this.$refs.map.mapObject._controlCorners.topright.hidden = false
      } else {
        this.$refs.map.mapObject._controlCorners.topright.hidden = true
      }
    },
    baselayer(newValue){
      if (!this.$refs.tileProviders){
        // On first load, the reference is not yet active so use the basemap
        // dictionary here.
        let lyr
        if (this.baselayer){
          lyr = this.basemapProviders.find(item => item.slug == newValue)
        }
        if (!lyr) {
          lyr = this.basemapProviders[0]
        }
        lyr.visible = true
      } else if(this.baselayer) {
        // Select new baselayer based on new set value.
        const lmap = this.$refs.map.mapObject
        this.basemapRefs.forEach(function(ref){
          if(ref.$attrs.slug == newValue) {
            lmap.addLayer(ref.mapObject)
          } else if (lmap.hasLayer(ref.mapObject)) {
            lmap.removeLayer(ref.mapObject)
          }
        })
      }
    }
  },
  mounted: function() {
    // Instantiate location search bar.
    const searchLayer = L.layerGroup().addTo(this.$refs.map.mapObject)
    this.$refs.map.mapObject.addControl(searchLayer)
    // Instantiate home button.
    this.defaultExtent = L.control.defaultExtent({position: 'topright', title: this.hoverInfo.defaultZoom}).addTo(this.$refs.map.mapObject);
    this.$refs.map.mapObject.keyboard.disable();
    // Activate mblayers.
    this.addMbLayers()
  },
  methods:  {
    ...mapActions('map', {
      mapSetBounds: actionTypes.MAP_SET_BOUNDS,
      mapSetBaselayer: actionTypes.MAP_SET_BASELAYER,
      mapSetLOpacity: actionTypes.MAP_SET_L_OPACITY,
      mapSetPOpacity: actionTypes.MAP_SET_P_OPACITY,
      setZoom: actionTypes.MAP_SET_ZOOM,
    }),
    /**
     * Set selected option on URL based on index
     */
    setMapOption(event){
      const selected = this.basemapProviders.find(item => item.name === event.name);
      this.$router.replace({query: {...this.$route.query, mapOption: selected.slug}});
      this.mapSetBaselayer(selected.slug)
    },
    updateBounds(){
      const center = this.$refs.map.mapObject.getCenter()
      this.$router.replace({query: {...this.$route.query, zoom: this.$refs.map.mapObject.getZoom()}});
      this.setZoom(this.$refs.map.mapObject.getZoom())
      this.$router.replace({query: {...this.$route.query, centerLat: center.lat }});
      this.$router.replace({query: {...this.$route.query, centerLng: center.lng }});
    },
    setOpacitySlider() {
       if (this.algebraSlider !== null) {
        this.$refs.map.mapObject.removeControl(this.algebraSlider)
      }
      // Instantiate opacity control.
      this.algebraSlider = L.control.range({
        position: 'topright',
        min: 0,
        max: 1,
        value: this.lOpacity,
        step: 0.1,
        orient: 'vertical',
        iconClass: 'leaflet-range-icon leaflet-range-layer'
      })
      // Bind slider change route update function.
      const that = this
      const funk = this.mapSetLOpacity
      this.algebraSlider.on('input change', function(e) {
        funk(parseFloat(e.value))
        that.$router.replace({query: {...that.$route.query, lOpacity: e.value}})
      })

      this.$refs.map.mapObject.addControl(this.algebraSlider)
    },

    setOpacitySliderPredictedLayer () {
      if (this.predictedSlider !== null) {
        this.$refs.map.mapObject.removeControl(this.predictedSlider)
      }
      // Instantiate predicted layer opacity control.
      this.predictedSlider = L.control.range({
        position: 'topright',
        min: 0,
        max: 1,
        value: this.pOpacity,
        step: 0.1,
        orient: 'vertical',
        iconClass: 'leaflet-range-icon leaflet-range-predicted'
      })
      const that = this
      const funk = this.mapSetPOpacity
      this.predictedSlider.on('input change', function(e) {
        funk(parseFloat(e.value))
        that.$router.replace({query: {...that.$route.query, pOpacity: e.value}})
      });

      this.$refs.map.mapObject.addControl(this.predictedSlider)
    },

    showVectorDetails(e){
      const rgbValidation = this.selectedFormula.acronym == 'RGB' && !this.selectedPredictedLayer

      notifications.closeAll()
      notifications({
        title: `${e.layer.properties.name}`,
        buttonName: rgbValidation ? '' : 'Area Report',
        table: rgbValidation ? false : true,
        position: 'bottom',
        offset: 105,
        onClick: rgbValidation ? '' : this.showReportFromPopup.bind(this, e),
        tableData: this.attributeTableData(e.layer.properties),
        haveAttributes: Object.entries(e.layer.properties).length >= 3 ? true : false
      })
    },
    // Create attributes for notification
    attributeTableData(e) {
      return Object.entries(e).filter(dat => dat[0] != 'name' && dat[0] != 'id').map(dat => {
        return {
            attribute: dat[0],
            value: dat[1]
          }
      })
    },

    showReportFromPopup(e) {
      if(this.selectedPredictedLayer) {
        this.$router.push({
          name: routeTypes.REPORT_PREDICTED_AREA,
          params: {
            layer: this.selectedLayer.id,
            predictedLayer: this.selectedPredictedLayer.id,
            area: e.layer.properties.id
          }
        })
      } else {
        this.$router.push({
          name: routeTypes.REPORT_AREA,
          params: {
            layer: this.selectedLayer.id,
            formula: this.selectedFormula.id,
            area: e.layer.properties.id
          }
        })
      }
      notifications.closeAll()
    },

    addMbLayers(){
      if (this.profile && this.profile.baselayers) {
        const lmap = this.$refs.map.mapObject
        lmap.createPane('mapbox');
        lmap.getPane('mapbox').style.zIndex = 650;
        const mblayers = this.profile.baselayers.split(',').filter(lyr => { return lyr.startsWith('mapbox://')})
        mblayers.forEach(function(lyr){
          const mbdata = lyr.split('|')
          L.mapboxGL({
              id: 'mbone',
              style: mbdata[0],
              accessToken: mbdata[1],
              pane: 'mapbox'
          }).addTo(lmap);

          // When a click event occurs on a feature in the places layer, open a popup at the
          // location of the feature, with description HTML from its properties.
          // map.on('click', 'mbone', function (e) {
          // var coordinates = e.features[0].geometry.coordinates.slice();
          // var description = e.features[0].properties.description;
          //
          // // Ensure that if the map is zoomed out such that multiple
          // // copies of the feature are visible, the popup appears
          // // over the copy being pointed to.
          // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          // coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          // }
          //
          // new mapboxgl.Popup()
          // .setLngLat(coordinates)
          // .setHTML(description)
          // .addTo(map);
          // });
          // Change the cursor to a pointer when the mouse is over the places layer.
          // map.on('mouseenter', 'places', function () {
          // map.getCanvas().style.cursor = 'pointer';
          // });
          //
          // // Change it back to a pointer when it leaves.
          // map.on('mouseleave', 'places', function () {
          // map.getCanvas().style.cursor = '';
          // });


        })
      }
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

    showReport(){
      if(this.selectedPredictedLayer){
        notifications.closeAll()
        this.$router.push({
          name: routeTypes.REPORT_PREDICTED,
          params: {
            layer: this.selectedLayer.id,
            predictedLayer: this.selectedPredictedLayer.id
          }
        })
      } else {
        if (this.selectedFormula && this.selectedFormula.acronym == 'RGB') {
          this.$alert('Reports are not available for RGB layer. Please select a different layer.', 'Report Information:', {
            confirmButtonText: 'OK',
            showClose: false
          });
          return
        }
        notifications.closeAll()
        this.$router.push({
          name: routeTypes.REPORT,
          params: {
            layer: this.selectedLayer.id,
            formula: this.selectedFormula.id
          }
        })
      }
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

      var that = this

      // Fetch leaflet canvas.
      leafletImage(this.$refs.map.mapObject, function(err, canvas) {
        // Get image text and image data.
        that.exportData[id].map_canvas = canvas
        that.exportData[id].moment_name = that.selectedMoment.name

        // Callback for export.
        that.dataCallback(id)
      })

      // Capture formula legend, on touch the legends are not shown so skip this.
      if (this.selectedFormula && this.selectedFormula.formula != 'RGB' && !this.isTouch) {
        html2canvas(document.querySelector(".layer-legend")).then(legend_canvas => {
          that.exportData[id].formula_legend = legend_canvas
          that.exportData[id].layer_name = this.selectedFormula.acronym
          // Callback for export.
          that.dataCallback(id)
        });
      } else {
        this.exportData[id].formula_legend = null
        // Callback for export.
        that.dataCallback(id)
      }

      // Capture predicted layer legend, on touch the legends are not shown so skip this.
      if (this.selectedPredictedLayer && !this.isTouch) {
        html2canvas(document.querySelector(".predicted-legend")).then(legend_canvas => {
          that.exportData[id].predicted_legend = legend_canvas
          that.exportData[id].layer_name = this.selectedPredictedLayer.classifierName
          // Callback for export.
          that.dataCallback(id)
        });
      } else {
        this.exportData[id].predicted_legend = null
        // Callback for export.
        that.dataCallback(id)
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
      top: 295px;
      width: 34px;
      right: 0;
      margin-left: 40px;
      z-index: 0;

      &:nth-last-of-type(2) {
        right: 40px;
        margin-left: 0;
      }
    }
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
    padding: 0px !important;
    width: 30px;
    height: 30px;
    color: #606266 !important;
    &:hover{
      background-color: #f4f4f4 !important;
      border-color: #f4f4f4 !important;
      color: #606266 !important;
    }
  }

  // Alert message box
  .el-message-box__title {
    font-size: 20px;
  }

  .leaflet-control-container .leaflet-right {
    .leaflet-control-geosearch {
      form {
        right: 35px;
        border-radius: 4px;
        border-right: inherit;

        input {
          margin-left: -8px;
          margin-right: -8px;
        }
      }

      a.reset {
        &:hover {
          border-bottom: none;
        }
      }
    }
  }
</style>