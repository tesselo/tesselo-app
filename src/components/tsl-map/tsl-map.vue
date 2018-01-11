<template>
  <div class="tsl-map">
    <Map
      ref="map"
      :zoom="13"
      :center="[47.413220, -1.219482]">
      <tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
    </map>
  </div>  
</template>
<script>
import 'leaflet-search'
import 'leaflet/dist/leaflet.css'
import 'leaflet-search/dist/leaflet-search.min.css'

import { Map, TileLayer } from 'vue2-leaflet'

export default {
  name: 'TslMap',
  components: {
    Map,
    TileLayer
  },
  mounted: function() {
    var searchLayer = window.L.layerGroup().addTo(this.$refs.map.mapObject);
    this.$refs.map.mapObject.addControl( new window.L.Control.Search({layer: searchLayer, position:'topright'}) );

    this.$refs.map.mapObject.zoomControl.remove()
    window.L.control.zoom({ position:'topright' }).addTo(this.$refs.map.mapObject);
  }
}
</script>
<style lang="scss">
  .tsl-map {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    z-index: 1;
    background-color: rgba(red, 0.2);
  }

  .leaflet-container .leaflet-control-search {
    margin-left: 1px;
  }

  .tsl-map .search-button {
    width: 30px;
  }
</style>
