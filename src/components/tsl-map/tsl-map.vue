<template>
  <div class="tsl-map">
    <Map
      ref="map"
      :zoom="15"
      :center="[41.1471288,-8.6116238]">
      <tile-layer url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png" />
      <tile-layer url="https://tesselo.com/api/algebra/{z}/{x}/{y}.png?layers=r=26936,g=26934,b=26932&scale=10,3e3&alpha" />
    </map>
  </div>  
</template>
<script>
import Leaflet from 'leaflet'
import attachHomeControl from './lib/leaflet.home'
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
    Leaflet.Control.geocoder().addTo(this.$refs.map.mapObject)

    var searchLayer = Leaflet.layerGroup().addTo(this.$refs.map.mapObject)
    this.$refs.map.mapObject.addControl(searchLayer)

    attachHomeControl(Leaflet)

    const homeControl = new Leaflet.Control.Home({
      map: this.$refs.map.mapObject
    })

    this.$refs.map.mapObject.addControl(homeControl)

    this.$refs.map.mapObject.zoomControl.remove()
    Leaflet.control.zoom({ position:'topright' }).addTo(this.$refs.map.mapObject)
  }
}
</script>
<style lang="scss">
  @import 'lib/leaflet.css';
  @import 'lib/leaflet.home.css';

  .tsl-map {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    z-index: 1;
  }
</style>
