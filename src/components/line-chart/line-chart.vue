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
    options: {
      type: Object,
      required: false,
      default: () => {
        return {
          maintainAspectRatio: false,
          legend: false
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
        height: "200px",
        position: 'relative'
      }
    }
  }
}
</script>
