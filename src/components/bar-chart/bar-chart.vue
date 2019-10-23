<template>
  <horizontal-bar
    ref="horizontalBar"
    :height="height"
    :chart-data="chartData" />
</template>

<script>
import HorizontalBar from './reactive-bar-chart'

export default {
  name: 'BarChart',

  components: {
    HorizontalBar
  },

  props: {
    labels: {
      type: Array,
      required: true
    },
    datasets: {
      type: Array,
      required: true
    },
    options: {
      type: Object,
      required: false,
      default () {
        return {
          responsive: false,
          maintainAspectRatio: false
        }
      }
    }
  },

  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: this.datasets
      }
    },
    myStyles(){
      return {
        height: `${this.height}px`,
        position: 'relative'
      }
    }
  },

  created () {
    const BAR_LINE_HEIGHT = 40
    this.height = this.labels.length * BAR_LINE_HEIGHT
  }
}
</script>
