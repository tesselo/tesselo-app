<template>
  <div
    :class="['map-legend-wrapper', {
    'map-legend-wrapper__touch': isTouch == true}]">
    <label v-if="label"> {{ label }} </label>
    <template v-if="format === 'legend'">
      <div
        :style="legendStyle"
        class="map-legend">
        <template v-for="entry in data">
          <el-tooltip
            v-if="entry.name"
            :key="`tooltip-${entry.color}`"
            :content="entry.name"
            :open-delay="200"
            class="item"
            effect="dark"
            placement="top">
            <div
              :style="legendPartialStyle"
              class="map-legend__partial map-legend__partial--tooltip"/>
          </el-tooltip>
          <div
            v-else
            :key="entry.color"
            :style="legendPartialStyle"
            class="map-legend__partial" />
        </template>
      </div>
      <div class="map-legend-limits">
        <span v-if="min === 0 || min"> {{ min }} </span>
        <span v-if="max === 0 || max"> {{ max }} </span>
      </div>
      <div
        v-if="tip"
        class="map-legend-tip">
        {{ tip }}
      </div>
    </template>
    <template v-if="format === 'list'">
      <ul class="map-list">
        <li
          v-for="entry in data"
          :key="`list-color-${entry.color}`"
          class="map-list__entry">
          <div
            :style="{'background-color': entry.color}"
            class="map-list__color" />
          <div class="map-list__name"> {{ entry.name }} </div>
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    min: {
      type: Number,
      default: null
    },
    max: {
      type: Number,
      default: null
    },
    tip: {
      type: String,
      default: ''
    },
    format: {
      type: String,
      default: 'legend',
      validator: value => [
        'legend',
        'list'
      ].includes(value)
    },
  },

  computed: {
    isTouch() {
      return this.$deviceInfo.isTouch;
    },
    legendStyle () {
      var colors = this.data.map(entry => entry.color)
      colors.join(',')
      return `background: linear-gradient(to right, ${colors})`
    },

    legendPartialStyle () {
      // 90% is used to disallow the overlap of tooltips between each partial
      // so we can preserve a margin between each legend's partial
      const totalPercentagePartialsWidth = 100

      return `width: ${totalPercentagePartialsWidth / this.data.length}%;`
    },
  }
}
</script>


<style lang="scss">
  .map-legend-wrapper {
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
      display: block;
      font-size: 12px;
      margin-bottom: 8px;
      white-space: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.2em;
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
      max-height: 45vh;
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
