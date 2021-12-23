<template>
  <div>

  </div>
</template>

<script>
import { GeoSearchControl } from 'leaflet-geosearch';

export default {
  props: {
    options: {
      required: true,
    },
  },
  name: 'v-geosearch',
  mounted() {
    this.add();
  },
  beforeDestroy() {
    this.remove();
  },
  methods: {
    deferredMountedTo(parent) {
      const searchControl = new GeoSearchControl(this.options);
      parent.addControl(searchControl);
    },
    remove() {
      if (this.markerCluster) {
        this.$parent.removeLayer(this.markerCluster);
      }      
    },
    add() {
      if (this.$parent._isMounted) {
        this.deferredMountedTo(this.$parent.mapObject);
      }
    },
  },
};
</script>

<style lang="scss">
.leaflet-control-container .leaflet-right {
    .leaflet-control-geosearch {
      form {
        right: 35px;
        border-radius: 4px 4px 4px 4px;
        border: 2px solid rgba(0, 0, 0, 0.2);
        top: -2px;
        box-shadow: none;

        input {
          padding-right: 30px;
          text-indent: 8px;
          height: 30px;
        }       
      }
      
      form.open {
        width: auto;
      }

      a.reset {
        line-height: 30px;
        height: 30px;
        border-radius: 0px 4px 4px 0px;
        font-weight: lighter;
        font-size: 22px;
        color: #606266;
        
        &:hover {
          border-bottom: none;
        }
      }

      a.leaflet-bar-part {
        width: 30px;

        &::before {
          top: 20px;
          left: 17px;
          width: 7px;
          border-top: 1px solid #606266;
        }

        &::after {
          top: 7px;
          left: 7px;
          height: 13px;
          width: 13px;
          border: 1px solid #606266;
        }
      }

      .results.active {
        &::after {
          border-left: none;
        }
      }
    }

    .leaflet-geosearch-button {
      form {
        max-width: none;
      }
    }
  }
</style>