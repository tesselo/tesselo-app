<template>
  <div class="tsl-map">
    <Map
      ref="map"
      :zoom="13"
      :center="[47.413220, -1.219482]">
      <tile-layer url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png" />
    </map>
  </div>  
</template>
<script>
import L from 'leaflet'


import 'leaflet-control-geocoder'
import 'leaflet-control-geocoder/dist/Control.Geocoder.css'

import { Map, TileLayer } from 'vue2-leaflet'

export default {
  name: 'TslMap',
  components: {
    Map,
    TileLayer
  },
  mounted: function() {
    L.Control.geocoder().addTo(this.$refs.map.mapObject)

    var searchLayer = L.layerGroup().addTo(this.$refs.map.mapObject)
    this.$refs.map.mapObject.addControl(searchLayer)

this.$refs.map.mapObject.zoomControl.remove()
    L.control.zoom({ position:'topright' }).addTo(this.$refs.map.mapObject)
  }
}
</script>
<style lang="scss">
  @import 'lib/leaflet.css';

  .tsl-map {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    z-index: 1;
  }
</style>
