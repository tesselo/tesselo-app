<template>
  <div class="tsl-map">
    <Map
      :zoom="13"
      :center="[47.413220, -1.219482]">
      <tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
      <marker :lat-lng="[47.413220, -1.219482]" />
    </map>
  </div>  
</template>
<script>
import 'leaflet/dist/leaflet.css'
import { Map, TileLayer, Marker } from 'vue2-leaflet'


export default {
  name: 'TslMap',
  components: {
    Map,
    TileLayer,
    Marker
  }
}
</script>
<style lang="scss" scoped>
  .tsl-map {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    z-index: 1;
    background-color: rgba(red, 0.2);
  }
</style>
