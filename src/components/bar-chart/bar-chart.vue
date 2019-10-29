<template>
  <horizontal-bar
    :options="options"
    :height="height"
    :styles="myStyles"
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
    }
  },
  data(){
    return {
      options: {
        maintainAspectRatio: false,
        legend: false
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
    const CHART_MAX_HEIGHT = 500
    const height_computed = this.labels.length * BAR_LINE_HEIGHT
    this.height = Math.min(CHART_MAX_HEIGHT, height_computed)
  }
}
</script>
