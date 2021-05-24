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
    stacked: {
      type: Boolean,
      required: false,
      default: false
    },
    discreteArea: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    options() {
      const opt = {
        maintainAspectRatio: false,
        legend: false     
      }
      
      if (this.discreteArea) {
        opt.tooltips = {
          enabled: false
        }
        opt.hover = {
          mode: null
        }  
      }
      
      if (this.stacked) {
        opt.scales = {
          xAxes: [{
            stacked: true,
            scaleLabel: {
              display: true,
              labelString: 'Area [ha]',
            }
          }],
          yAxes: [{
            stacked: true,
          }]
        }
      }
      return opt
    },
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

  created() {
    const BAR_LINE_HEIGHT = 40
    const CHART_MAX_HEIGHT = 500
    const height_computed = this.labels.length * BAR_LINE_HEIGHT
    this.height = Math.min(CHART_MAX_HEIGHT, height_computed)
  }
}
</script>
