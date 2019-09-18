<template>
  <div
    :class="['map-export-wrapper']">
    <h4>Export Pages</h4>
    <template v-if="data.length">
      <ul class="map-list">
        <li
          v-for="(exportPage, index) in data"
          :key="index"
          class="map-export__entry">
          <label
            :title="exportPage"
            class="map-export__name" >
            {{ index + 1 }}. {{ exportPage }}
          </label>
        </li>
      </ul>
    </template>
    <el-button
    <el-button type="primary" icon="el-icon-save"
      @click="$emit('print-pdf')" >
      Print
    </el-button>
    <el-button type="primary" icon="el-icon-delete" @click="$emit('clear-exports')"></el-button>
    <!-- <el-button
      type="text"
      size="mini"
       >
      Clear List
    </el-button> -->
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  }
}
</script>


<style lang="scss">
  .map-export-wrapper {
    position: fixed;
    z-index: 1000;
    width: 155px;
    background: white;
    padding: 10px;
    border-radius: 3px;

    &__touch {
      top: 38%;
    }

    label {
      padding-bottom: 2px;
      display: block;
      font-size: 12px;
      margin-bottom: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .map-legend {
      width: 100%;
      height: 20px;
      display: flex;
      justify-content: space-between;

      &__partial {
        height: 100%;

        &--tooltip {
          cursor: pointer;

          &:hover {
            border: 1px solid #303133;
          }
        }
      }
    }

    .map-legend-limits {
      display: flex;
      padding-top: 2px;
      font-size: 12px;

      span:nth-child(1) {
        flex: 1;
        text-align: left;
      }

      span:nth-child(2) {
        flex: 1;
        text-align: right;
      }
    }

    .map-legend-tip {
      font-size: 10px;
    }

    .map-list {
      max-height: 260px;
      overflow: auto;

      &__entry {
        margin-top: 8px;
        display: flex;
      }

      &__color {
        width: 20px;
        height: 20px;
        flex: 0 0 20px;
      }

      &__name {
        margin-left: 6px;
        max-width: calc(100% - 30px);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 20px;
        font-size: 12px;
      }
    }
  }
</style>
