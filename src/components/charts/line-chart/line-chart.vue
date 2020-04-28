<template>
  <line-chart
    :options="options"
    :height="height"
    :styles="myStyles"
    :chart-data="chartData" />
</template>

<script>
import LineChart from './reactive-line-chart'

export default {

  components: {
    LineChart
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
    }
  },

  computed: {
    options() {
      const opt = {
        maintainAspectRatio: false,
        legend: false
      }
      // Add stacked options if required.
      if (this.stacked) {
        opt.scales = {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            stacked: true
          }]
        }
        opt.fill = true
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
        height: "200px",
        position: 'relative'
      }
    }
  }
}
</script>
